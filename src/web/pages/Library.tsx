import {
  CollectionCard,
  IssueCard,
  IssueSkeleton,
  Layout,
  Spinner,
  VStack,
} from "@components/index";
import { useObservable } from "@legendapp/state/react";
import { LinkNone1Icon, PlusIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Popover,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { trpcReact } from "@shared/config";
import { Reasons } from "@shared/types";
import { LOADING_PHRASES, getRandomIndex } from "@src/shared/utils";
import { globalState$ } from "@src/web/state";
import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useInterval } from "../hooks";

export default function Library() {
  const utils = trpcReact.useUtils();
  const router = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const mouseOver = useObservable(false);
  const collectionName = useObservable("");

  // gets a random index and uses that to select
  // a loading phrase
  const phraseIndex = useObservable<number>(
    getRandomIndex(0, LOADING_PHRASES.length - 1),
  );

  const phraseIndexValue = phraseIndex.get();

  // the app state
  // used in useEffect to know where to navigate the user
  // to on first launch
  const { appState, uiState } = globalState$.get();

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

  // change the loading phrase every 4 seconds
  useInterval(() => {
    phraseIndex.set(getRandomIndex(0, LOADING_PHRASES.length - 1));
  }, 6000);

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
  }, [collectionName, createCollection]);

  return (
    <Layout>
      {addingToLibrary && (
        <Flex
          align="center"
          justify="center"
          className="p-1 absolute z-10 top-0 left-0 backdrop-blur-2xl w-full h-screen bg-black/20"
        >
          <Flex
            direction="column"
            className="justify-center items-center"
            gap="3"
          >
            <Spinner />
            <Text>{LOADING_PHRASES[phraseIndexValue]}</Text>
          </Flex>
        </Flex>
      )}
      <Box className="w-full h-screen">
        {/* header */}
        <Flex align="center" justify="between" p="4" className="mt-2">
          <Heading size="7">My Library</Heading>
          <Flex className="flex-1" gap="2" justify="end" align="center">
            <Popover.Root>
              <Popover.Trigger>
                <Button variant="soft" color="gray" className="px-4 py-2">
                  <LinkNone1Icon />
                  <Text>Create Collection</Text>
                </Button>
              </Popover.Trigger>
              <Popover.Content className="p-2 rounded-lg border-none">
                <Flex gap="2" direction="column">
                  <TextArea
                    placeholder="Collection Name"
                    onChange={(e) => collectionName.set(e.currentTarget.value)}
                  />
                  <Popover.Close>
                    <Button color="grass" variant="soft" onClick={create}>
                      <Text>Create Collection</Text>
                    </Button>
                  </Popover.Close>
                </Flex>
              </Popover.Content>
            </Popover.Root>
            <Button
              className="px-4 py-2"
              variant="soft"
              onClick={() => addToLibrary()}
            >
              <PlusIcon width="12" height="12" />
              <Text>Add To Library</Text>
            </Button>
          </Flex>
        </Flex>
        {/* body */}
        <Flex
          align="start"
          justify="start"
          p="4"
          wrap="wrap"
          height="9"
          gap="3"
          className="overflow-y-scroll w-full h-full"
        >
          {library?.collections.length === 0 && library.issues.length === 0 ? (
            <Flex align="center" justify="center" width="100%" height="100%">
              <VStack
                alignContent="center"
                alignItems="center"
                justifyContent="center"
                gap={2}
              >
                <Text>
                  It's a bit lonely here , Add Some Issues or Create a
                  Collection
                </Text>
                <Button variant="soft" onClick={() => addToLibrary()}>
                  <Text>Add To Library</Text>
                </Button>
              </VStack>
            </Flex>
          ) : (
            <></>
          )}
          {/* render collections from library */}
          {library?.collections.map((v) => {
            return <CollectionCard key={v.id} collection={v} />;
          })}
          {/* render issues from library */}
          {library?.issues.map((v) => {
            return <IssueCard issue={v} key={v.id} />;
          })}
          {/* Loading Skeleton */}
          {fetchingLibraryContent &&
            [...Array(10)].map((_, idx) => {
              return <IssueSkeleton key={`${idx}`} />;
            })}
          {/* Optimistic Loading */}
          {addingToLibrary &&
            [...Array(1)].map((_, idx) => <IssueSkeleton key={`${idx}`} />)}
        </Flex>
      </Box>
    </Layout>
  );
}
