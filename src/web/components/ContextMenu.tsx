import React, { useCallback } from "react";
import { AnimatedBox, Box } from "./atoms";
import { styled } from "../stitches.config";

export type ContextMenuProps = {
  children?: React.ReactNode;
  style?: any;
};

export type ContextMenuRefProps = {
  visible: () => boolean;
  toggle: () => void;
};

const ContextMenu = React.forwardRef<ContextMenuRefProps, ContextMenuProps>(
  (props, ref) => {
    const [isVisible, setIsVisible] = React.useState<boolean>(false);
    const [mouseOver, setMouseOver] = React.useState<boolean>(false);

    React.useEffect(() => {
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
      return isVisible;
    }, [isVisible]);

    const toggle = useCallback(() => {
      setIsVisible((v) => !v);
    }, [setIsVisible]);

    React.useImperativeHandle(ref, () => ({ toggle, visible }));

    // if (!isVisible) {
    //   return <></>;
    // }

    return (
      <AnimatedBox
        transition={{
          duration: 0.2,
          ease: "linear",
        }}
        initial={{ display: "none", scale: 0 }}
        animate={{
          // opacity: isVisible ? 1 : 0,
          display: "block",
          scale: isVisible ? 1 : 0,
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
