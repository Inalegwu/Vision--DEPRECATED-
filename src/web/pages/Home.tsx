import { Box, HStack, Heading, VStack } from "@kuma-ui/core";
import { Layout } from "../components";

export default function Home() {
  return (
    <Layout>
      <VStack width="100%" height="100%" padding={3} gap={10}>
        <VStack>
          <HStack>
            <Heading as="h1">Continue Reading</Heading>
          </HStack>
        </VStack>
        <VStack>
          <HStack>
            <Heading as="h1">Done Reading</Heading>
          </HStack>
        </VStack>
      </VStack>
    </Layout>
  );
}

