import { Box, Button, Text } from "@kuma-ui/core";
import { FiX, FiMinus, FiMaximize } from "react-icons/fi";
import { trpcReact } from "../../shared/config";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout(props: LayoutProps) {
  const { mutate: closeWindow } = trpcReact.window.closeWindow.useMutation();
  const { mutate: maximizeWindow } =
    trpcReact.window.maximizeWindow.useMutation();
  const { mutate: minimizeWindow } =
    trpcReact.window.minimizeWindow.useMutation();

  return (
    <Box
      display="flex"
      flexDirection="column"
      background="black"
      width="100%"
      height="100vh"
      color="white"
    >
      <Box
        display="flex"
        flexDirection="row"
        alignContent="center"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        p={3}
      >
        <Text color="gray">Vision</Text>
        <Box id="drag-region" display="flex" flex={1} p={2} />
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
            <FiMaximize size={14} />
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
      {props.children}
    </Box>
  );
}

