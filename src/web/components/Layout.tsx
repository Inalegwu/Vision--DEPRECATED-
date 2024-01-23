import { CornersIcon, Cross2Icon, MinusIcon } from "@radix-ui/react-icons";
import { Box, Button, Flex, Text } from "@radix-ui/themes";
import { useKeyPress } from "@src/web/hooks";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { trpcReact } from "../../shared/config";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout(props: LayoutProps) {
  const router = useNavigate();
  const { mutate: closeWindow } = trpcReact.window.closeWindow.useMutation();
  const { mutate: maximizeWindow } =
    trpcReact.window.maximizeWindow.useMutation();
  const { mutate: minimizeWindow } =
    trpcReact.window.minimizeWindow.useMutation();

  // use ctrl/cmd key + q for quitting the app
  useKeyPress((e) => {
    if (e.ctrlKey && e.key === "q") {
      closeWindow();
    }
  });

  const goToSettings = useCallback(() => {
    router("/settings", {
      preventScrollReset: true,
      unstable_viewTransition: true,
    });
  }, [router]);

  return (
    <Flex className="w-full h-screen" direction="column">
      {/* titlebar */}
      <Flex
        align="center"
        justify="between"
        width="100%"
        px="3"
        py="1"
        className="border-b-[0.09px] border-b-solid border-b-slate-100/10"
      >
        <Box>
          <Text weight="light">Vision</Text>
        </Box>
        <Flex grow="1" p="4" id="drag-region" />
        <Flex gap="4" align="center" justify="end">
          {/* <Button
            onClick={goToSettings}
            variant="ghost"
            className="py-1.5"
            size="1"
          >
            <GearFine size={13} />
          </Button> */}
          <Button
            variant="ghost"
            size="1"
            color="gray"
            onClick={() => minimizeWindow()}
          >
            <MinusIcon />
          </Button>
          <Button
            variant="ghost"
            color="gray"
            size="1"
            onClick={() => maximizeWindow()}
          >
            <CornersIcon />
          </Button>
          <Button
            variant="ghost"
            color="gray"
            size="1"
            onClick={() => closeWindow()}
          >
            <Cross2Icon />
          </Button>
        </Flex>
      </Flex>
      {/* body */}
      <Box>{props.children}</Box>
    </Flex>
  );
}
