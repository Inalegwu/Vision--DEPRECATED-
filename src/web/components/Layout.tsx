import { Box, Button, Text } from "./atoms";
import { X, Minus, CornersOut } from "@phosphor-icons/react";
import { trpcReact } from "../../shared/config";
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

  const { data: appVer } = trpcReact.version.useQuery();

  return (
    <Box
      css={{
        height: "100vh",
        width: "100%",
        color: "$white",
        background: "$background",
      }}
    >
      {/* titlebar */}
      <Box
        css={{
          width: "100%",
          height: "4%",
          display: "flex",
          padding: "$xl",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "0.1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Box
          css={{
            display: "flex",
            alignContent: "flex-end",
            alignItems: "flex-end",
            gap: "$md",
          }}
        >
          <Text>Vision</Text>
          <Text css={{ fontSize: 12, color: "$gray" }}>{appVer}</Text>
        </Box>
        <Box
          id="drag-region"
          css={{
            display: "flex",
            flex: 1,
            padding: "$md",
            height: 25,
            cursor: "grab",
          }}
        />
        <HStack gap={10}>
          <Button
            css={{ color: "$white", "&:hover": { color: "$lightGray" } }}
            onClick={() => minimizeWindow()}
          >
            <Minus />
          </Button>
          <Button
            css={{ color: "$white", "&:hover": { color: "$lightGray" } }}
            onClick={() => maximizeWindow()}
          >
            <CornersOut />
          </Button>
          <Button
            css={{ color: "$white", "&:hover": { color: "$danger" } }}
            onClick={() => closeWindow()}
          >
            <X />
          </Button>
        </HStack>
      </Box>
      <Box css={{ width: "100%", height: "96%" }}>{props.children}</Box>
    </Box>
  );
}
