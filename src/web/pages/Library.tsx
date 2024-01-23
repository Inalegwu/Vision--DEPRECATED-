import {
  CollectionCard,
  IssueCard,
  IssueSkeleton,
  Layout,
  Spinner,
} from "@components/index";
import { useObservable } from "@legendapp/state/react";
import { CaretDown } from "@phosphor-icons/react";
import { Link1Icon, PlusIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  DropdownMenu,
  Flex,
  Heading,
  Popover,
  Text,
  TextField,
} from "@radix-ui/themes";
import { trpcReact } from "@shared/config";
import { Filter, Reasons } from "@shared/types";
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
    trpcReact.library.getLibrary.useQuery({
      filter: appState.filter,
    });

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

  const changeFilter = useCallback((newFilter: Filter) => {
    globalState$.appState.filter.set(newFilter);
  }, []);

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
        <Flex
          align="center"
          direction="column"
          justify="between"
          p="4"
          className="mt-2"
          gap="2"
        >
          {/* main content */}
          <Flex align="center" justify="between" width="100%">
            <Heading size="8">My Library</Heading>
            <Flex className="flex-1" gap="2" justify="end" align="center">
              <Popover.Root>
                <Popover.Trigger>
                  <Button variant="soft" color="gray" className="px-4 py-2">
                    <Link1Icon />
                    <Text>Create Collection</Text>
                  </Button>
                </Popover.Trigger>
                <Popover.Content className="p-2 rounded-lg max-w-70 min-w-60 border-none">
                  <Flex gap="2" direction="column">
                    <TextField.Root>
                      <TextField.Input
                        placeholder="Collection Name"
                        onChange={(e) =>
                          collectionName.set(e.currentTarget.value)
                        }
                      />
                    </TextField.Root>
                    <Popover.Close>
                      <Button color="mint" variant="soft" onClick={create}>
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
          {/* filters */}
          <Flex align="center" justify="start" gap="3" className="w-full mt-3">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="soft" color="gray" className="" size="2">
                  Sort By
                  <CaretDown />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                align="start"
                className="mt-1 p-0 rounded-md"
                variant="soft"
              >
                <DropdownMenu.Label>Name</DropdownMenu.Label>
                <DropdownMenu.RadioGroup
                  onValueChange={(e) => changeFilter(e as Filter)}
                >
                  <DropdownMenu.RadioItem value={Filter.NAME_ASC}>
                    <Text>A-Z</Text>
                  </DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value={Filter.NAME_DESC}>
                    <Text>Z-A</Text>
                  </DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>
                <DropdownMenu.Separator />
                <DropdownMenu.Label>Date Created</DropdownMenu.Label>
                <DropdownMenu.RadioGroup
                  onValueChange={(e) => changeFilter(e as Filter)}
                >
                  <DropdownMenu.RadioItem value={Filter.DATE_ASC}>
                    <Text>Newest First</Text>
                  </DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value={Filter.DATE_DESC}>
                    <Text>Oldest First</Text>
                  </DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
        </Flex>
        {/* body */}
        <Flex
          align="start"
          justify="start"
          p="4"
          wrap="wrap"
          height="9"
          gap="2"
          className="overflow-y-scroll w-full h-[85%]"
        >
          {library?.collections.length === 0 && library.issues.length === 0 ? (
            <Flex
              align="center"
              grow="1"
              justify="center"
              width="100%"
              height="100%"
            >
              <Flex direction="column" align="center" justify="start" gap="2">
                <Text>
                  It's a bit lonely here , Add Some Issues or Create a
                  Collection
                </Text>
                <Button variant="soft" onClick={() => addToLibrary()}>
                  <Text>Add To Library</Text>
                </Button>
              </Flex>
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
