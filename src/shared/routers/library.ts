import { trackEvent } from "@aptabase/electron/main";
import { RarExtractor, ZipExtractor } from "@shared/extractors";
import { issues, pages } from "@shared/schema";
import { Reasons } from "@shared/types";
import { convertToImageUrl, decodeMetaData, generateUUID } from "@shared/utils";
import { publicProcedure, router } from "@src/trpc";
import { TRPCError } from "@trpc/server";
import { dialog } from "electron";

export const libraryRouter = router({
  addToLibrary: publicProcedure.mutation(async ({ ctx }) => {
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        title: "Select Issue",
        defaultPath: ctx.app.getPath("downloads"),
        buttonLabel: "Add To Library",
        properties: ["openFile"],
        filters: [{ name: "Comic Book Archive", extensions: ["cbz", "cbr"] }],
      });

      if (canceled) {
        return {
          status: false,
          reason: Reasons.CANCELLED,
        };
      }

      // handle zip files
      if (filePaths[0].includes("cbz")) {
        const { sortedFiles, metaDataFile: md } = await ZipExtractor(
          filePaths[0],
        );

        if (md) {
          const _decodedMeta = decodeMetaData(md.data);
        }

        const thumbnailUrl = convertToImageUrl(
          sortedFiles[0]?.data?.buffer || sortedFiles[1]?.data?.buffer,
        );

        // !use the filepath to create the name of the
        // !issue , as the image content cannot be trusted
        // !to have the appropriate name
        const name = filePaths[0]
          .replace(/^.*[\\\/]/, "")
          .replace(/\.[^/.]+$/, "")
          .replace(/(\d+)$/g, "")
          .replace("-", " ");

        // ! ensure the issue isn't already saved
        const issueExists = await ctx.db.query.issues.findFirst({
          where: (issues, { eq }) => eq(issues.name, name),
        });

        // ! Inform the user that this issue already exists
        // ! this ensure space savings in the local database
        if (issueExists) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `${name} , is already in your library`,
            cause: `Tried adding ${name} to library again`,
          });
        }

        const createdIssue = await ctx.db
          .insert(issues)
          .values({
            id: generateUUID(),
            name,
            thumbnailUrl,
          })
          .returning({
            id: issues.id,
            name: issues.name,
          });

        for (const file of sortedFiles) {
          // ! ignore directories
          // ! sometimes the directory
          // ! is converted and the app crashes
          if (file.isDir) {
            continue;
          }

          const content = convertToImageUrl(file.data.buffer);

          await ctx.db.insert(pages).values({
            id: generateUUID(),
            issueId: createdIssue[0].id,
            content,
            name: `${createdIssue[0].name}-${file.name}`,
          });
        }

        return {
          status: true,
          reason: Reasons.NONE,
        };
      }

      const { metaDataFile: md, sortedFiles } = await RarExtractor(
        filePaths[0],
      );

      if (md) {
        const _decodedMeta = decodeMetaData(md.extraction?.buffer!);
      }

      const thumbnailUrl = convertToImageUrl(
        sortedFiles[0]?.extraction?.buffer ||
          sortedFiles[1]?.extraction?.buffer!,
      );

      const name = filePaths[0]
        .replace(/^.*[\\\/]/, "")
        .replace(/\.[^/.]+$/, "")
        .replace(/(\d+)$/g, "")
        .replace("-", " ");

      const issueExists = await ctx.db.query.issues.findFirst({
        where: (issues, { eq }) => eq(issues.name, name),
      });

      if (issueExists) {
        throw new TRPCError({
          message: `${name} , is already in your library`,
          code: "CONFLICT",
          cause: `tried adding issue ${name} again`,
        });
      }

      const createdIssue = await ctx.db
        .insert(issues)
        .values({
          id: generateUUID(),
          name,
          thumbnailUrl,
        })
        .returning({ id: issues.id, name: issues.name });

      for (const file of sortedFiles) {
        if (file.fileHeader.flags.directory) {
          continue;
        }

        await ctx.db.insert(pages).values({
          id: generateUUID(),
          name: `${createdIssue[0].name}-${file.fileHeader.name}`,
          content: convertToImageUrl(file.extraction?.buffer!),
          issueId: createdIssue[0].id,
        });
      }

      return {
        status: true,
        reason: Reasons.NONE,
      };
    } catch (e) {
      console.log(e);
      trackEvent("error_occured", {
        router: "collection",
        function: "addToLibrary",
        // hacky way of sending the error through
        // to aptabase
        error: `${e}`,
      });
      if (e instanceof TRPCError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: e,
          message: e.message,
        });
      }
    }
  }),
  getLibrary: publicProcedure.query(async ({ ctx }) => {
    try {
      const issues = await ctx.db.query.issues.findMany({
        orderBy: (issues, { asc }) => asc(issues.name),
      });

      const collections = await ctx.db.query.collections.findMany({
        with: {
          issues: {
            orderBy: (issues, { desc }) => [desc(issues.name)],
          },
        },
      });

      // if an issue is already in a collection
      // don't include it in the issues list
      const merged = issues.filter(
        (issues) =>
          !collections.find((collection) =>
            collection.issues.find((issue) => issue.id === issues.id),
          ),
      );

      return {
        issues: merged,
        collections,
      };
    } catch (e) {
      trackEvent("error_occured", {
        router: "collection",
        function: "getLibrary",
        error: `${e}`,
      });
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: e,
        message: "Error occured",
      });
    }
  }),
});
