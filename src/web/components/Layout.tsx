import {
  Box,
  Button,
  Text,
  NavLink,
  LinkButton,
  AnimatedBox,
  AnimatedText,
  AnimatedButton,
} from "./atoms";
import {
  X,
  House,
  Books,
  Minus,
  List,
  CornersOut,
  User,
  Gear,
} from "@phosphor-icons/react";
import { trpcReact } from "../../shared/config";
import { useAtom } from "jotai";

import { useCallback, useState } from "react";
import HStack from "./HStack";

import VStack from "./VStack";

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
      css={{
        height: "100vh",
        width: "100%",
        color: "$white",
        background: "$background",
      }}
    >
      <Box
        css={{
          width: "100%",
          height: "4%",
          display: "flex",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "0.1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Text>Vision</Text>
        <Box
          id="drag-region"
          css={{
            display: "flex",
            flex: 1,
            padding: "$md",
          }}
        />
        <HStack gap={10}>
          <Button css={{ color: "$white" }} onClick={() => minimizeWindow()}>
            <Minus />
          </Button>
          <Button css={{ color: "$white" }} onClick={() => maximizeWindow()}>
            <CornersOut />
          </Button>
          <Button css={{ color: "$white" }} onClick={() => closeWindow()}>
            <X />
          </Button>
        </HStack>
      </Box>
      <Box css={{ width: "100%", height: "96%" }}>{props.children}</Box>
    </Box>
  );
}

