import { Box, Button, Text } from "@kuma-ui/core";
import { FiX, FiMinus, FiMaximize } from "react-icons/fi";
import { trpcReact } from "../../shared/config";
import { useCallback, useEffect, useState } from "react";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout(props: LayoutProps) {
  const { mutate: closeWindow } = trpcReact.window.closeWindow.useMutation();
  const { mutate: maximizeWindow } =
    trpcReact.window.maximizeWindow.useMutation();
  const { mutate: minimizeWindow } =
    trpcReact.window.minimizeWindow.useMutation();

  const [dockVisible, setDockVisible] = useState<boolean>(true);

  useEffect(() => {
    const dockVisibleInterval = setInterval(() => {
      if (dockVisible) {
        setDockVisible(false);
      }
    }, 5000);

    return () => {
      clearInterval(dockVisibleInterval);
    };
  }, [dockVisible, setDockVisible]);

  const handleMouseEnter = useCallback(() => {
    setDockVisible(true);
  }, [setDockVisible]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      height="100vh"
      color="white"
      background="black"
    >
      {/* blur  */}
      <Box background="purple" height={10} width={10} />
      <Box
        width="100%"
        height="100%"
        background="transparent"
        backdropFilter="blur(400px)"
        position="absolute"
        zIndex={1}
      >
        {/* titlebar */}
        <Box
          display="flex"
          flexDirection="row"
          alignContent="center"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          p={3}
          height="4%"
          borderBottom="0.17px solid rgba(255,255,255,0.04)"
        >
          <Text color="gray">Vision</Text>
          <Box id="drag-region" display="flex" flex={1} p={10} />
          <Box
            display="flex"
            flexDirection="row"
            alignContent="center"
            alignItems="center"
            justifyContent="flex-end"
            gap={10}
            width="10%"
          >
            <Button
              onClick={() => minimizeWindow()}
              background="none"
              border="none"
              color="white"
              transition="0.5s"
              _hover={{ color: "gray" }}
            >
              <FiMinus size={14} />
            </Button>
            <Button
              onClick={() => maximizeWindow()}
              background="none"
              border="none"
              color="white"
              transition="0.5s"
              _hover={{ color: "gray" }}
            >
              <FiMaximize size={11} />
            </Button>
            <Button
              onClick={() => closeWindow()}
              background="none"
              border="none"
              color="white"
              transition="0.5s"
              _hover={{ color: "red" }}
            >
              <FiX size={14} />
            </Button>
          </Box>
        </Box>
        <Box width="100%" height="86%">
          {props.children}
        </Box>
        {/* bottom bar */}
        <Box
          onMouseEnter={handleMouseEnter}
          width="100%"
          display="flex"
          alignContent="center"
          alignItems="center"
          justifyContent="center"
          height="10%"
        >
          {/* dock */}
          {dockVisible && (
            <Box
              padding={5}
              height="70%"
              background="gray"
              width="40%"
              display="flex"
              alignContent="center"
              alignItems="center"
              transition="ease-out"
              borderRadius={9999}
            >
              content
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

