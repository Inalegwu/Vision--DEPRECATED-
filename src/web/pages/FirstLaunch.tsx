import {
  AnimatedBox,
  AnimatedButton,
  AnimatedText,
  Box,
  Text,
} from "@components/atoms";
import { useObservable } from "@legendapp/state/react";
import { generateUUID } from "@src/shared/utils";
import { useTimeout } from "@src/web/hooks";
import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { globalState$ } from "../state";

export default function FirstLaunch() {
  const router = useNavigate();
  const initialText = useObservable(true);

  useEffect(() => {
    globalState$.appState.set({
      applicationId: generateUUID(),
      firstLaunch: false,
    });
  }, []);

  const handleClick = useCallback(() => {
    router("/");
  }, [router]);

  useTimeout(() => {
    initialText.set(false);
  }, 5000);

  return (
    <>
      <Box
        css={{
          width: "100%",
          padding: "$xxxl",
          position: "absolute",
          zIndex: 99999,
          top: 0,
          left: 0,
        }}
        id="drag-region"
      />
      <AnimatedBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3, ease: "easeOut", delay: 2 }}
        css={{
          position: "absolute",
          zIndex: 9999,
          backdropFilter: "blur(300px)",
          background: "$lightGray",
          padding: "$lg",
          display: "flex",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          top: "93%",
          left: "43.7%",
          borderRadius: "$full",
          color: "$white",
          fontSize: 13,
          fontWeight: "lighter",
          boxShadow: "0px 1px 70px 0px rgba(255,255,255,0.4)",
        }}
      >
        <Text>Made With ❤️ By Humans</Text>
      </AnimatedBox>
      <AnimatedBox
        initial={{ scale: 0, opacity: 0, left: 0 }}
        animate={{ scale: 2, opacity: 1, left: "60%" }}
        transition={{ ease: "easeOut", duration: 1 }}
        css={{
          width: 500,
          height: 500,
          borderRadius: "$full",
          background: "$primary",
          position: "absolute",
          zIndex: 0,
          filter: "blur(100px)",
        }}
      />
      <AnimatedBox
        initial={{ scale: 0, opacity: 0, left: "100%" }}
        animate={{ scale: 2, opacity: 1, left: 0 }}
        transition={{ ease: "easeOut", duration: 1 }}
        css={{
          width: 500,
          height: 500,
          borderRadius: "$full",
          background: "$secondary",
          position: "absolute",
          zIndex: 0,
          filter: "blur(100px)",
        }}
      />
      <AnimatedBox
        initial={{ opacity: 0 }}
        transition={{ ease: "easeOut", duration: 0.1 }}
        animate={{ opacity: 1 }}
        css={{
          position: "absolute",
          zIndex: 1,
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          backdropFilter: "blur(300px)",
        }}
      >
        <AnimatePresence>
          {initialText.get() && (
            <AnimatedText
              initial={{ scale: 0, opacity: 0 }}
              transition={{ ease: "easeOut", duration: 2.3 }}
              animate={{ scale: 1.3, opacity: 1 }}
              exit={{ top: -500 }}
              css={{
                fontSize: 40,
                fontWeight: "bold",
                color: "$white",
              }}
            >
              Vision
            </AnimatedText>
          )}
          {!initialText.get() && (
            <AnimatedBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              css={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center",
                gap: "$xxxl",
              }}
            >
              <AnimatedText
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                css={{
                  color: "$white",
                  fontSize: 30,
                  fontWeight: "bolder",
                  textAlign: "center",
                }}
              >
                The Future of Digital Comic Consumption
              </AnimatedText>
              <AnimatedButton
                onClick={handleClick}
                css={{
                  cursor: "pointer",
                  background: "$lightGray",
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "$white",
                  fontWeight: "bold",
                  fontSize: 17,
                  backdropFilter: "blur(300px)",
                  padding: "$lg",
                  width: "55%",
                  borderRadius: "$full",
                  boxShadow: "0px 1px 70px 0px rgba(255,255,255,0.4)",
                  transition: "0.5s ease-out",
                  "&:hover": { boxShadow: "none" },
                }}
              >
                <Text>Hop into the Matrix 😎</Text>
              </AnimatedButton>
            </AnimatedBox>
          )}
        </AnimatePresence>
      </AnimatedBox>
    </>
  );
}
