import { Box, Button, Text, NavLink, LinkButton } from "./atoms";
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
import { css } from "../stitches.config";

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
          <Text
            css={{
              color: `${theme === "dark" ? "$white" : "$deepBlack"}`,
              fontWeight: "bold",
            }}
          >
            Vision
          </Text>
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
            <Button
              css={{ color: `${theme === "dark" ? "$white" : "$deepBlack"}` }}
              onClick={() => minimizeWindow()}
            >
              <Minus size={13} />
            </Button>
            <Button
              css={{ color: `${theme === "dark" ? "$white" : "$deepBlack"}` }}
              onClick={() => maximizeWindow()}
            >
              <CornersOut size={13} />
            </Button>
            <Button
              css={{ color: `${theme === "dark" ? "$white" : "$deepBlack"}` }}
              onClick={() => closeWindow()}
            >
              <X size={13} />
            </Button>
          </Box>
        </Box>
        <Box css={{ width: "100%", height: "86%" }}>{props.children}</Box>
        <Box
          css={{
            width: "100%",
            height: "10%",
            padding: "$xxxl",
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            css={{
              padding: "$md",
              background: `${theme === "dark" ? "$gray" : "$lightGray"}`,
              borderRadius: "$xxl",
              width: "10%",
              height: "100%",
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <LinkButton
              css={{ color: `${theme === "dark" ? "$white" : "$deepBlack"}` }}
              to="/"
            >
              <House size={17} />
            </LinkButton>
            <LinkButton
              css={{ color: `${theme === "dark" ? "$white" : "$deepBlack"}` }}
              to="/library"
            >
              <Books size={17} />
            </LinkButton>
            <LinkButton
              css={{ color: `${theme === "dark" ? "$white" : "$deepBlack"}` }}
              to="/settings"
            >
              <User size={17} />
            </LinkButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

