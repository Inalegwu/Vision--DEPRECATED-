import { Layout } from "../components";
import { Box } from "../components/atoms";
import { useAtom } from "jotai";
import { appIdState } from "../state";

export default function Settings() {
  const [appId] = useAtom(appIdState);

  return (
    <Layout>
      <Box
        css={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          css={{
            width: "80%",
            height: "90%",
            borderRadius: "$lg",
            background: "$deepBlack",
          }}
        ></Box>
      </Box>
    </Layout>
  );
}

