import { Layout, Spinner } from "../components";
import { Box, Text } from "../components/atoms";
import { trpcReact } from "../../shared/config";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { appIdState, firstLaunchState } from "../state";
import { generateUUID } from "../../shared/utils";

export default function Home() {
  const [isFirstLaunch, setIsFirstLaunch] = useAtom(firstLaunchState);
  const [_, setAppId] = useAtom(appIdState);

  const { data: continueReading, isLoading: loadingCurrentlyReading } =
    trpcReact.issue.getCurrentlyReading.useQuery();
  const { data: doneReading, isLoading: loadingDone } =
    trpcReact.issue.getDoneReading.useQuery();

  useEffect(() => {
    if (isFirstLaunch) {
      setIsFirstLaunch(true);
      setAppId(generateUUID());
    }
  }, [isFirstLaunch]);

  return (
    <Layout>
      <Box css={{ width: "100%", height: "100%" }}>
        <Box
          css={{
            width: "100%",
            height: "50%",
            fontWeight: "bold",
            fontSize: 25,
            padding: "$md",
          }}
        >
          <Text>Currently Reading</Text>
          <Box
            css={{
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Spinner />
          </Box>
        </Box>
        <Box
          css={{
            width: "100%",
            height: "50%",
            fontWeight: "bold",
            fontSize: 25,
            padding: "$md",
          }}
        >
          <Text>Done Reading</Text>
        </Box>
      </Box>
    </Layout>
  );
}

