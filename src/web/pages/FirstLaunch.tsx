import { Box, Button, Text } from "@components/atoms";
import { Layout } from "@components/index";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { globalState$ } from "../state";

export default function FirstLaunch() {
  const state = globalState$.get();
  const router = useNavigate();

  useEffect(() => {
    // set first launch to false once this page is loaded
    state.appState.firstLaunch=true;
    state.appState.applicationId=v4();

    console.log("First Launch")

  }, [state]);

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
        <Button onClick={() => router("/")}>
          <Text>Get Started</Text>
        </Button>
      </Box>
    </Layout>
  );
}
