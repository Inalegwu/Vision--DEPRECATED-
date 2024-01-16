import { observer } from "@legendapp/state/react";
import { Box, Flex, Switch, Text } from "@radix-ui/themes";
import { globalState$ } from "@src/web/state";
import { useCallback } from "react";

const Appearance = observer(() => {
  const { colorMode } = globalState$.uiState.get();

  const changeColorMode = useCallback(() => {
    if (colorMode === "dark") {
      document.body.classList.remove("dark");
      globalState$.uiState.colorMode.set("light");
    } else {
      document.body.classList.add("dark");
      globalState$.uiState.colorMode.set("dark");
    }
  }, [colorMode]);

  return (
    <Box className="w-full h-full p-4 flex flex-col items-start justify-start overflow-y-scroll gap-4">
      {/* ambient background setting */}
      <Flex align="start" direction="column" className="gap-3 w-full p-1">
        <Flex align="center" className="w-full" justify="between">
          <Text size="3">Ambient Background</Text>
          <Switch size="2" />
        </Flex>
        <Text size="2">
          Enable/Disable Ambient Background in the app. The reader ignores this
          setting
        </Text>
      </Flex>
      <Flex direction="column" align="start" className="w-full p-1 gap-3">
        <Flex align="center" justify="between" className="w-full">
          <Text size="3">Dark Mode</Text>
          <Switch onClick={changeColorMode} size="2" />
        </Flex>
        <Text size="2" className="text-slate-100">
          Tired of the dark side ? Make your way to the light side , or
          vice-versa. Be careful in the dark though , there's a guy dressed like
          a giant Bat there and I don't know why
        </Text>
      </Flex>
    </Box>
  );
});

export default Appearance;
