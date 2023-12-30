import { trackEvent } from "@aptabase/electron/renderer";
import { Box, Button, Text } from "@components/atoms";
import { IS_DEV } from "@src/shared/utils";
import { useCallback } from "react";
import { FallbackProps } from "react-error-boundary";
import pkg from "../../../package.json";
import { HStack, VStack } from "../components";
import { globalState$ } from "../state";


function ErrorBoundaryFallback(props: FallbackProps) {
  const state = globalState$.get();

  trackEvent("error_boundary triggered", {
    // the time that this component was rendered
    // which in turn is the time when the error occured
    timeOccured: Date.now(),
    // the users application id
    // to see if this is a recurring event
    // and if it's frequent on this users application
    // instance
    appId: state.appState.applicationId || "",
    // the error body that caused the failure
    // this is essentially the reason why this event was
    // triggered
    error: props.error,
    // what version of the app is the user
    // on , to know whether or not to tell the user
    // to update
    appVer:pkg.version
  });

  // this is used to reset the app
  // to see if the error is a one off
  const resetApp = useCallback(() => {
    // send an event for when the app is reset
    // TODO I should find away to track the
    // count of the reset request to know how many times
    // the reset was triggered
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
        {IS_DEV && (
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
            {/* the actual error message */}
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
            {/* the error require stack which should allow 
                to track down the error to where the call was made
            */}
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
            {/* the cause of the error , which might also help with narrowing things down */}
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
