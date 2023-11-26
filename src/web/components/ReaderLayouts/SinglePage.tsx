import { LayoutProps } from "../../../shared/types";
import { AnimatedBox, AnimatedImage, Box } from "../atoms";

function SinglePage({ pages, activeIndex }: LayoutProps) {
  if (!pages) {
    return <></>;
  }

  return (
    <AnimatedBox
      transition={{
        duration: 0.5,
        bounce: 10,
        ease: "anticipate",
        damping: 2,
      }}
      animate={{ left: `${activeIndex}*100%` }}
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
      {pages.map((v) => {
        return (
          <Box
            css={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AnimatedImage
              src={v.content}
              key={v.id}
              alt={v.name}
              css={{ width: "50%", height: "100%", aspectRatio: 16 / 9 }}
            />
          </Box>
        );
      })}
    </AnimatedBox>
  );
}

export default SinglePage;
