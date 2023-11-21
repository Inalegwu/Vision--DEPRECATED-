import { trackEvent } from "@aptabase/electron/renderer";
import { Box, Button, Image, Text } from "../components/atoms";
import { trpcReact } from "../../shared/config";
import { Layout, VStack, HStack, Spinner, IssueCard } from "../components";
import { Plus } from "@phosphor-icons/react";
import toast from "react-hot-toast";

trackEvent("Library Loaded");

export default function Library() {
  const utils = trpcReact.useUtils();
  const {
    mutate: addToLibrary,
    data,
    isLoading: addingToLibrary,
  } = trpcReact.library.addToLibrary.useMutation({
    onSuccess: () => {
      toast.success("Added To Library", {
        duration: 6000,
      });
      utils.library.invalidate();
    },
  });

  const { data: libraryData, isLoading: fetchingLibraryContent } =
    trpcReact.library.getLibrary.useQuery();

  const { mutate: deleteIssue, isLoading: deleting } =
    trpcReact.issue.deleteIssue.useMutation({
      onSuccess: () => {
        toast.success("Issue Deleted", {
          duration: 6000,
        });
        utils.library.invalidate();
      },
    });

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
            <Spinner size={30} />
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
              <Text>Sit back while we add that to your library...</Text>
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
            ></HStack>
            <Button
              css={{
                color: "$white",
                background: "$gray",
                padding: "$lg",
                borderRadius: "$full",
                "&:hover": {
                  background: "$secondary",
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
        <Box
          css={{
            display: "flex",
            gap: "$xxxl",
            padding: "$md",
            overflowX: "hidden",
            overflowY: "scroll",
            overflowWrap: "anywhere",
            marginTop: "$xl",
          }}
        >
          {libraryData?.issues.map((v) => {
            return <IssueCard issue={v} key={v.id} />;
          })}
        </Box>
      </Box>
    </Layout>
  );
}
