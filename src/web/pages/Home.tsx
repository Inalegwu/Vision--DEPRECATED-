import { Layout, Spinner } from "../components";
import { Box, Text } from "../components/atoms";
import { useAtom } from "jotai";
import { appIdState, firstLaunchState } from "../state";
import { trpcReact } from "../../shared/config";

export default function Home() {
  const [isFirstLaunch, setIsFirstLaunch] = useAtom(firstLaunchState);
  const [_, setAppId] = useAtom(appIdState);

  const { data: currentlyReading, isLoading: loadingCurrentlyReading } =
    trpcReact.issue.getCurrentlyReading.useQuery();
  const { data: doneReading, isLoading: loadingDoneReading } =
    trpcReact.issue.getDoneReading.useQuery();

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
          >
            {loadingCurrentlyReading && <Spinner size={15} />}
          </Box>
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
          >
            {loadingDoneReading && <Spinner size={15} />}
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}

