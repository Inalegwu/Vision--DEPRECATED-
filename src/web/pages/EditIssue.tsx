import { useObservable } from "@legendapp/state/react";
import { CaretLeftIcon } from "@radix-ui/react-icons";
import { Badge, Box, Button, Flex, Text } from "@radix-ui/themes";
import { trpcReact } from "@shared/config";
import { IssueParams } from "@shared/types";
import moment from "moment";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../components";
import { AnimatedBox, Image } from "../components/atoms";

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
  const editingName = useObservable(false);

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

  // trigger the update on enter click
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        updateIssueName({
          id: issueId,
          newName: issueName.get(),
        });
        editingName.set(false);
      }
    },
    [issueName, updateIssueName, issueId, editingName],
  );

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
            <Flex align="center" justify="between">
              <Text size="8" weight="bold">
                {issue?.data.name}
              </Text>
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
          <Image
            src={issue?.data.thumbnailUrl}
            css={{
              width: 350,
              height: 500,
              borderRadius: "$md",
              border: "0.1px solid $secondary",
            }}
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
          <Text className="w-[50%]">{issueName.get()}</Text>
        </Box>
      </Box>
    </Layout>
  );
}
