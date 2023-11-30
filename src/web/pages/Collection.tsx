import { useParams } from "react-router-dom";
import { HStack, IssueCard, Layout, Spinner } from "../components";
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
import toast from "react-hot-toast";

export default function Collection() {
  const utils = trpcReact.useUtils();
  const { collectionId } = useParams<CollectionParams>();

  const [issuesListVisible, setIssuesListVisible] = useState<boolean>(false);

  const { data: collection, isLoading: getting } =
    trpcReact.library.getCollectionById.useQuery({
      collectionId: collectionId!,
    });

  const { data: issues, isLoading: gettingIssues } =
    trpcReact.library.getLibrary.useQuery();

  const { mutate: addIssueToLibrary, isLoading: saving } =
    trpcReact.library.addIssueToCollection.useMutation({
      onSuccess: (data) => {
        toast.success(`${data.result[0].name} Added To Library`);
        utils.library.getCollectionById.invalidate();
        utils.library.invalidate();
        setIssuesListVisible(false);
      },
    });

  const addToLibrary = useCallback(
    (v: string) => {
      addIssueToLibrary({ issueId: v, collectionId: collectionId! });
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
            <Text css={{ fontSize: 30 }}>{collection?.collection!.name}</Text>
          </HStack>
        </HStack>
        <HStack
          alignContent="flex-start"
          alignItems="flex-start"
          justifyContent="flex-start"
          gap={8}
          style={{
            height: "97%",
            paddingTop: "$xxl",
            overflowY: "scroll",
            flexWrap: "wrap",
          }}
        >
          {collection?.collection?.issues.length === 0 && (
            <Box
              css={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                width: "100%",
                height: "100%",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 500, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                css={{
                  width: 400,
                  borderTopLeftRadius: "$md",
                  overflowY: "scroll",
                  borderTopRightRadius: "$md",
                  background: "$blackMuted",
                  position: "absolute",
                  zIndex: 1,
                  left: 0,
                  top: "50%",
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
          <Button
            onClick={() => setIssuesListVisible(true)}
            css={{
              position: "absolute",
              zIndex: 1,
              padding: "$xxl",
              background: "$gray",
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              gap: "$md",
              color: "$white",
              borderRadius: "$full",
              transition: "0.5s ease-in-out",
              top: "92%",
              left: "95%",
              "&:hover": {
                background: "$secondary",
              },
            }}
          >
            <Plus size={17} />
          </Button>
        </HStack>
      </Box>
    </Layout>
  );
}
