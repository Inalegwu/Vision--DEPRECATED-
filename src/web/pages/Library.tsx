import { Button, Text } from "@kuma-ui/core";
import { trpcReact } from "../../shared/config";
import { Layout } from "../components";

export default function Library() {
  const { mutate: addToLib, data } =
    trpcReact.library.addToLibrary.useMutation();

  return (
    <Layout>
      Library
      <Button onClick={() => addToLib()}>add to lib</Button>
      {data?.status === false && <Text>Failed , {data.reason}</Text>}
    </Layout>
  );
}

