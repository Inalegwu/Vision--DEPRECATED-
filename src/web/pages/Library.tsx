import { Button, HStack, Heading, Text, VStack } from "@kuma-ui/core";
import { trpcReact } from "../../shared/config";
import { Layout } from "../components";
import { Plus } from "@phosphor-icons/react";
import { useAtom } from "jotai";
import { filterState } from "../state";
import { Filter } from "../../shared/types";

const FILTERS = ["All", "Issues", "Collections"];

export default function Library() {
  const { mutate: addToLib, data } =
    trpcReact.library.addToLibrary.useMutation();

  const [filter, setFilter] = useAtom(filterState);

  const { data: libraryData, isLoading: fetchingLibraryContent } =
    trpcReact.library.getLibrary.useQuery({ filter: "All" });

  return (
    <Layout>
      <VStack display="flex" flexDir="column" padding={5} gap={5}>
        <VStack display="flex" flexDir="column" gap={8}>
          <HStack
            width="100%"
            padding={2}
            display="flex"
            justifyContent="space-between"
          >
            <Heading as="h1">Library</Heading>
            <Button
              border="none"
              background="gray"
              color="white"
              borderRadius={99999}
              width={26}
              height={26}
              display="flex"
              alignContent="center"
              alignItems="center"
              justifyContent="center"
              onClick={() => addToLib()}
            >
              <Plus size={13} />
            </Button>
          </HStack>
          <HStack
            display="flex"
            alignContent="center"
            alignItems="center"
            justifyContent="flex-start"
            gap={5}
          >
            {FILTERS.map((v) => {
              return (
                <Button
                  width="8%"
                  border="none"
                  background={filter === v ? "#4097E8" : "#333333"}
                  p={5}
                  borderRadius={99999}
                  onClick={() => setFilter(v as Filter)}
                >
                  <Text color="white">{v}</Text>
                </Button>
              );
            })}
          </HStack>
        </VStack>
        <HStack padding={5} overflowY="scroll">
          Library content go vroom
        </HStack>
      </VStack>
    </Layout>
  );
}

