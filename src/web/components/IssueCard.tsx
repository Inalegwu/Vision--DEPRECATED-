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
      <ContextMenu.Trigger onClick={handleClick} style={{ cursor: "pointer" }}>
        <Flex
          direction="column"
          gap="1"
          width="auto"
          height="auto"
          style={{
            borderRadius: 20,
          }}
        >
          <Image
            src={props.issue.thumbnailUrl}
            css={{
              width: 183,
              height: 265,
              borderRadius: "$md",
              border: "0.1px solid rgba(0,0,0,0.2)",
              overflow: "hidden",
            }}
          />
          <Text weight="light">{props.issue.name}</Text>
        </Flex>
      </ContextMenu.Trigger>
      <ContextMenu.Content variant="soft" size="2">
        <ContextMenu.Item onClick={editIssue}>
          <Text>Edit Issue Info</Text>
        </ContextMenu.Item>
        <ContextMenu.Item color="red" onClick={deleteIssue}>
          <Text>Delete Issue</Text>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
