import { Box, HStack } from "@kuma-ui/core";
import { Layout } from "../components";
import { useAtom } from "jotai";
import { appIdState } from "../state";

export default function Settings() {
  const [appId] = useAtom(appIdState);

  return (
    <Layout>
      <Box
        width="100%"
        height="100%"
        display="flex"
        alignContent="center"
        alignItems="center"
        justifyContent="center"
      >
        <HStack
          background="gray"
          padding={10}
          borderRadius={10}
          width="80%"
          height="90%"
        >
          {appId}
        </HStack>
      </Box>
    </Layout>
  );
}

