import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { AnimatedBox, Box } from "./atoms";
import { styled } from "../stitches.config";
import { ThemeCSS } from "../../shared/types";

export type ContextMenuProps = {
  children?: React.ReactNode;
  style?: ThemeCSS;
};

export type ContextMenuRefProps = {
  visible: () => boolean;
  toggle: () => void;
};

const ContextMenu = React.forwardRef<ContextMenuRefProps, ContextMenuProps>(
  (props, ref) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [mouseOver, setMouseOver] = useState<boolean>(false);

    useEffect(() => {
      const visibleTimeout = setTimeout(() => {
        if (isVisible && !mouseOver) {
          setIsVisible(false);
        }
      }, 6000);

      return () => {
        clearTimeout(visibleTimeout);
      };
    }, [isVisible, setIsVisible]);

    const visible = useCallback(() => {
      console.log("From Context Menu : ", isVisible);
      return isVisible;
    }, [isVisible]);

    const toggle = useCallback(() => {
      setIsVisible((v) => !v);
    }, [setIsVisible]);

    useImperativeHandle(ref, () => ({ toggle, visible }));

    return (
      <AnimatedBox
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
        initial={{ opacity: 0, display: "none" }}
        animate={{
          opacity: isVisible ? 1 : 0,
          display: "block",
        }}
        css={props.style}
        onMouseEnter={() => {
          setMouseOver(true);
        }}
        onMouseLeave={() => {
          setMouseOver(false);
        }}
      >
        {props.children}
      </AnimatedBox>
    );
  }
);

export default ContextMenu;
