import { ContextMenu, Flex, Text } from "@radix-ui/themes";
import { Issue } from "@shared/types";
import { trpcReact } from "@src/shared/config";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { readingState } from "../state";
import { Image } from "./atoms";

type Props = {
  issue: Issue;
};

export default function IssueCard(props: Props) {
  const router = useNavigate();
  const utils = trpcReact.useUtils();

  const currentlyReading = readingState.currentlyReading
    .get()
    .find((v) => v.id === props.issue.id);

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

  const deleteIssue = useCallback(() => {
    mutate({
      id: props.issue.id,
    });
  }, [props.issue, mutate]);

  return (
    <ContextMenu.Root>
      {/* context menu */}
      <ContextMenu.Trigger onClick={handleClick} style={{ cursor: "pointer" }}>
        <Flex
          direction="column"
          gap="1"
          width="auto"
          height="auto"
          style={{ borderRadius: 20 }}
        >
          <Image
            src={props.issue.thumbnailUrl}
            css={{
              width: 180,
              borderRadius: "$md",
            }}
          />
          <Text weight="light">{props.issue.name}</Text>
        </Flex>
      </ContextMenu.Trigger>
      <ContextMenu.Content variant="soft" size="1">
        <ContextMenu.Item onClick={deleteIssue}>
          <Text>Delete Issue</Text>
        </ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item>
          <Text>Edit Issue Info</Text>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
