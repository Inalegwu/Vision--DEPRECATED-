import { object, string, toTrimmed } from "valibot";

export const CreateCollectionSchema = object({
  name: string([toTrimmed()]),
});

export const IdSchema = object({
  id: string([toTrimmed()]),
});

export const AddSchema = object({
  // who you're adding to
  ownerId: string([toTrimmed()]),
  // who is being added
  childId: string([toTrimmed()]),
});

export const ChangeNameSchema = object({
  id: string([toTrimmed()]),
  name: string([toTrimmed()]),
});
