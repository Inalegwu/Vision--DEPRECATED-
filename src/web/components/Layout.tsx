import { CornersIcon, Cross2Icon, MinusIcon } from "@radix-ui/react-icons";
import { Box, Button, Flex, Text } from "@radix-ui/themes";
import { useKeyPress } from "@src/web/hooks";
import { trpcReact } from "../../shared/config";
import { globalState$ } from "../state";
import HStack from "./HStack";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout(props: LayoutProps) {
  const { mutate: closeWindow } = trpcReact.window.closeWindow.useMutation();
  const { mutate: maximizeWindow } =
    trpcReact.window.maximizeWindow.useMutation();
  const { mutate: minimizeWindow } =
    trpcReact.window.minimizeWindow.useMutation();

  const { layoutBackground, colorMode } = globalState$.uiState.get();

  // use ctrl/cmd key + q for quitting the app
  useKeyPress((e) => {
    if (e.ctrlKey && e.key === "q") {
      closeWindow();
    }
  });

  return (
    <Flex width="100%" height="100%" direction="column">
      {/* titlebar */}
      <Flex align="center" justify="between" width="100%" px="3" py="2">
        <Box>
          <Text weight="light">Vision</Text>
        </Box>
        <Flex grow="1" p="4" id="drag-region" />
        <HStack
          gap={10}
          alignContent="center"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Button variant="ghost" size="1" onClick={() => minimizeWindow()}>
            <MinusIcon />
          </Button>
          <Button variant="ghost" size="1" onClick={() => maximizeWindow()}>
            <CornersIcon />
          </Button>
          <Button variant="ghost" size="1" onClick={() => closeWindow()}>
            <Cross2Icon />
          </Button>
        </HStack>
      </Flex>
      {/* body */}
      <Box>{props.children}</Box>
      {/* <SettingsView />
        <FloatingNavigation /> */}
    </Flex>
  );
}
