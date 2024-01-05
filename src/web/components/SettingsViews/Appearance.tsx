import { observer } from "@legendapp/state/react";
import { globalState$ } from "@src/web/state";
import { useCallback, useRef } from "react";
import HStack from "../HStack";
import Switch, { SwitchRefProps } from "../Switch";
import VStack from "../VStack";
import { Box, Text } from "../atoms";

const Appearance = observer(() => {
  const ambientModeSwitch = useRef<SwitchRefProps>(null);
  const colorModeSwitch = useRef<SwitchRefProps>(null);

  const handleAmbientBackgroundClick = useCallback(() => {
    ambientModeSwitch.current?.toggle();

    const newState = ambientModeSwitch.current?.state();

    globalState$.uiState.layoutBackground.set(newState!);
  }, []);

  const handleColorModeChange = useCallback(() => {
    colorModeSwitch.current?.toggle();

    const newState = colorModeSwitch.current?.state();

    globalState$.uiState.colorMode.set(newState ? "dark" : "light");
  }, []);

  return (
    <Box
      css={{
        width: "100%",
        height: "100%",
        padding: "$lg",
        display: "flex",
        flexDirection: "column",
        alignContent: "flex-start",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        overflowY: "scroll",
        gap: "$md",
      }}
    >
      {/* ambient background setting */}
      <VStack
        alignContent="flex-start"
        alignItems="flex-start"
        style={{ gap: "$md", width: "100%", padding: "$md" }}
      >
        <HStack
          alignContent="center"
          alignItems="center"
          justifyContent="space-between"
          style={{ width: "100%" }}
        >
          <Text css={{ fontSize: 13, fontWeight: "normal" }}>
            Ambient Background
          </Text>
          <Switch
            initial={globalState$.uiState.layoutBackground.get()}
            onClick={handleAmbientBackgroundClick}
            ref={ambientModeSwitch}
          />
        </HStack>
        <Text
          css={{ fontSize: 11, color: "$lightGray", fontWeight: "lighter" }}
        >
          Enable/Disable Ambient Background in the app. The reader ignores this
          setting
        </Text>
      </VStack>
      <VStack
        alignContent="flex-start"
        alignItems="flex-start"
        style={{ gap: "$md", width: "100%", padding: "$md" }}
      >
        <HStack
          alignContent="center"
          alignItems="center"
          justifyContent="space-between"
          style={{ width: "100%" }}
        >
          <Text css={{ fontSize: 13, fontWeight: "normal" }}>Dark Mode</Text>
          <Switch
            // set the intial value of the colormode switch based
            // of the current state of the color mode
            // if the ui is dark , it is switch on , otherwise it is off
            initial={
              globalState$.uiState.colorMode.get() === "dark" ? true : false
            }
            onClick={handleColorModeChange}
            ref={colorModeSwitch}
          />
        </HStack>
        <Text
          css={{ fontSize: 11, color: "$lightGray", fontWeight: "lighter" }}
        >
          Tired of the dark side ? Make your way to the light side , or
          vice-versa. Be careful in the dark though , there's a guy dressed like
          a giant Bat there and I don't know why
        </Text>
      </VStack>
    </Box>
  );
});

export default Appearance;
