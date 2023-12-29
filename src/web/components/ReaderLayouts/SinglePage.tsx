import { AnimatedBox, AnimatedImage, Box, Image } from "@components/atoms";
import { observer } from "@legendapp/state/react";
import { LayoutProps } from "@src/shared/types";
import { globalState$ } from "@src/web/state";
import { useState } from "react";

// TODO Implement a slider view instead of just a snap change view

const SinglePage = observer(({ pages, activeIndex }: LayoutProps) => {
  // for zooming
  const [_crop, _setCrop] = useState({
    crop: 0,
    x: 0,
    y: 0,
  });

  const ambientMode = globalState$.uiState.ambientBackground.get();

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
      {ambientMode && (
        <Image
          src={pages[activeIndex]?.content}
          alt={pages[activeIndex]?.name}
          css={{
            width: "100%",
            height: "100%",
            position: "absolute",
            zIndex: 0,
            opacity: 0.6,
          }}
        />
      )}
      <Box
        css={{
          width: "100%",
          height: "100%",
          background: "transparent",
          backdropFilter: "blur(100px)",
          position: "absolute",
          zIndex: 1,
          display: "flex",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatedImage
          src={pages[activeIndex]?.content}
          alt={pages[activeIndex]?.name}
          css={{
            height: "100%",
            aspectRatio: 1,
            borderLeft: "0.1px solid $gray",
            borderRight: "0.1px solid $gray",
          }}
        />
      </Box>
    </AnimatedBox>
  );
});

export default SinglePage;
