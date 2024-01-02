import { useObservable } from "@legendapp/state/react";
import { GearSix, House } from "@phosphor-icons/react";
import { AnimatePresence } from "framer-motion";
import { useCallback } from "react";
import { useWindow } from "../hooks";
import { globalState$, settingsView } from "../state";
import { AnimatedBox, Box, Button, NavLink } from "./atoms";

export default function FloatingNavigation() {
  const visible = useObservable(true);

  const navPos = globalState$.uiState.navPos.get();

  useWindow("mousemove", (e) => {
    if (e.clientY >= 712) {
      visible.set(true);
    }
  });

  //   TODO implement repositioning the nav by dragging the handle
  const handleDragStart = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      console.log(e);
    },
    [],
  );

  return (
    <AnimatePresence>
      {visible.get() && (
        <AnimatedBox
          initial={{
            top: `${window.innerHeight}px`,
          }}
          animate={{
            top: `${navPos.y}px`,
          }}
          exit={{
            top: `${window.innerHeight}px`,
          }}
          css={{
            borderRadius: "$xl",
            background: "$blackMuted",
            backdropFilter: "blur(1000px)",
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "flex-start",
            position: "absolute",
            zIndex: 5000,
            left: `${navPos.x}px`,
          }}
        >
          <NavLink
            to="/"
            style={({ isActive }) => ({
              color: `${isActive ? "#74228d" : "rgba(255,255,255,0.3)"}`,
            })}
            css={{
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              padding: "$xxxl",
            }}
          >
            <House size={16} />
          </NavLink>
          <Button
            onClick={() => settingsView.set(true)}
            css={{
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              padding: "$xxxl",
              color: "$lightGray",
              "&:hover": {
                color: "$white",
              },
            }}
          >
            <GearSix size={16} />
          </Button>
          <Button
            onClick={handleDragStart}
            css={{
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              color: "$white",
              padding: "$xxxl",
              gap: "$sm",
              cursor: "grabbing",
            }}
          >
            <Box
              css={{
                background: "$lightGray",
                borderRadius: "$full",
                height: 17,
                width: "1px",
              }}
            />
            <Box
              css={{
                background: "$lightGray",
                borderRadius: "$full",
                height: 17,
                width: "1px",
              }}
            />
            <Box
              css={{
                background: "$lightGray",
                borderRadius: "$full",
                height: 17,
                width: "1px",
              }}
            />
          </Button>
        </AnimatedBox>
      )}
    </AnimatePresence>
  );
}
