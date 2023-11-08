import { Box, Button, Text, LinkButton } from "./atoms";
import {
  X,
  House,
  Books,
  Minus,
  CornersOut,
  User,
} from "@phosphor-icons/react";
import { trpcReact } from "../../shared/config";
import { useAtom } from "jotai";
import { themeState } from "../state";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout(props: LayoutProps) {
  const { mutate: closeWindow } = trpcReact.window.closeWindow.useMutation();
  const { mutate: maximizeWindow } =
    trpcReact.window.maximizeWindow.useMutation();
  const { mutate: minimizeWindow } =
    trpcReact.window.minimizeWindow.useMutation();

  const [theme] = useAtom(themeState);

  return (
    <Box
      css={{
        height: "100vh",
        width: "100%",
        color: `${theme === "dark" ? "$white" : "$deepBlack"}`,
        background: `${theme === "dark" ? "$background" : "$white"}`,
      }}
    >
      <Box
        css={{
          background: "$primary",
          width: "10vh",
          height: "10vh",
          position: "absolute",
          zIndex: 0,
        }}
      />

      <Box
        css={{
          width: "100%",
          height: "100%",
          background: "transparent",
          backdropFilter: "blur(400px)",
          position: "absolute",
          zIndex: 1,
        }}
      >
        <Box
          css={{
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "$sm",
            height: "4%",
            borderBottom: "0.1px solid rgba(255,255,255,0.05)",
          }}
        >
          <Text css={{ color: "$lightGray" }}>Vision</Text>
          <Box id="drag-region" css={{ padding: 10, flex: 1 }} />
          <Box
            css={{
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 5,
            }}
          >
            <Button css={{ color: "$white" }} onClick={() => minimizeWindow()}>
              <Minus size={13} />
            </Button>
            <Button css={{ color: "$white" }} onClick={() => maximizeWindow()}>
              <CornersOut size={13} />
            </Button>
            <Button css={{ color: "$white" }} onClick={() => closeWindow()}>
              <X size={13} />
            </Button>
          </Box>
        </Box>
        <Box css={{ width: "100%", height: "86%" }}>{props.children}</Box>
        <Box
          css={{
            width: "100%",
            height: "10%",
            padding: "$lg",
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            css={{
              padding: "$md",
              background: "$gray",
              borderRadius: "$lg",
              width: "10%",
              height: "100%",
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <LinkButton css={{ color: "$white" }} to="/">
              <House size={17} />
            </LinkButton>
            <LinkButton css={{ color: "$white" }} to="/library">
              <Books size={17} />
            </LinkButton>
            <LinkButton css={{ color: "$white" }} to="/settings">
              <User size={17} />
            </LinkButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

