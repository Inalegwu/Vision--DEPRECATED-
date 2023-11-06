import { Box, HStack } from "@kuma-ui/core";
import { Layout } from "../components";

export default function Settings() {
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
          background="colors.gray"
          padding={10}
          borderRadius={10}
          width="80%"
          height="90%"
        >
          more content
        </HStack>
      </Box>
    </Layout>
  );
}

