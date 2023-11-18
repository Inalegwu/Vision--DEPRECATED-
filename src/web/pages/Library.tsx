import { Box, Button, Image, Text } from "../components/atoms";
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
  const { mutate: deleteIssue } = trpcReact.issue.deleteIssue.useMutation();

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
              gap: "$xxxl",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spinner size={40} />
            <Text css={{ color: "$lightGray" }}>Loading Library...</Text>
          </Box>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box css={{ width: "100%", height: "100%", padding: "$lg" }}>
        {/* loading overlay */}
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
              <Text>This might take a while...</Text>
            </Box>
          </Box>
        )}
        {/* header */}
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
            >
              {/* TODO filters go here */}
            </HStack>
            <Button
              css={{
                color: "$white",
                background: "$gray",
                padding: "$lg",
                borderRadius: "$full",
                "&:hover": {
                  background: "$primary",
                },
              }}
              onClick={() => addToLibrary()}
            >
              <HStack gap={5} alignContent="center" alignItems="center">
                <Text>Add To Library</Text>
                <Plus size={10} />
              </HStack>
            </Button>
          </HStack>
        </VStack>
        {/* body */}
        <Box>
          {libraryData?.issues.map((v) => {
            return (
              <Box
                onClick={() => {
                  deleteIssue({ id: v.id });
                }}
              >
                <Image
                  src={v.thumbnailUrl}
                  css={{
                    width: 200,
                    height: 260,
                    borderRadius: "$md",
                    border: "0.2px solid $gray",
                  }}
                  alt={v.name}
                />
                <Text>{v.name}</Text>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Layout>
  );
}
