import { AnimatedText, Box, Text } from "@components/atoms";
import { HStack, Layout } from "@components/index";
import { motion } from "framer-motion";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { globalState$ } from "../state";
import { styled } from "../stitches.config";

const AnimatedButton = styled(motion.button, {
  appearance: "none",
  border: "none",
});

export default function FirstLaunch() {
  const state = globalState$.get();
  const router = useNavigate();

  console.log(state);

  useEffect(() => {
    // set first launch to false once this page is loaded
    console.log("First Launch");
  }, [state]);

  const handleClick = useCallback(() => {
    state.appState.applicationId = v4();
    state.appState.firstLaunch = false;
    router("/");
  }, []);

  return (
    <Layout>
      <Box
        css={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          gap: "$lg",
        }}
      >
        <Box
          css={{
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "$sm",
          }}
        >
          <AnimatedText
            css={{ fontSize: 40, color: "$primary", fontWeight: "bold" }}
          >
            Welcome To Vision
          </AnimatedText>
          <HStack alignContent="center" alignItems="center" gap={5}>
            <AnimatedText
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              css={{ fontSize: 20, color: "$white" }}
            >
              The Future of Comic Consumption is Now and
            </AnimatedText>
            <AnimatedText
              initial={{ opacity: 0, top: 0 }}
              animate={{ opacity: 1, top: "50%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              css={{ fontSize: 20, color: "$primary", fontWeight: "bolder" }}
            >
              You're
            </AnimatedText>
            <AnimatedText
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              css={{ fontSize: 20, color: "$white" }}
            >
              a part of it
            </AnimatedText>
          </HStack>
        </Box>
        <AnimatedButton
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ease: "easeInOut" }}
          whileHover={{ scale: 0.98 }}
          css={{ background: "$primary", padding: "$md", borderRadius: "$md" }}
          onClick={handleClick}
        >
          <Text css={{ color: "$white", fontSize: 15 }}>Get Started</Text>
        </AnimatedButton>
      </Box>
    </Layout>
  );
}
