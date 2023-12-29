import { observer } from "@legendapp/state/react";
import { Point, ThemeCSS } from "@shared/types";
import { AnimatePresence } from "framer-motion";
import React, { useCallback, useImperativeHandle, useState } from "react";
import { useTimeout } from "../hooks";
import { AnimatedBox } from "./atoms";

export type ContextMenuRefProps = {
  isVisible: () => boolean;
  show: () => void;
  hide: () => void;
};

export type ContextMenuProps = {
  points: Point;
  children?: React.ReactNode | React.ReactNode[];
  style?: ThemeCSS;
};

const ContextMenu = observer(
  React.forwardRef<ContextMenuRefProps, ContextMenuProps>(
    ({ children, points, style }, ref) => {
      const [visible, setVisible] = useState(false);
      const [mouseOver, setMouseOver] = useState(false);

      useTimeout(() => {
        if (visible && !mouseOver) {
          setVisible(false);
        }
      }, 3000);

      const isVisible = useCallback(() => {
        return visible;
      }, [visible]);

      const show = useCallback(() => {
        setVisible(true);
      }, []);

      const hide = useCallback(() => {
        setVisible(false);
      }, []);

      useImperativeHandle(ref, () => ({ show, hide, isVisible }));

      return (
        <AnimatePresence>
          {visible && (
            <AnimatedBox
              onMouseOver={() => setMouseOver(true)}
              onMouseLeave={() => setMouseOver(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              css={{
                position: "absolute",
                zIndex: 99999,
                top: `${points.y}px`,
                left: `${points.x}px`,
                ...style,
              }}
            >
              {children}
            </AnimatedBox>
          )}
        </AnimatePresence>
      );
    }
  )
);

export default ContextMenu;
