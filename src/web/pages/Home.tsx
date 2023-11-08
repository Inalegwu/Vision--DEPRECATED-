import { Layout, Spinner } from "../components";
import { Box, Text } from "../components/atoms";
import { trpcReact } from "../../shared/config";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { appIdState, firstLaunchState } from "../state";
import { generateUUID } from "../../shared/utils";
import { toast } from "react-hot-toast";

export default function Home() {
  const [isFirstLaunch, setIsFirstLaunch] = useAtom(firstLaunchState);
  const [_, setAppId] = useAtom(appIdState);

  const {
    data: currentlyReading,
    isLoading: loadingCurrentlyReading,
    isError: continueError,
  } = trpcReact.issue.getCurrentlyReading.useQuery();

  const {
    data: doneReading,
    isLoading: loadingDone,
    isError: doneError,
  } = trpcReact.issue.getDoneReading.useQuery();

  useEffect(() => {
    if (isFirstLaunch) {
      toast.success("Welcome To Vision", {
        position: "top-center",
      });
      setIsFirstLaunch(true);
      setAppId(generateUUID());
    }
  }, [isFirstLaunch, setIsFirstLaunch, setAppId]);

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
            {loadingCurrentlyReading && <Spinner />}
            {currentlyReading?.issues.map((v) => {
              return (
                <Box>
                  <Text>{v.name}</Text>
                </Box>
              );
            })}
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
            {loadingDone && <Spinner />}
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}

