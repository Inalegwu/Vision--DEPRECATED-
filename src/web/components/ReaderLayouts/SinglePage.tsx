import { useNavigate } from "react-router-dom";
import { LayoutProps } from "../../../shared/types";
import { AnimatedBox, AnimatedImage, Box } from "../atoms";
import { useState } from "react";

function SinglePage({ pages, activeIndex }: LayoutProps) {
  const router = useNavigate();
  // for zooming
  const [_crop, _setCrop] = useState({
    crop: 0,
    x: 0,
    y: 0,
  });

  // TODO react-use-gesture for pinch to zoom
  // and dragging and all the fun stuff

  if (!pages) {
    return;
  }

  return (
    <AnimatedBox
      transition={{
        duration: 0.5,
        bounce: 10,
        ease: "anticipate",
        damping: 2,
      }}
      css={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <AnimatedImage
        src={pages[activeIndex].content}
        alt={pages[activeIndex].name}
        css={{
          width: "40%",
          height: "100%",
          aspectRatio: 16 / 9,
          borderRight: "1px solid $gray",
          borderLeft: "0.3px solid $gray",
        }}
      />
    </AnimatedBox>
  );
}

export default SinglePage;
