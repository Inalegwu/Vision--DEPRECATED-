import { observer } from "@legendapp/state/react";
import { globalState$ } from "@src/web/state";
import { useCallback, useEffect, useRef } from "react";
import HStack from "../HStack";
import Switch, { SwitchRefProps } from "../Switch";
import VStack from "../VStack";
import { Box, Text } from "../atoms";

const Appearance = observer(() => {
  const ambientModeSwitch = useRef<SwitchRefProps>(null);

  useEffect(() => {}, []);

  const handleAmbientBackgroundClick = useCallback(() => {
    ambientModeSwitch.current?.toggle();

    const newState = ambientModeSwitch.current?.state();

    globalState$.uiState.layoutBackground.set(newState!);
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
          css={{ fontSize: 12, color: "$lightGray", fontWeight: "lighter" }}
        >
          Enable/Disable Ambient Background in the app. The reader ignores this
          setting
        </Text>
      </VStack>
    </Box>
  );
});

export default Appearance;
