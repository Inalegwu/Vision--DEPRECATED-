import { Box, Button, Text } from "../components/atoms";
import { trpcReact } from "../../shared/config";
import { Layout } from "../components";
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
        <Box
          css={{
            display: "flex",
            flexDirection: "column",
            gap: "$lg",
            alignContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Text css={{ fontSize: 35, fontWeight: "bold" }}>My Library</Text>
          <Box
            css={{
              width: "100%",
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "$lg",
            }}
          >
            <Box
              css={{
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              content
            </Box>
            <Button
              onClick={() => addToLibrary()}
              css={{
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                gap: 5,
                justifyContent: "center",
                background: `${theme === "dark" ? "$gray" : "$lightGray"}`,
                borderRadius: "$full",
                padding: "$lg",
                color: `${theme === "dark" ? "$white" : "$black"}`,
              }}
            >
              <Text css={{ fontSize: 13 }}>Add To Library</Text>
              <Plus size={14} />
            </Button>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}

