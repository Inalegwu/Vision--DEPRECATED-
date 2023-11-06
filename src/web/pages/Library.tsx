import { Button, HStack, Heading, Text, VStack } from "@kuma-ui/core";
import { trpcReact } from "../../shared/config";
import { Layout } from "../components";
import { Plus } from "@phosphor-icons/react";

export default function Library() {
  const { mutate: addToLib, data } =
    trpcReact.library.addToLibrary.useMutation();

  return (
    <Layout>
      <VStack padding={5} gap={5}>
        <HStack
          width="100%"
          padding={2}
          display="flex"
          justifyContent="space-between"
        >
          <Heading as="h1">Library</Heading>
          <Button
            border="none"
            background="gray"
            color="white"
            borderRadius={99999}
            width={26}
            height={26}
            display="flex"
            alignContent="center"
            alignItems="center"
            justifyContent="center"
            onClick={() => addToLib()}
          >
            <Plus size={13} />
          </Button>
        </HStack>
        {data?.status === false && <Text>Failed , {data.reason}</Text>}
      </VStack>
    </Layout>
  );
}

