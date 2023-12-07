import { useNavigate, useParams } from "react-router-dom";
import {
  HStack,
  IssueCard,
  IssueSkeleton,
  Layout,
  Spinner,
  VStack,
} from "@components/index";
import {
  AnimatedBox,
  Box,
  Button,
  Image,
  Input,
  LinkButton,
  Text,
} from "@components/atoms";
import { CollectionParams } from "@src/shared/types";
import { CaretLeft, PencilCircle, Plus, Trash, X } from "@phosphor-icons/react";
import { trpcReact } from "@src/shared/config";
import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FALSE_ARRAY } from "@shared/utils";

export default function Collection() {
  const router = useNavigate();
  const utils = trpcReact.useUtils();
  const { collectionId } = useParams<CollectionParams>();

  const [issuesListVisible, setIssuesListVisible] = useState<boolean>(false);
  const [editingName, setEditingName] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const { data: collection, isLoading: getting } =
    trpcReact.library.getCollectionById.useQuery(
      {
        collectionId: collectionId!,
      },
      {
        onSuccess: (d) => {
          setName(d?.collection?.name!);
        },
      }
    );

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

  const { mutate: changeName, isLoading: changingName } =
    trpcReact.library.changeIssueName.useMutation({
      onSuccess: () => {
        utils.library.invalidate();
        setEditingName(false);
      },
    });

  const { mutate: deleteCollectionFromDB, isLoading: deletingCollection } =
    trpcReact.library.deleteCollection.useMutation({
      onSuccess: () => {
        utils.library.getLibrary.invalidate();
        router("/");
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });

  const addToLibrary = useCallback(
    (v: string) => {
      addIssueToLibrary({ issueId: v, collectionId: collectionId! });
    },
    [collectionId]
  );

  const updateName = useCallback(() => {
    changeName({ id: collectionId!, newName: name });
  }, [name, collectionId]);

  const deleteCollection = useCallback(() => {
    if (!collection) return;
    deleteCollectionFromDB({ id: collection?.collection?.id! });
  }, [collection]);

  return (
    <Layout>
      {deleteModalVisible && (
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
              zIndex: 1,
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              backdropFilter: "blur(100px)",
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
                  onClick={() => setDeleteModalVisible(false)}
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
                padding: "$md",
                borderRadius: "$md",
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                color: "$white",
              }}
            >
              <CaretLeft />
            </LinkButton>
          </HStack>
          <HStack
            alignContent="center"
            alignItems="center"
            justifyContent="space-between"
            style={{ width: "100%" }}
          >
            {editingName ? (
              <>
                <Input
                  css={{
                    padding: "$md",
                    border: "0.2px solid $gray",
                    color: "$white",
                    borderRadius: "$md",
                    background: "$background",
                    fontSize: 27,
                    flex: 0.7,
                  }}
                  disabled={changingName}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateName();
                    }
                  }}
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                />
              </>
            ) : (
              <>
                <Text css={{ fontSize: 27, fontWeight: "bold" }}>{name}</Text>
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
                onClick={() => setEditingName((v) => !v)}
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
                onClick={() => setDeleteModalVisible(true)}
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
            paddingBottom: "$xxxl",
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
                initial={{ height: 0 }}
                animate={{ height: 500 }}
                exit={{ height: 0 }}
                transition={{
                  ease: "easeInOut",
                }}
                css={{
                  width: 400,
                  borderTopRightRadius: "$xl",
                  overflowY: "scroll",
                  background: "$blackMuted",
                  backdropFilter: "blur(100px)",
                  position: "absolute",
                  zIndex: 1,
                  left: 0,
                  top: "50%",
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
          {getting && FALSE_ARRAY.map((v) => <IssueSkeleton key={v} />)}
          <Button
            onClick={() => setIssuesListVisible(true)}
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
              boxShadow: "0px 30px 80px 0px rgba(23,220,156,0.6)",
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
