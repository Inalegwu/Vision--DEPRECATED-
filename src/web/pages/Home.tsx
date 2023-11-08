import { Layout, Spinner } from "../components";
import { Box, LinkButton, Text } from "../components/atoms";
import { useAtom } from "jotai";
import { appIdState, firstLaunchState } from "../state";
import { trpcReact } from "../../shared/config";
import { CaretRight } from "@phosphor-icons/react";

export default function Home() {
  const [isFirstLaunch, setIsFirstLaunch] = useAtom(firstLaunchState);
  const [_, setAppId] = useAtom(appIdState);

  const { data: currentlyReading, isLoading: loadingCurrentlyReading } =
    trpcReact.issue.getCurrentlyReading.useQuery();
  const { data: doneReading, isLoading: loadingDoneReading } =
    trpcReact.issue.getDoneReading.useQuery();

  if (loadingCurrentlyReading && loadingDoneReading) {
    return (
      <Layout>
        <Box css={{ width: "100%", height: "100%" }}>
          <Spinner size={40} />
        </Box>
      </Layout>
    );
  }

  if (
    currentlyReading?.issues.length === 0 &&
    doneReading?.issues.length === 0
  ) {
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
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <Text css={{ fontSize: 25, fontWeight: "bold" }}>
              Nothing To See Here
            </Text>
            <Text css={{ fontSize: 15, color: "$gray" }}>
              Head to the Library to Get Reading
            </Text>
            <Box
              css={{
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text css={{ fontSize: 15, fontWeight: "bold" }}>Let's Go</Text>
              <LinkButton
                to="/library"
                css={{
                  color: "$white",
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "$secondary",
                  borderRadius: "$full",
                  padding: "$xl",
                }}
              >
                <CaretRight size={15} />
              </LinkButton>
            </Box>
          </Box>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box css={{ width: "100%", height: "100%" }}>
        <Box
          css={{
            width: "100%",
            height: "65%",
            fontWeight: "bold",
            fontSize: 25,
            padding: "$md",
          }}
        >
          <Text>Currently Reading</Text>
          <Box
            css={{
              display: "flex",
              overflowX: "scroll",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              height: "90%",
              flex: 1,
            }}
          ></Box>
        </Box>
        <Box
          css={{
            width: "100%",
            height: "35%",
            fontWeight: "bold",
            fontSize: 25,
            padding: "$md",
          }}
        >
          <Text>Done Reading</Text>
          <Box
            css={{
              display: "flex",
              overflowX: "scroll",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              height: "90%",
              flex: 1,
            }}
          ></Box>
        </Box>
      </Box>
    </Layout>
  );
}

