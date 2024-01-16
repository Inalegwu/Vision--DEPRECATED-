import { Box, ContextMenu, Flex, Text } from "@radix-ui/themes";
import { Issue } from "@shared/types";
import { trpcReact } from "@src/shared/config";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { readingState } from "../state";
import { AnimatedBox } from "./atoms";

type Props = {
  issue: Issue;
};

export default function IssueCard(props: Props) {
  const router = useNavigate();
  const utils = trpcReact.useUtils();

  const currentlyReading = readingState.currentlyReading.get();

  const savedInfo = currentlyReading.find((v) => v.id === props.issue.id);

  const { mutate, isLoading: _deleting } =
    trpcReact.issue.removeIssue.useMutation({
      onError: (err) => {
        console.log(err);
        throw new Error(err.message, {
          cause: err.shape,
        });
      },
      onSuccess: () => {
        utils.issue.invalidate();
        utils.library.invalidate();
        utils.collection.getIssuesInCollection.invalidate();
        toast.success(`${props.issue.name} Deleted Successfully`);
      },
    });

  const handleClick = useCallback(() => {
    router(`/${props.issue.id}`);
  }, [props.issue, router]);

  const editIssue = useCallback(() => {
    router(`/editIssue/${props.issue.id}`);
  }, [props.issue, router]);

  const deleteIssue = useCallback(() => {
    mutate({
      id: props.issue.id,
    });
  }, [props.issue, mutate]);

  return (
    <ContextMenu.Root>
      {/* context menu */}
      <ContextMenu.Trigger
        onClick={handleClick}
        className="cursor-pointer ml-1"
      >
        <Flex
          direction="column"
          gap="1"
          width="auto"
          height="auto"
          className="overflow-hidden"
        >
          <Box className="relative overflow-hidden">
            <img
              src={props.issue.thumbnailUrl}
              alt={props.issue.name}
              className="w-44 h-65 overflow-hidden  rounded-md border-[0.1px] border-solid border-slate-400"
            />
            <Box className="absolute z-1 top-0 left-0 bg-black/70 p-2 flex flex-col space-y-2  items-start justify-end w-full h-[98%] rounded-md">
              <Text weight="light" size="2" className="w-full">
                {props.issue.name}
              </Text>
              {currentlyReading && savedInfo && (
                <Box className="w-full bg-gray-500/40 rounded-full">
                  <AnimatedBox
                    initial={{ width: "0%" }}
                    animate={{
                      width: `${(savedInfo.page / savedInfo.total) * 100}%`,
                    }}
                    className="p-[2.4px] rounded-full bg-purple-300"
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Flex>
      </ContextMenu.Trigger>
      <ContextMenu.Content
        className="p-0 rounded-sm gap-2"
        variant="soft"
        size="2"
      >
        <ContextMenu.Item onClick={editIssue}>
          <Text>Edit Issue Info</Text>
        </ContextMenu.Item>
        <ContextMenu.Item color="red" onClick={deleteIssue}>
          Delete {props.issue.name}
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
