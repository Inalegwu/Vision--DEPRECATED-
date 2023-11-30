import { LayoutProps } from "../../../shared/types";
import { AnimatedImage, Box } from "../atoms";

// TODO implement the actual double page view

function DoublePage({ pages, activeIndex }: LayoutProps) {
  if (!pages) {
    return <></>;
  }

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
        src={pages[activeIndex].content}
        alt={pages[activeIndex].name}
        css={{
          width: "50%",
          height: "100%",
          margin: "auto",
          aspectRatio: 1,
        }}
      />
      <AnimatedImage
        src={pages[activeIndex + 1].content}
        alt={pages[activeIndex + 1].content}
        css={{
          width: "50%",
          height: "100%",
          margin: "auto",
          aspectRatio: 1,
        }}
      />
    </Box>
  );
}

export default DoublePage;
