import { useObservable } from "@legendapp/state/react";
import { CaretLeft, Pencil, X } from "@phosphor-icons/react";
import { trpcReact } from "@shared/config";
import { IssueParams } from "@shared/types";
import moment from "moment";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HStack, Layout, VStack } from "../components";
import {
  AnimatedBox,
  Box,
  Button,
  Image,
  Input,
  Text,
} from "../components/atoms";

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
      <Box
        css={{ width: "100%", height: "100%", display: "flex", padding: "$sm" }}
      >
        {/* left content/metadata */}
        <VStack
          alignContent="flex-start"
          alignItems="flex-start"
          justifyContent="space-between"
          style={{ height: "100%", width: "60%" }}
        >
          {/* navigation */}
          <HStack
            alignContent="center"
            alignItems="center"
            justifyContent="flex-start"
            style={{ padding: "$xl", borderRadius: "$md" }}
          >
            <Button
              onClick={goBack}
              css={{
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                padding: "$lg",
                background: "$primary",
                color: "$white",
                borderRadius: "$md",
              }}
            >
              <CaretLeft size={16} />
            </Button>
          </HStack>
          {/* edit metaData view */}
          <VStack
            alignContent="center"
            alignItems="center"
            justifyContent="center"
            style={{ width: "100%", padding: "$xl" }}
          >
            <HStack
              style={{ width: "100%" }}
              alignContent="center"
              alignItems="center"
              justifyContent="space-between"
              gap={5}
            >
              {editingName.get() ? (
                <>
                  <Input
                    onKeyDown={handleKeyDown}
                    value={issueName.get()}
                    onChange={(e) => issueName.set(e.currentTarget.value)}
                    css={{
                      width: "80%",
                      padding: "$md",
                      borderRadius: "$md",
                      border: "0.1px solid $lightGray",
                      background: "$blackMuted",
                      color: "$white",
                    }}
                  />
                </>
              ) : (
                <>
                  <Text>{issueName.get()}</Text>
                </>
              )}
              <Button
                onClick={() => editingName.set(!editingName.get())}
                css={{
                  color: "$white",
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "$blackMuted",
                  borderRadius: "$full",
                  padding: "$lg",
                  "&:hover": { color: "$primary" },
                }}
              >
                {editingName.get() ? (
                  <>
                    <X size={14} />
                  </>
                ) : (
                  <>
                    <Pencil size={14} />
                  </>
                )}
              </Button>
            </HStack>
          </VStack>
          {/* misc. info */}
          <HStack
            style={{ width: "100%", padding: "$xl" }}
            alignContent="center"
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack
              alignContent="center"
              alignItems="center"
              justifyContent="flex-start"
            >
              <Text css={{ color: "$lightGray", fontSize: 14 }}>
                Added {moment(issue?.data.dateCreated).fromNow()}
              </Text>
            </HStack>
          </HStack>
        </VStack>
        {/* right content / image */}
        <Box
          css={{
            height: "100%",
            width: "40%",
            padding: "$lg",
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            gap: "$md",
          }}
        >
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
          <Text
            css={{
              width: "50%",
              marginTop: "$lg",
              textAlign: "center",
              fontSize: 20,
              fontWeight: "bolder",
            }}
          >
            {issueName.get()}
          </Text>
        </Box>
      </Box>
    </Layout>
  );
}
