import { HStack, Heading, Image, Text, VStack } from "@kuma-ui/core";
import { Layout, Spinner } from "../components";
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
      <VStack width="100%" height="100%" padding={3} gap={10}>
        <VStack width="100%" height="50%" gap={4}>
          <HStack>
            <Heading as="h1">Continue Reading</Heading>
          </HStack>
          <HStack
            alignContent="center"
            alignItems="center"
            justifyContent="center"
          >
            {loadingCurrentlyReading && <Spinner size={40} />}
            {continueReading?.issues.map((v) => {
              return (
                <Image src={v.thumbnailUrl} alt={v.name}>
                  <VStack>
                    <Text>{v.name}</Text>
                  </VStack>
                </Image>
              );
            })}
          </HStack>
        </VStack>
        <VStack width="100%" height="50%">
          <HStack>
            <Heading as="h1">Done Reading</Heading>
          </HStack>
          <HStack>
            {loadingDone && <Spinner size={40} />}
            {doneReading?.issues.map((v) => {
              return (
                <Image src={v.thumbnail} alt={v.name}>
                  <VStack>
                    <Text>{v.name}</Text>
                  </VStack>
                </Image>
              );
            })}
          </HStack>
        </VStack>
      </VStack>
    </Layout>
  );
}

