import { Box, Button, Text } from "../components/atoms";
import { trpcReact } from "../../shared/config";
import { Layout, VStack, HStack, Spinner } from "../components";
import { Plus } from "@phosphor-icons/react";

export default function Library() {
  const {
    mutate: addToLibrary,
    data,
    isLoading: addingToLibrary,
  } = trpcReact.library.addToLibrary.useMutation();

  const { data: libraryData, isLoading: fetchingLibraryContent } =
    trpcReact.library.getLibrary.useQuery();

  return (
    <Layout>
      <Box css={{ width: "100%", height: "100%", padding: "$lg" }}>
        {addingToLibrary && (
          <Box
            css={{
              position: "absolute",
              zIndex: 99999,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Spinner />
          </Box>
        )}
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
                color: "$white",
                background: "$gray",
                padding: "$lg",
                borderRadius: "$full",
              }}
              onClick={() => addToLibrary()}
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
