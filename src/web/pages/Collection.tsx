import {
  AnimatedBox,
  Box,
  Button,
  Image,
  Input,
  LinkButton,
  Text,
} from "@components/atoms";
import {
  HStack,
  IssueCard,
  IssueSkeleton,
  Layout,
  Skeleton,
  Spinner,
  VStack,
} from "@components/index";
import { useObservable } from "@legendapp/state/react";
import { CaretLeft, PencilCircle, Plus, Trash, X } from "@phosphor-icons/react";
import { trpcReact } from "@src/shared/config";
import { CollectionParams } from "@src/shared/types";
import { AnimatePresence } from "framer-motion";
import moment from "moment";
import { useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function Collection() {
  const router = useNavigate();
  const utils = trpcReact.useUtils();
  const { collectionId } = useParams<CollectionParams>();

  if (!collectionId) {
    router("/");
    return;
  }

  const inputRef = useRef<HTMLInputElement>(null);
  const issuesListVisible = useObservable(false);
  const editingName = useObservable(false);
  const deleteModalVisible = useObservable(false);
  const name = useObservable("");

  const { data: collection, isLoading: getting } =
    trpcReact.collection.getIssuesInCollection.useQuery(
      {
        id: collectionId || "",
      },
      {
        onSuccess: (d) => {
          name.set(d?.collection?.name || "");
        },
      },
    );

  // use this to populate the list of issues to add to the collection
  const { data: issues, isLoading: gettingIssues } =
    trpcReact.library.getLibrary.useQuery();

  const { mutate: addIssueToLibrary, isLoading: saving } =
    trpcReact.collection.addIssueToCollection.useMutation({
      onSuccess: (data) => {
        toast.success(`${data.result[0].name} Added To Collection`);
        utils.collection.getIssuesInCollection.invalidate();
        utils.library.invalidate();
        issuesListVisible.set(false);
      },
    });

  const { mutate: changeName, isLoading: changingName } =
    trpcReact.collection.changeCollectionName.useMutation({
      onSuccess: () => {
        utils.library.invalidate();
        editingName.set(false);
      },
    });

  const { mutate: deleteCollectionFromDB, isLoading: deletingCollection } =
    trpcReact.collection.deleteCollection.useMutation({
      onSuccess: () => {
        utils.library.getLibrary.invalidate();
        router("/");
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });

  // add an issue to the collection
  const addToLibrary = useCallback(
    (v: string) => {
      addIssueToLibrary({ issueId: v, collectionId: collectionId || "" });
    },
    [collectionId, addIssueToLibrary],
  );

  // change the name of the collection
  const updateName = useCallback(() => {
    changeName({ id: collectionId, name: name.get() });
  }, [name, collectionId, changeName]);

  // delete this collection from the database
  // this however doens't delete the issues in said collection
  // because the user might want to hold onto those
  const deleteCollection = useCallback(() => {
    if (!collection) return;
    deleteCollectionFromDB({ id: collection?.collection?.id || "" });
  }, [collection, deleteCollectionFromDB]);

  // handle clicking the edit button
  const handleEditClick = useCallback(() => {
    if (editingName.get() === false) {
      inputRef.current?.focus();
      editingName.set(true);
    } else {
      inputRef.current?.blur();
      editingName.set(false);
    }
  }, [editingName]);

  return (
    <Layout>
      {deleteModalVisible.get() && (
        <AnimatePresence>
          <AnimatedBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              ease: "easeInOut",
            }}
            css={{
              width: "100%",
              height: "100%",
              padding: "$lg",
              position: "absolute",
              zIndex: 99999,
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <VStack
              alignContent="center"
              alignItems="center"
              justifyContent="space-between"
              style={{
                background: "$gray",
                padding: "$lg",
                borderRadius: "$lg",
                gap: "$lg",
                width: "25%",
                height: "20%",
              }}
            >
              <VStack
                alignContent="flex-start"
                alignItems="flex-start"
                justifyContent="center"
                style={{ width: "100%" }}
              >
                <Text css={{ fontSize: 16, fontWeight: "bold" }}>
                  Are You Sure You Want To Delete
                </Text>
                <Text
                  css={{ fontSize: 20, fontWeight: "bold", color: "$white" }}
                >
                  {collection?.collection?.name}
                </Text>
              </VStack>
              <HStack
                alignContent="center"
                alignItems="center"
                justifyContent="center"
                style={{ gap: "$sm", width: "100%" }}
              >
                <Button
                  css={{
                    width: "50%",
                    padding: "$md",
                    display: "flex",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "$white",
                    background: "$danger",
                    borderRadius: "$md",
                  }}
                  disabled={deletingCollection}
                  onClick={deleteCollection}
                >
                  <Text css={{ fontSize: 15 }}>Yes , I'm Sure</Text>
                </Button>
                <Button
                  css={{
                    background: "$gray",
                    color: "$white",
                    borderRadius: "$md",
                    padding: "$md",
                    display: "flex",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "50%",
                  }}
                  onClick={() => deleteModalVisible.set(false)}
                >
                  <Text css={{ fontSize: 15 }}>Cancel</Text>
                </Button>
              </HStack>
            </VStack>
          </AnimatedBox>
        </AnimatePresence>
      )}
      <Box css={{ width: "100%", height: "100%", padding: "$lg" }}>
        <VStack style={{ width: "100%", padding: "$md", gap: "$lg" }}>
          <HStack>
            <LinkButton
              to="/"
              css={{
                background: "$primary",
                padding: "$lg",
                borderRadius: "$md",
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                color: "$white",
              }}
            >
              <CaretLeft size={16} />
            </LinkButton>
          </HStack>
          <HStack
            alignContent="center"
            alignItems="center"
            justifyContent="space-between"
            style={{ width: "100%" }}
          >
            {editingName.get() ? (
              <>
                <Input
                  ref={inputRef}
                  css={{
                    padding: "$md",
                    border: "0.2px solid $gray",
                    color: "$white",
                    borderRadius: "$md",
                    background: "$background",
                    fontSize: 22,
                    flex: 0.7,
                  }}
                  disabled={changingName}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateName();
                    }
                  }}
                  value={name.get()}
                  onChange={(e) => name.set(e.currentTarget.value)}
                />
              </>
            ) : (
              <>
                {getting && (
                  <Skeleton
                    initial={{ width: "0%" }}
                    animate={{
                      width: "80%",
                    }}
                    exit={{ width: "0%" }}
                    transition={{
                      duration: 0.1,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                    css={{
                      padding: "$xxxl",
                      borderRadius: "$md",
                      background: "$gray",
                    }}
                  />
                )}
                <Text
                  css={{
                    fontSize: 30,
                    fontWeight: "normal",
                    letterSpacing: 0.3,
                  }}
                >
                  {name.get()}
                </Text>
              </>
            )}
            <HStack
              alignContent="center"
              alignItems="center"
              justifyContent="flex-end"
              gap={6}
            >
              <Button
                css={{
                  color: "$secondary",
                  padding: "$lg",
                  borderRadius: "$full",
                  background: "$gray",
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "0.5s ease-in-out",
                  "&:hover": {
                    background: "$secondary",
                    color: "$white",
                  },
                }}
                onClick={handleEditClick}
              >
                <PencilCircle size={15} />
              </Button>
              <Button
                css={{
                  color: "$danger",
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "$gray",
                  padding: "$lg",
                  borderRadius: "$full",
                  "&:hover": {
                    background: "$danger",
                    color: "$white",
                  },
                }}
                onClick={() => deleteModalVisible.set(true)}
              >
                <Trash size={15} />
              </Button>
            </HStack>
          </HStack>
        </VStack>
        <HStack
          alignContent="flex-start"
          alignItems="flex-start"
          justifyContent="flex-start"
          gap={8}
          style={{
            height: "90%",
            paddingTop: "$xxl",
            padding: "$lg",
            overflowY: "scroll",
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
            gap: "$xxxl",
            paddingBottom: "$hg",
          }}
        >
          {collection?.collection?.issues?.length === 0 && (
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
                onClick={() => issuesListVisible.set(true)}
              >
                <Text>Add To Collection</Text>
                <Plus />
              </Button>
            </Box>
          )}
          {/* add issue view */}
          <AnimatePresence>
            {issuesListVisible.get() && (
              <AnimatedBox
                initial={{ top: "100%" }}
                animate={{ top: "35%" }}
                exit={{ top: "100%" }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                css={{
                  width: 500,
                  height: 500,
                  borderTopRightRadius: "$xl",
                  overflowY: "scroll",
                  background: "$blackMuted",
                  backdropFilter: "blur(500px)",
                  position: "absolute",
                  zIndex: 5,
                  left: 0,
                  top: "50%",
                  border: "0.1px solid $lightGray",
                }}
              >
                <Box
                  css={{
                    width: "100%",
                    padding: "$lg",
                    display: "flex",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    css={{ color: "$danger" }}
                    onClick={() => issuesListVisible.set(false)}
                  >
                    <X size={16} />
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
                        alignContent: "flex-end",
                        alignItems: "flex-end",
                        justifyContent: "flex-start",
                        padding: "$lg",
                        gap: "$xl",
                        width: "100%",
                        borderBottom: "0.1px solid rgba(255,255,255,0.3)",
                        transition: "0.3s ease-in-out",
                        "&:hover": {
                          background: "$secondary",
                        },
                      }}
                    >
                      <Image
                        src={v.thumbnailUrl}
                        css={{ width: 42, height: 52, borderRadius: "$md" }}
                      />
                      <VStack
                        alignContent="flex-start"
                        alignItems="flex-start"
                        justifyContent="center"
                        style={{
                          width: "100%",
                          height: 50,
                        }}
                      >
                        <Text css={{ fontSize: 15, color: "$white" }}>
                          {v.name}
                        </Text>
                        <Text css={{ fontSize: 12, color: "$gray" }}>
                          {moment(v.dateCreated).fromNow()}
                        </Text>
                      </VStack>
                    </Box>
                  );
                })}
              </AnimatedBox>
            )}
          </AnimatePresence>
          {collection?.collection?.issues.map((v) => {
            return <IssueCard issue={v} key={v.id} />;
          })}
          {getting &&
            [...Array(10)].map((_, idx) => <IssueSkeleton key={`${idx}`} />)}
          <Button
            onClick={() => issuesListVisible.set(true)}
            css={{
              position: "absolute",
              zIndex: 1,
              padding: "$xxl",
              background: "$gray",
              backdropFilter: "blur(200px)",
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              gap: "$md",
              color: "$white",
              borderRadius: "$full",
              transition: "0.5s ease-in-out",
              top: "92%",
              left: "96%",
              boxShadow: "0px 30px 80px 0px $gray",
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
