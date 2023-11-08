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

  return <Layout>content</Layout>;
}

