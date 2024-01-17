import { useObservable } from "@legendapp/state/react";
import { CaretLeftIcon, Pencil1Icon } from "@radix-ui/react-icons";
import {
  Badge,
  Box,
  Button,
  Dialog,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import { trpcReact } from "@shared/config";
import { IssueParams } from "@shared/types";
import moment from "moment";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../components";
import { AnimatedBox } from "../components/atoms";

// TODO implement fetching comic data from comixology
// and saving it to the database under the metadata table

export default function EditIssue() {
  const utils = trpcReact.useUtils();
  const router = useNavigate();
  const { issueId } = useParams<IssueParams>();

  if (!issueId) {
    return;
  }

  const issueName = useObservable("");

  // navigate backwards
  const goBack = useCallback(() => {
    // @ts-ignore this allows the app to simply
    // go back a page
    router(-1, {
      unstable_viewTransition: true,
    });
  }, [router]);

  // get the issues information , like the name and the rest
  const { data: issue, isLoading: gettingIssue } =
    trpcReact.issue.getIssueData.useQuery(
      { id: issueId || "" },
      {
        onSuccess: (d) => {
          issueName.set(d?.data?.name);
        },
      },
    );

  // apply the name changes from the app
  const { mutate: updateIssueName, isLoading: _updatingIssue } =
    trpcReact.issue.changeIssueName.useMutation({
      onSuccess: () => {
        utils.issue.invalidate();
        utils.library.invalidate();
        utils.collection.invalidate();
      },
    });

  const saveChanges = useCallback(() => {
    updateIssueName({
      id: issueId,
      name: issueName.get(),
    });
  }, [issueName, updateIssueName, issueId]);

  return (
    <Layout>
      <Box className="w-full h-screen flex">
        {/* left content/metadata */}
        <Flex gap="3" direction="column" className="h-full w-[60%] p-4">
          {/* nav */}
          <Flex align="start" justify="start">
            <Button onClick={goBack} variant="soft">
              <CaretLeftIcon />
            </Button>
          </Flex>
          <Flex>
            <Flex align="center" justify="between" className="w-full">
              <Text size="8" weight="bold" className="max-w-[60%]">
                {issue?.data.name}
              </Text>
              <Dialog.Root>
                <Dialog.Trigger>
                  <Button variant="ghost" className="w-6 h-8 ml-4 rounded-full">
                    <Pencil1Icon />
                  </Button>
                </Dialog.Trigger>
                <Dialog.Content size="1" className="space-y-2">
                  <Heading>Change Issue Title</Heading>
                  <Dialog.Description>
                    <Text>
                      You can change the saved name of any one of your issues.
                    </Text>
                    <br />
                    <Text>this doesn't affect the file on your device 🪄</Text>
                  </Dialog.Description>
                  <Flex direction="column" className="space-y-3">
                    <TextField.Root>
                      <TextField.Input
                        value={issueName.get()}
                        onChange={(e) => issueName.set(e.currentTarget.value)}
                        size="3"
                        placeholder="New name"
                      />
                    </TextField.Root>
                    <Flex align="center" gap="3">
                      <Dialog.Close>
                        <Button color="gray" variant="soft">
                          Cancel
                        </Button>
                      </Dialog.Close>
                      <Dialog.Close>
                        <Button
                          onClick={saveChanges}
                          color="mint"
                          variant="soft"
                        >
                          Save Changes
                        </Button>
                      </Dialog.Close>
                    </Flex>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>
            </Flex>
          </Flex>
          <Flex>
            <Badge className="p-1" variant="soft" color="amber">
              Added {moment(issue?.data.dateCreated).fromNow()}
            </Badge>
          </Flex>
        </Flex>
        {/* right content / image */}
        <Box className="h-full w-[40%] p-4 flex flex-col items-center content-center justify-center gap-4">
          <img
            src={issue?.data.thumbnailUrl}
            alt={issue?.data.name}
            className="w-80 h-99 rounded-md border-1 border-solid border-slate-500"
          />
          {gettingIssue && (
            <AnimatedBox
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              css={{
                padding: "$lg",
                background: "$lightGray",
                borderRadius: "$md",
              }}
            />
          )}
          <Text className="w-[50%] text-center" size="4">
            {issueName.get()}
          </Text>
        </Box>
      </Box>
    </Layout>
  );
}
