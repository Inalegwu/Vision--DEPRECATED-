import { observer, useObservable } from "@legendapp/state/react";
import React, { useCallback, useImperativeHandle } from "react";
import { globalState$ } from "../state";
import { AnimatedBox, Box } from "./atoms";

export type SwitchRefProps = {
  toggle: () => void;
  state: () => void;
};

export type SwitchProps = {
  onClick?: () => void;
  initial?: boolean;
};

// custom switch component
// I enjoy implementing a lot of the components libraries provide
// 'cause I also want to know how to build it should I ever have
// to build a design system from scratch at a company
const Switch = observer(
  React.forwardRef<SwitchRefProps, SwitchProps>(
    ({ onClick, initial }, ref) => {
      const toggled = useObservable(initial || false);

      const { colorMode } = globalState$.uiState.get();

      const state = useCallback(() => {
        return toggled.get();
      }, [toggled]);

      const toggle = useCallback(() => {
        toggled.set(!toggled.get());
      }, [toggled]);

      useImperativeHandle(ref, () => ({ state, toggle }));

      return (
        <Box
          css={{
            background: `${
              toggled.get()
                ? "$primary"
                : colorMode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.2)"
            }`,
            borderRadius: "$full",
            width: "7%",
            padding: "$sm",
          }}
        >
          <AnimatedBox
            onClick={onClick}
            initial={{
              left: 0,
              background: "$primary",
            }}
            animate={{
              left: `${toggled.get() ? "52%" : ""}`,
            }}
            css={{
              position: "relative",
              width: "40%",
              height: "100%",
              borderRadius: "$full",
              background: `${toggled.get() ? "$white" : "$primary"}`,
              padding: "$lg",
              cursor: "pointer",
            }}
          />
        </Box>
      );
    },
  ),
);

export default Switch;
