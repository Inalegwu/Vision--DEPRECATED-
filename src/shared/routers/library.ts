import { trackEvent } from "@aptabase/electron/main";
import { RarExtractor, ZipExtractor } from "@shared/extractors";
import { issues, pages } from "@shared/schema";
import { Reasons } from "@shared/types";
import { convertToImageUrl, decodeMetaData, generateUUID } from "@shared/utils";
import { publicProcedure, router } from "@src/trpc";
import { TRPCError } from "@trpc/server";
import { dialog } from "electron";


// all actions related to the users library of colletions and issues
export const libraryRouter = router({
  addToLibrary: publicProcedure.mutation(async ({ ctx }) => {
    trackEvent("Add To Library");
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

        console.log(sortedFiles[0]?.name, sortedFiles[1]?.name);

        console.log();

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
          if (file.isDir) {
            return;
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

      const { metaDataFile: _md, sortedFiles } = await RarExtractor(
        filePaths[0],
      );

      if (_md) {
        const decodedMeta = decodeMetaData(_md.extraction?.buffer!);
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
          return;
        }

        const content = convertToImageUrl(file.extraction?.buffer!);

        await ctx.db.insert(pages).values({
          id: generateUUID(),
          name: `${createdIssue[0].name}-${file.fileHeader.name}`,
          content,
          issueId: createdIssue[0].id,
        });
      }

      return {
        status: true,
        reason: Reasons.NONE,
      };
    } catch (e) {
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
      trackEvent("Load Library");

      // find all the users saved issues
      const issues = await ctx.db.query.issues.findMany({
        orderBy: (issues, { asc }) => asc(issues.name),
      });

      // get all the users collections from storage
      const collections = await ctx.db.query.collections.findMany({
        with: {
          issues: {
            orderBy:(issues,{desc})=>[desc(issues.name)]
          },
        },
      });

      // filter out all issues that are already included
      // within collections
      const merged = issues.filter(
        (k) => !collections.find((l) => l.issues.find((m) => m.id === k.id)),
      );

      return {
        issues: merged,
        collections,
      };
    } catch (e) {
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
});
