import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { trpcReact } from "@shared/config";
import { Plus } from "@phosphor-icons/react";
import { Reasons } from "@shared/types";
import {
  Layout,
  VStack,
  HStack,
  Spinner,
  IssueCard,
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
import { AnimatePresence } from "framer-motion";
import { LOADING_PHRASES } from "@src/shared/utils";

export default function Library() {
  const utils = trpcReact.useUtils();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [mouseOver, setMouseOver] = useState<boolean>(false);
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
      if (!mouseOver) {
        setCreateModalVisible(false);
      }
    }, 6000);

    return () => {
      clearTimeout(dismissToolTip);
    };
  }, []);

  const { data: library, isLoading: fetchingLibraryContent } =
    trpcReact.library.getLibrary.useQuery();

  const { mutate: createCollection, isLoading: _creating } =
    trpcReact.library.createCollection.useMutation({
      onSuccess: (data) => {
        toast.success(`${data?.data[0].name} Created Successfully`);
        utils.library.getLibrary.invalidate();
      },
    });

  const create = useCallback(() => {
    createCollection({ name: collectionName });
  }, [collectionName]);

  if (fetchingLibraryContent) {
    return (
      <Layout>
        <Box
          css={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            css={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              gap: "$xl",
            }}
          >
            <Spinner size={20} />
            <Text css={{ fontSize: 15 }}>{LOADING_PHRASES[6]}...</Text>
          </Box>
        </Box>
      </Layout>
    );
  }

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
          <Text css={{ fontSize: 27, fontWeight: "bold" }}>My Library</Text>
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
                    onMouseOver={() => setMouseOver(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        create();
                      }
                    }}
                    onFocus={() => setMouseOver(true)}
                    onBlur={() => setMouseOver(false)}
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
                  padding: "$md",
                  borderRadius: "$full",
                  "&:hover": {
                    background: "$primary",
                  },
                }}
                onClick={() => setCreateModalVisible(true)}
              >
                <HStack alignContent="center" alignItems="center" gap={5}>
                  <Text css={{ fontSize: 12 }}>Create Collection</Text>
                </HStack>
              </Button>
              <AnimatedButton
                css={{
                  color: "$white",
                  background: "$gray",
                  padding: "$md",
                  borderRadius: "$full",
                  transition: "0.5s ease-in-out",
                  "&:hover": {
                    background: "$primary",
                  },
                }}
                onClick={() => addToLibrary()}
              >
                <HStack gap={5} alignContent="center" alignItems="center">
                  <Text css={{ fontSize: 12 }}>Add To Library</Text>
                  <Plus size={11} />
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
          {library?.collections.map((v) => {
            return <CollectionCard key={v.id} collection={v} />;
          })}
          {library?.issues.map((v) => {
            return <IssueCard issue={v} key={v.id} />;
          })}
        </Box>
      </Box>
    </Layout>
  );
}
