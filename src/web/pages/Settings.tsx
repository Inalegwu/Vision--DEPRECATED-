import { Layout } from "../components";
import { useAtom } from "jotai";
import { appIdState } from "../state";

export default function Settings() {
  const [appId] = useAtom(appIdState);

  return <Layout>content</Layout>;
}

