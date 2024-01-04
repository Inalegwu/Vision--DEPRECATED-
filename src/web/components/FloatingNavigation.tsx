import { observer, useObservable } from "@legendapp/state/react";
import { GearSix, House } from "@phosphor-icons/react";
import { AnimatePresence, PanInfo } from "framer-motion";
import { useCallback } from "react";
import { useTimeout, useWindow } from "../hooks";
import { globalState$, settingsView } from "../state";
import { AnimatedBox, Box, Button, NavLink } from "./atoms";

const FloatingNavigation = observer(() => {
  const visible = useObservable(true);
  const mouseOver = useObservable(false);

  // the saved navigation position from
  // global state
  // this can be edited and saved back into
  // local storage to allow the user
  // customize the navigation bar position to their
  // taste , along the X-Axis only
  const navPos = globalState$.uiState.navPos;

  // show the navigation bar when the users mouse
  // is close to the bottom of the application window
  // this is intended to work like the windows/mac
  // taskbar/dock when set to automatically hide
  useWindow("mousemove", (e) => {
    if (e.clientY >= 600) {
      visible.set(true);
    }
  });

  // hide the navigation bar after a specified amount of time
  // eventually this timeout will be set from the user settings
  // as well as the autohide functionality
  useTimeout(() => {
    if (visible.get() && !mouseOver.get()) {
      visible.set(false);
    }
  }, 3000);

  // TODO
  const handlePan = useCallback(
    (_e: MouseEvent | PointerEvent | TouchEvent, info: PanInfo) => {
      console.log({ ...info });
    },
    [],
  );

  // the following functions toggle the mouseOver
  // state to positive or negative which informs
  // the useTimeout hook on whether or not it can
  // dismiss the navigation bar
  const handleMouseOver = useCallback(() => {
    mouseOver.set(true);
  }, [mouseOver]);

  const handleMouseLeave = useCallback(() => {
    mouseOver.set(false);
  }, [mouseOver]);

  return (
    <AnimatePresence>
      {visible.get() && (
        <AnimatedBox
          initial={{
            top: `${window.innerHeight}px`,
          }}
          animate={{
            top: `${navPos.get().y}px`,
          }}
          exit={{
            top: `${window.innerHeight}px`,
          }}
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
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
            left: `${navPos.get().x}px`,
          }}
        >
          <NavLink
            to="/"
            style={({ isActive }) => ({
              color: `${isActive ? "#74228d" : "rgba(255,255,255,0.3)"}`,
            })}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
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
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
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
          <AnimatedBox
            draggable
            onPan={handlePan}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            css={{
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              color: "$white",
              padding: "$xxxl",
              gap: "$sm",
              cursor: "grabbing",
              borderTopRightRadius: "$xl",
              borderBottomRightRadius: "$xl",
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
          </AnimatedBox>
        </AnimatedBox>
      )}
    </AnimatePresence>
  );
});

export default FloatingNavigation;
