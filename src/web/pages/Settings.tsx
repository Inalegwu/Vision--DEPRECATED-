import { Layout } from "../components";
import { Box, Text } from "../components/atoms";
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
            padding: "$lg",
            background: "$deepBlack",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <Text
            css={{
              fontWeight: "bold",
              fontSize: 30,
              color: "$white",
            }}
          >
            Settings
          </Text>

          <Box
            css={{
              display: "flex",
              width: "100%",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text css={{ color: "$gray", fontSize: 11 }}>{appId}</Text>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}

