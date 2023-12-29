import { trackEvent } from "@aptabase/electron/renderer";
import { Box, Button, Text } from "@components/atoms";
import { useCallback } from "react";
import { FallbackProps } from "react-error-boundary";
import { HStack, VStack } from "../components";
import { globalState$ } from "../state";

const isDev = process.env.NODE_ENV === "development";

function ErrorBoundaryFallback(props: FallbackProps) {
  const state = globalState$.get();

  trackEvent("error_boundary triggered", {
    cause: props.error,
    timeOccured: Date.now(),
    appId: state.appState.applicationId || "",
    error: props.error,
  });

  const resetApp = useCallback(() => {
    console.log("Restting app");
    trackEvent("Reset App Trial");
    props.resetErrorBoundary();
  }, [props]);

  return (
    <Box
      css={{
        width: "100%",
        height: "100vh",
        background: "$danger",
        padding: "$lg",
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        color: "$white",
      }}
    >
      <VStack
        alignContent="center"
        alignItems="center"
        justifyContent="center"
        gap={10}
        style={{ width: "77%", margin: "auto", textAlign: "center" }}
      >
        <Text css={{ fontSize: 30, fontWeight: "bold" }}>
          Dang it, This isn't supposed to happen
        </Text>
        <VStack alignContent="center" alignItems="center" gap={2}>
          <Text
            css={{ fontSize: 23, color: "$lightGray", fontWeight: "light" }}
          >
            Don't worry , the team is going to make sure this doesn't happen
            again , I'll make sure of it 🙃
          </Text>
          <Text
            css={{ fontSize: 23, color: "$lightGray", fontWeight: "light" }}
          >
            until then try restetting the app
          </Text>
        </VStack>
        <Button
          css={{
            background: "$white",
            padding: "$lg",
            borderRadius: "$md",
            display: "flex",
            color: "$danger",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={resetApp}
        >
          <Text css={{ fontWeight: "bold" }}>Reset App</Text>
        </Button>
        {/* show the error inline when in development */}
        {isDev && (
          <Box
            css={{
              width: "100%",
              marginTop: "$lg",
              background: "$lightGray",
              backdropFilter: "blur(400px)",
              borderRadius: "$md",
              padding: "$lg",
              display: "flex",
              flexDirection: "column",
              alignContent: "flex-start",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              textAlign: "start",
              gap: "$md",
            }}
          >
            <HStack
              alignContent="center"
              alignItems="center"
              justifyContent="flex-start"
              gap={4}
            >
              <Text
                css={{ color: "$danger", fontWeight: "bold", fontSize: 20 }}
              >
                Error :{" "}
              </Text>
              <Text css={{ fontSize: 23 }}> {props.error.message}</Text>
            </HStack>
            <Text
              css={{
                fontSize: 15,
                color: "$danger",
                fontWeight: "bold",
                fontStyle: "oblique",
                textDecoration: "underline",
              }}
            >
              Require Stack
            </Text>
            <Text css={{ fontSize: 14, color: "$blackMuted" }}>
              {props.error.stack}
            </Text>
            <Text
              css={{
                fontSize: 15,
                color: "$danger",
                fontWeight: "bold",
                fontStyle: "oblique",
                textDecoration: "underline",
              }}
            >
              Cause
            </Text>
            <Text css={{ fontSize: 14, color: "$blackMuted" }}>
              {props.error.cause || "Unknown"}
            </Text>
            <HStack
              alignContent="center"
              alignItems="center"
              justifyContent="center"
              style={{ width: "100%" }}
            >
              <Text
                css={{
                  color: "$gray",
                  fontWeight: "lighter",
                  fontStyle: "italic",
                  fontSize: 13,
                }}
              >
                This is a dev mode message
              </Text>
            </HStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
}

export default ErrorBoundaryFallback;
