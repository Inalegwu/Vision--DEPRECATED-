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
  const [sideBarShowing, setSideBarShowing] = useState<boolean>(true);

  const { mutate: closeWindow } = trpcReact.window.closeWindow.useMutation();
  const { mutate: maximizeWindow } =
    trpcReact.window.maximizeWindow.useMutation();
  const { mutate: minimizeWindow } =
    trpcReact.window.minimizeWindow.useMutation();

  const handleSideBarClick = useCallback(() => {
    setSideBarShowing((v) => !v);
  }, [setSideBarShowing]);

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
      <Box css={{ width: "100%", height: "96%", display: "flex" }}>
        <AnimatedBox
          animate={{
            width: sideBarShowing ? "20%" : "0%",
            opacity: sideBarShowing ? 1 : 0,
          }}
          layout
          initial={false}
          transition={{ layout: { duration: 0.3 } }}
          css={{
            background: "$deepBlack",
          }}
        >
          <HStack
            alignContent="center"
            alignItems="center"
            justifyContent="flex-end"
            padding={5}
            gap={5}
          >
            <LinkButton
              to="/settings"
              css={{
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                color: "$white",
                padding: "$md",
                borderRadius: "$md",
                background: "$gray",
              }}
            >
              <Gear />
            </LinkButton>
            <Button
              onClick={handleSideBarClick}
              css={{
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                color: "$white",
                padding: "$md",
                borderRadius: "$md",
                background: "$gray",
              }}
            >
              <List size={15} />
            </Button>
          </HStack>
          <VStack padding={5} gap={3} justifyContent="space-between">
            <LinkButton
              to="/"
              css={{
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "$lg",
                color: "$white",
                background: "$gray",
                padding: "$md",
                width: "100%",
                borderRadius: "$md",
              }}
            >
              <House />
              <Text>Home</Text>
            </LinkButton>
            <LinkButton
              css={{
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "$lg",
                color: "$white",
                background: "$gray",
                padding: "$md",
                width: "100%",
                borderRadius: "$md",
              }}
              to="/library"
            >
              <Books />
              <Text>Library</Text>
            </LinkButton>
          </VStack>
        </AnimatedBox>
        <AnimatedBox
          initial={false}
          animate={{ width: sideBarShowing ? "80%" : "100%" }}
        >
          {!sideBarShowing && (
            <AnimatedButton
              initial={false}
              onClick={handleSideBarClick}
              css={{
                position: "absolute",
                zIndex: 99999,
                background: "$gray",
                padding: "$lg",
                height: 30,
                width: 30,
                borderRadius: "$full",
                color: "$white",
                left: "97%",
                top: "5%",
              }}
              animate={{
                opacity: sideBarShowing ? 0 : 1,
                scale: sideBarShowing ? 0 : 1,
              }}
            >
              <List />
            </AnimatedButton>
          )}

          {props.children}
        </AnimatedBox>
      </Box>
    </Box>
  );
}

