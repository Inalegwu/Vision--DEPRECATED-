import {
  AnimatedBox,
  AnimatedButton,
  AnimatedText,
  Box,
  Button,
  Input,
  Text,
} from "@components/atoms";
import {
  CollectionCard,
  HStack,
  IssueCard,
  IssueSkeleton,
  Layout,
  Spinner,
  VStack,
} from "@components/index";
import { useObservable } from "@legendapp/state/react";
import { Plus } from "@phosphor-icons/react";
import { trpcReact } from "@shared/config";
import { Reasons } from "@shared/types";
import { LOADING_PHRASES, getRandomIndex } from "@src/shared/utils";
import { globalState$ } from "@src/web/state";
import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useInterval, useTimeout } from "../hooks";

export default function Library() {
  const utils = trpcReact.useUtils();
  const router = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const createModalVisible = useObservable(false);
  const mouseOver = useObservable(false);
  const collectionName = useObservable("");

  // gets a random index and uses that to select
  // a loading phrase
  const phraseIndex = useObservable<number>(
    getRandomIndex(0, LOADING_PHRASES.length - 1),
  );

  // the app state
  // used in useEffect to know where to navigate the user
  // to on first launch
  const { appState } = globalState$.get();

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

  useTimeout(() => {
    if (!mouseOver) {
      createModalVisible.set(false);
    }
  }, 6000);

  // change the loading phrase every 4 seconds
  useInterval(() => {
    phraseIndex.set(getRandomIndex(0, LOADING_PHRASES.length - 1));
  }, 4000);

  useEffect(() => {
    // is the the users first launch of the app ???
    if (appState.firstLaunch) {
      // go to the first launch page if the application firstLaunch is false
      // which is the default
      router("/first_launch", {
        preventScrollReset: true,
        replace: true,
      });
    }
  }, [router, appState]);

  const { data: library, isLoading: fetchingLibraryContent } =
    trpcReact.library.getLibrary.useQuery();

  const { mutate: createCollection, isLoading: _creating } =
    trpcReact.collection.createCollection.useMutation({
      onSuccess: (data) => {
        toast.success(`${data?.data[0].name} Created Successfully`);
        utils.library.getLibrary.invalidate();
      },
    });

  const create = useCallback(() => {
    createCollection({ name: collectionName.get() });
    inputRef.current?.blur();

    createModalVisible.set(false);
  }, [collectionName, createCollection]);

  const toggleCreateModal = useCallback(() => {
    createModalVisible.set(true);
    inputRef.current?.focus();
  }, []);

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
            backdropFilter: "blur(1000px)",
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
            <AnimatePresence>
              <AnimatedText
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ ease: "anticipate" }}
              >
                {LOADING_PHRASES[phraseIndex.get()]}
              </AnimatedText>
            </AnimatePresence>
          </Box>
        </AnimatedBox>
        {/* header */}
        <VStack gap={6} style={{ padding: "$xxxl" }}>
          <Text css={{ fontSize: 27, fontWeight: 400,letterSpacing:0.4 }}>My Library</Text>
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
            />
            <AnimatePresence>
              {createModalVisible.get() && (
                <AnimatedBox
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  css={{
                    background: "$blackMuted",
                    borderRadius: "$md",
                    padding: "$md",
                    backdropFilter: "blur(500px)",
                    border: "0.3px solid $gray",
                    position: "absolute",
                    zIndex: 1,
                    left: "80%",
                    top: "17%",
                    display: "flex",
                    flexDirection: "column",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 0.1px 40px 0px rgba(255,255,255,0.1)",
                    gap: "$md",
                  }}
                >
                  <Input
                    ref={inputRef}
                    onMouseOver={() => mouseOver.set(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        create();
                      }
                    }}
                    onFocus={() => mouseOver.set(true)}
                    onBlur={() => mouseOver.set(false)}
                    css={{
                      opacity: 0.5,
                      borderRadius: "$md",
                      padding: "$lg",
                      color: "$white",
                      background: "$blackMuted",
                      border: "0.1px solid $lightGray",
                    }}
                    onChange={(e) => collectionName.set(e.currentTarget.value)}
                    placeholder="Collection Name"
                  />
                  <Button
                    onClick={create}
                    css={{
                      width: "100%",
                      padding: "$lg",
                      borderRadius: "$md",
                      background: "$primary",
                      display: "flex",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "$white",
                    }}
                  >
                    <Text>Create Collection</Text>
                  </Button>
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
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    background: "$primary",
                  },
                }}
                onClick={toggleCreateModal}
              >
                <Text css={{ fontSize: 12 }}>Create Collection</Text>
              </Button>
              <AnimatedButton
                css={{
                  color: "$white",
                  background: "$gray",
                  padding: "$lg",
                  borderRadius: "$full",
                  transition: "0.5s ease-in-out",
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "$sm",
                  "&:hover": {
                    background: "$primary",
                  },
                }}
                onClick={() => addToLibrary()}
              >
                <Text css={{ fontSize: 12,letterSpacing:0.3,fontWeight:"lighter" }}>Add To Library</Text>
                <Plus size={11} />
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
            padding: "$xxxl",
            width: "100%",
            height: "90%",
            paddingBottom: "$hg",
          }}
        >
          {library?.collections.length === 0 && library.issues.length === 0 ? (
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
              <VStack
                alignContent="center"
                alignItems="center"
                justifyContent="center"
                gap={2}
              >
                <Text css={{ fontSize: 20, fontWeight: "bold" }}>
                  It's a bit lonely here , Add Some Issues or Create a
                  Collection
                </Text>
                <Button
                  css={{
                    background: "$primary",
                    color: "$white",
                    borderRadius: "$md",
                    padding: "$md",
                    fontSize: 16,
                  }}
                  onClick={() => addToLibrary()}
                >
                  <Text>Add To Library</Text>
                </Button>
              </VStack>
            </Box>
          ) : (
            <></>
          )}
          {library?.collections.map((v) => {
            return <CollectionCard key={v.id} collection={v} />;
          })}
          {library?.issues.map((v) => {
            return <IssueCard issue={v} key={v.id} />;
          })}
          {fetchingLibraryContent &&
            [...Array(10)].map((_, idx) => {
              return <IssueSkeleton key={`${idx}`} />;
            })}
        </Box>
      </Box>
    </Layout>
  );
}
