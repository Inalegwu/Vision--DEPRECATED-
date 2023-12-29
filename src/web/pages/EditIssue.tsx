import { CaretLeft, Pencil, X } from "@phosphor-icons/react";
import { trpcReact } from "@shared/config";
import { IssueParams } from "@shared/types";
import moment from "moment";
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HStack, Layout, VStack } from "../components";
import { Box, Button, Image, Input, Text } from "../components/atoms";

export default function EditIssue() {
  const utils = trpcReact.useUtils();
  const router = useNavigate();
  const { issueId } = useParams<IssueParams>();

  if (!issueId) {
    return;
  }

  const [issueName, setIssueName] = useState<string>("");
  const [editingName, setEditingName] = useState<boolean>(false);

  // navigate backwards
  const goBack = useCallback(() => {
    // @ts-ignore this allows the app to simply 
    // go back a page
    router(-1, {
      unstable_viewTransition: true,
    });
  }, [router]);

  // get the issues information , like the name and the rest
  const { data: issue, isLoading: _fetchingIssue } =
    trpcReact.issue.getIssueData.useQuery(
      { id: issueId || "" },
      {
        onSuccess: (d) => {
          setIssueName(d?.data?.name);
        },
      }
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
          newName: issueName,
        });
        setEditingName(false);
      }
    },
    [issueName, updateIssueName, issueId]
  );

  return (
    <Layout>
      <Box css={{ width: "100%", height: "100%", display: "flex" }}>
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
              <CaretLeft size={15} />
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
              {editingName ? (
                <>
                  <Input
                    onKeyDown={handleKeyDown}
                    value={issueName}
                    onChange={(e) => setIssueName(e.currentTarget.value)}
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
                  <Text>{issueName}</Text>
                </>
              )}
              <Button
                onClick={() => setEditingName(!editingName)}
                css={{
                  color: "$white",
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": { color: "$primary" },
                }}
              >
                {editingName ? (
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
          }}
        >
          <Image
            src={issue?.data.thumbnailUrl}
            css={{
              width: 350,
              height: 500,
              borderRadius: "$md",
              border: "0.1px solid $lightGray",
            }}
          />
          <Text
            css={{
              width: "50%",
              marginTop: "$lg",
              textAlign: "center",
              fontSize: 15,
            }}
          >
            {issueName}
          </Text>
        </Box>
      </Box>
    </Layout>
  );
}
