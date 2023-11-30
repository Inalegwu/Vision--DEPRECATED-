import { useNavigate, useParams } from "react-router-dom";
import { HStack, IssueCard, Layout, Spinner, VStack } from "../components";
import {
  AnimatedBox,
  Box,
  Button,
  Image,
  LinkButton,
  Text,
} from "../components/atoms";
import { CollectionParams } from "@src/shared/types";
import { CaretLeft, Plus, X } from "@phosphor-icons/react";
import { trpcReact } from "@src/shared/config";
import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";

export default function Collection() {
  const router = useNavigate();
  const utils = trpcReact.useUtils();
  const { collectionId } = useParams<CollectionParams>();

  const [issuesListVisible, setIssuesListVisible] = useState<boolean>(false);

  if (!collectionId) {
    return router("/");
  }

  const { data: collection, isLoading: getting } =
    trpcReact.library.getCollectionById.useQuery({ collectionId });

  const { data: issues, isLoading: gettingIssues } =
    trpcReact.library.getLibrary.useQuery();

  const { mutate: addIssueToLibrary, isLoading: saving } =
    trpcReact.library.addIssueToCollection.useMutation({
      onSuccess: (data) => {
        utils.library.getCollectionById.invalidate();
        utils.library.invalidate();
        setIssuesListVisible(false);
      },
    });

  const addToLibrary = useCallback(
    (v: string) => {
      addIssueToLibrary({ issueId: v, collectionId });
    },
    [collectionId]
  );

  return (
    <Layout>
      <Box css={{ width: "100%", height: "100%", padding: "$lg" }}>
        <HStack
          alignContent="center"
          alignItems="center"
          justifyContent="space-between"
          style={{ height: "3%" }}
        >
          <HStack
            alignContent="center"
            alignItems="center"
            justifyContent="flex-start"
            gap={5}
          >
            <LinkButton
              to="/"
              css={{
                padding: "$md",
                background: "$secondary",
                borderRadius: "$md",
                color: "$white",
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CaretLeft size={17} />
            </LinkButton>
            <Text css={{ fontSize: 20 }}>{collection?.collection!.name}</Text>
          </HStack>
        </HStack>
        <VStack
          alignContent="flex-start"
          alignItems="flex-start"
          justifyContent="flex-start"
          style={{ height: "97%", paddingTop: "$xxl" }}
        >
          {collection?.collection?.issues.length === 0 && (
            <Box css={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <Text css={{ fontSize: 25 }}>Such Empty 😣</Text>
              <Button
                css={{
                  color: "$white",
                  padding: "$md",
                  borderRadius: "$md",
                  background: `${saving ? "gray" : "$secondary"}`,
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "$md",
                }}
                disabled={saving}
                onClick={() => setIssuesListVisible(true)}
              >
                <Text>Add To Collection</Text>
                <Plus />
              </Button>
            </Box>
          )}
          <AnimatePresence>
            {issuesListVisible && (
              <AnimatedBox
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 300, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                css={{
                  height: 300,
                  borderTopLeftRadius: "$md",
                  borderTopRightRadius: "$md",
                  background: "$gray",
                  position: "absolute",
                  zIndex: 1,
                  left: 0,
                  top: "60%",
                }}
              >
                <Box
                  css={{
                    width: "100%",
                    padding: "$md",
                    display: "flex",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    css={{ color: "$danger" }}
                    onClick={() => setIssuesListVisible(false)}
                  >
                    <X />
                  </Button>
                </Box>
                {gettingIssues && <Spinner size={20} />}
                {issues?.issues.map((v) => {
                  return (
                    <Box
                      key={v.id}
                      onClick={() => addToLibrary(v.id)}
                      css={{
                        display: "flex",
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        padding: "$lg",
                        gap: 5,
                        width: "100%",
                        borderBottom: "0.1px solid rgba(255,255,255,0.3)",
                      }}
                    >
                      <Image
                        src={v.thumbnailUrl}
                        css={{ width: 17, height: 17, borderRadius: "$md" }}
                      />
                      <Text css={{ fontSize: 13 }}>{v.name}</Text>
                    </Box>
                  );
                })}
              </AnimatedBox>
            )}
          </AnimatePresence>
          {collection?.collection?.issues.map((v) => {
            return <IssueCard issue={v} key={v.id} />;
          })}
        </VStack>
      </Box>
    </Layout>
  );
}
