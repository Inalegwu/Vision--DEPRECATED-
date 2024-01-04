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
        const { sortedFiles, metaDataFile: _md } = await ZipExtractor(
          filePaths[0],
        );

        const thumbnailUrl = convertToImageUrl(
          sortedFiles[0]?.data?.buffer || sortedFiles[1]?.data?.buffer!,
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
            code: "INTERNAL_SERVER_ERROR",
            message: `${name} , is already in your library`,
            cause: `Tried adding ${name} to library again`,
          });
        }

        // the issue just created
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
          // ignore extraction contents that are flagged as directories
          // as such the entire folder and as such it's contents won't be
          // serialized into a string
          // else you'll get a text content too large error somewhere else
          if (file.isDir) {
            continue;
          }

          const content = convertToImageUrl(file.data.buffer);

          await ctx.db.insert(pages).values({
            id: generateUUID(),
            // use the id of the issue just created
            // as the pages issue id
            // this allows for an issue and it's pages to remain
            // related
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
        const decodedMeta = decodeMetaData(md.extraction?.buffer!);
        const splitMeta = decodedMeta.split("\n");
        console.log(splitMeta);
      }

      // in the event the first item is a folder
      // the buffer will be undefined , so we can move on
      // to the next item , this will be the first image file
      // in that folder
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
      });
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: e,
        message: "Error occured",
      });
    }
  }),
  getLibrary: publicProcedure.query(async ({ ctx }) => {
    try {
      // find all the users saved issues
      const issues = await ctx.db.query.issues.findMany({
        orderBy: (issues, { asc }) => asc(issues.name),
      });

      // get all the users collections from storage
      const collections = await ctx.db.query.collections.findMany({
        with: {
          issues: {
            orderBy: (issues, { desc }) => [desc(issues.name)],
          },
        },
      });

      // filter out all issues that are already included
      // within collections
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
      });
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: e,
        message: "Error occured",
      });
    }
  }),
});
