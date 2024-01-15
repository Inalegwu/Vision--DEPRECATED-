import { AlertDialog, Button, ContextMenu, Flex, Text } from "@radix-ui/themes";
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
            className="w-44 h-65 overflow-hidden rounded-md"
          />
          <Text weight="light">{props.issue.name}</Text>
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
        <ContextMenu.Item color="red">
          <AlertDialog.Root>
            <AlertDialog.Trigger color="red">
              <Text>Delete Issue</Text>
            </AlertDialog.Trigger>
            <AlertDialog.Content className="p-2 rounded-lg">
              <AlertDialog.Title>Delete {props.issue.name}</AlertDialog.Title>
              <AlertDialog.Description>
                This will remove {props.issue.name} from your Library , are you
                sure you want to do that
              </AlertDialog.Description>
              <Flex align="center" justify="end" gap="3">
                <AlertDialog.Cancel>
                  <Button color="gray" size="2">
                    Cancel
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button color="red" size="2" onClick={deleteIssue}>
                    Delete {props.issue.name}
                  </Button>
                </AlertDialog.Action>
              </Flex>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
