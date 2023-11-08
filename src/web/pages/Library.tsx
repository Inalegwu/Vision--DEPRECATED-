import { Box, Button, LinkButton, Text } from "../components/atoms";
import { trpcReact } from "../../shared/config";
import { Layout, VStack, HStack } from "../components";
import { useAtom } from "jotai";
import { themeState } from "../state";
import { Plus } from "@phosphor-icons/react";

export default function Library() {
  const [theme] = useAtom(themeState);

  const { mutate: addToLibrary, data } =
    trpcReact.library.addToLibrary.useMutation();

  const { data: libraryData, isLoading: fetchingLibraryContent } =
    trpcReact.library.getLibrary.useQuery({ filter: "All" });

  return (
    <Layout>
      <Box css={{ width: "100%", height: "100%", padding: "$lg" }}>
        <VStack gap={6}>
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
            <Button
              css={{
                color: `${theme === "dark" ? "$white" : "$deepBlack"}`,
                background: `${theme === "dark" ? "$gray" : "$lightGray"}`,
                padding: "$lg",
                borderRadius: "$full",
              }}
            >
              <HStack gap={5} alignContent="center" alignItems="center">
                <Text>Add To Library</Text>
                <Plus />
              </HStack>
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Layout>
  );
}

