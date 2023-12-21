import { AnimatedBox, AnimatedImage, Box, Image } from "@components/atoms";
import { LayoutProps } from "@src/shared/types";
import { useState } from "react";

function SinglePage({ pages, activeIndex }: LayoutProps) {
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
      <Image src={pages[activeIndex].content} alt={pages[activeIndex].name} css={{width:"100%",height:"100%",position:"absolute",zIndex:0}}/>
     <Box css={{width:"100%",height:"100%",background:"transparent",backdropFilter:"blur(100px)",position:"absolute",zIndex:1,display:"flex",alignContent:"center",alignItems:"center",justifyContent:"center"}}>
       <AnimatedImage
        src={pages[activeIndex].content}
        alt={pages[activeIndex].name}
        css={{
          width: "44%",
          height: "100%",
          aspectRatio: 16/9,
          borderLeft:"0.1px solid $gray",
          borderRight:"0.1px solid $gray"
        }}
      />
     </Box>
    </AnimatedBox>
  );
}

export default SinglePage;
