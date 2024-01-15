import { AnimatedBox } from "@components/atoms";
import { observer } from "@legendapp/state/react";
import { AspectRatio, Flex } from "@radix-ui/themes";
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
        <img
          src={pages[activeIndex]?.content}
          alt={pages[activeIndex]?.name}
          className="w-full h-full absolute z-0 opacity-[0.6]"
        />
      )}
      <Flex
        align="center"
        justify="center"
        grow="1"
        className="w-full h-full bg-transparent backdrop-blur-2xl absolute z-1"
      >
        <AspectRatio
          ratio={16 / 9}
          className="w-full h-full flex items-center content-center justify-center"
        >
          <img
            src={pages[activeIndex]?.content}
            alt={pages[activeIndex]?.name}
            className="w-[55%] h-[100%] self-center rounded-md"
          />
        </AspectRatio>
      </Flex>
    </AnimatedBox>
  );
});

export default SinglePage;
