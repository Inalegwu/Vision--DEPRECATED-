import { object, string, toTrimmed } from "valibot";

export const CreateCollectionSchema = object({
  name: string([toTrimmed()]),
});

export const IdSchema = object({
  id: string([toTrimmed()]),
});

export const AddIssueSchema = object({
  collectionId: string([toTrimmed()]),
  issueId: string([toTrimmed()]),
});

export const ChangeNameSchema = object({
  id: string([toTrimmed()]),
  name: string([toTrimmed()]),
});
