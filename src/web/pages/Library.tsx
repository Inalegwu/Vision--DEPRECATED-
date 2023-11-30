import toast from "react-hot-toast";
import { useCallback, useEffect, useRef, useState } from "react";
import { trackEvent } from "@aptabase/electron/renderer";
import { trpcReact } from "@shared/config";
import { Plus, X } from "@phosphor-icons/react";
import { Reasons } from "@shared/types";
import {
  Layout,
  VStack,
  HStack,
  Spinner,
  IssueCard,
  Skeleton,
  CollectionCard,
} from "@components/index";
import {
  AnimatedBox,
  AnimatedButton,
  Box,
  Button,
  Input,
  Text,
} from "@components/atoms";
import { useAtom } from "jotai";
import { applicationState } from "@src/web/state";
import { AnimatePresence } from "framer-motion";

trackEvent("Library Loaded");

export default function Library() {
  const [_, setAppState] = useAtom(applicationState);
  const utils = trpcReact.useUtils();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [collectionName, setCollectionName] = useState<string>("");

  const { mutate: addToLibrary, isLoading: addingToLibrary } =
    trpcReact.library.addToLibrary.useMutation({
      onSuccess: (data) => {
        if (data?.status === false && data.reason === Reasons.CANCELLED) {
          return;
        }
        toast.success("Added To Library", {
          duration: 6000,
        });
        utils.library.getLibrary.invalidate();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });

  useEffect(() => {
    const dismissToolTip = setTimeout(() => {
      setCreateModalVisible(false);
    }, 6000);

    return () => {
      clearTimeout(dismissToolTip);
    };
  }, []);

  const { data: library, isLoading: fetchingLibraryContent } =
    trpcReact.library.getLibrary.useQuery();
  const { mutate: createCollection, isLoading: creating } =
    trpcReact.library.createCollection.useMutation({
      onSuccess: (data) => {
        toast.success(`${data?.data[0].name} Created Successfully`);
        utils.library.getLibrary.invalidate();
      },
    });

  const create = useCallback(() => {
    createCollection({ name: collectionName });
  }, [collectionName]);

  return (
    <Layout>
      <Box css={{ width: "100%", height: "100%" }}>
        {/* add to library loading overlay */}
        <AnimatedBox
          initial={{ opacity: 0, display: "none" }}
          animate={{
            opacity: addingToLibrary ? 1 : 0,
            display: addingToLibrary ? "flex" : "none",
          }}
          css={{
            position: "absolute",
            zIndex: 99999,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "center",
            background: "$blackMuted",
            backdropFilter: "blur(20px)",
          }}
        >
          <Box
            css={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              gap: "$xxxl",
              color: "$lightGray",
            }}
          >
            <Spinner />
            <Text>Sit back , This might take a while 😉 ...</Text>
          </Box>
        </AnimatedBox>
        {/* header */}
        <VStack gap={6} style={{ padding: "$lg" }}>
          <Text css={{ fontSize: 35, fontWeight: "bold" }}>My Library</Text>
          <HStack
            width="100%"
            justifyContent="space-between"
            alignContent="center"
            alignItems="center"
          >
            <HStack
              justifyContent="flex-start"
              alignContent="center"
              alignItems="center"
              gap={6}
            ></HStack>
            <AnimatePresence>
              {createModalVisible && (
                <AnimatedBox
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  css={{
                    background: "transparent",
                    borderRadius: "$md",
                    padding: "$md",
                    backdropFilter: "blur(400px)",
                    border: "0.3px solid $gray",
                    position: "absolute",
                    zIndex: 1,
                    left: "84%",
                    top: "17%",
                  }}
                >
                  <Input
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        create();
                      }
                    }}
                    css={{
                      background: "$gray",
                      opacity: 0.5,
                      borderRadius: "$md",
                      padding: "$md",
                      color: "$white",
                    }}
                    onChange={(e) => setCollectionName(e.currentTarget.value)}
                    placeholder="Collection Name"
                  />
                </AnimatedBox>
              )}
            </AnimatePresence>
            <HStack
              alignContent="center"
              alignItems="center"
              justifyContent="flex-end"
              gap={5}
            >
              <Button
                css={{
                  color: "$white",
                  background: "$gray",
                  padding: "$lg",
                  borderRadius: "$full",
                  "&:hover": {
                    background: "$secondary",
                  },
                }}
                onClick={() => setCreateModalVisible(true)}
              >
                <HStack alignContent="center" alignItems="center" gap={5}>
                  <Text>Create Collection</Text>
                </HStack>
              </Button>
              <AnimatedButton
                css={{
                  color: "$white",
                  background: "$gray",
                  padding: "$lg",
                  borderRadius: "$full",
                  "&:hover": {
                    background: "$secondary",
                  },
                }}
                onClick={() => addToLibrary()}
              >
                <HStack gap={5} alignContent="center" alignItems="center">
                  <Text>Add To Library</Text>
                  <Plus size={10} />
                </HStack>
              </AnimatedButton>
            </HStack>
          </HStack>
        </VStack>
        {/* body */}
        <Box
          css={{
            display: "flex",
            alignContent: "flex-start",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            flexWrap: "wrap",
            overflowY: "scroll",
            gap: "$xxxl",
            padding: "$lg",
            width: "100%",
            height: "90%",
            paddingBottom: "$hg",
          }}
        >
          {/* skeleton loader , ideally , the user won't ever see this */}
          {fetchingLibraryContent &&
            Array(10).map((_, idx) => {
              return (
                <Skeleton
                  key={idx}
                  css={{ display: "flex", flexDirection: "column", gap: "$md" }}
                >
                  <Box
                    css={{
                      borderRadius: "$md",
                      border: "0.1px solid rgba(255,255,255,0.2)",
                      height: 260,
                      width: 175,
                      background: "$gray",
                    }}
                  />
                  <Box
                    css={{
                      padding: "$md",
                      width: "100%",
                      borderRadius: "$sm",
                      background: "$gray",
                    }}
                  />
                  <Box
                    css={{
                      padding: "$md",
                      width: "60%",
                      borderRadius: "$sm",
                      background: "$gray",
                    }}
                  />
                </Skeleton>
              );
            })}
          {library?.issues.map((v) => {
            return <IssueCard issue={v} key={v.id} />;
          })}
          {library?.collections.map((v) => {
            return <CollectionCard key={v.id} collection={v} />;
          })}
        </Box>
      </Box>
    </Layout>
  );
}
