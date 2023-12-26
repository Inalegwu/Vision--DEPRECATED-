import { observer } from "@legendapp/state/react";
import { globalState$ } from "@src/web/state";
import { LayoutProps } from "../../../shared/types";
import { AnimatedImage, Box } from "../atoms";

const DoublePage = observer(({ pages, activeIndex }: LayoutProps) => {
  const ambientMode = globalState$.uiState.ambientBackground.get();

  if (!pages) {
    return <></>;
  }

  return (
    <>
      {ambientMode && (
        <AnimatedImage
          src={pages[activeIndex]?.content}
          alt={pages[activeIndex].name}
          css={{
            width: "100%",
            height: "100%",
            position: "absolute",
            zIndex: 0,
          }}
        />
      )}
      <Box
        css={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          padding: "$xxxl",
          gap: "$lg",
          background: "transparent",
          backdropFilter: "blur(400px)",
        }}
      >
        <AnimatedImage
          src={pages[activeIndex]?.content}
          alt={pages[activeIndex]?.name}
          css={{
            width: "50%",
            height: "100%",
            margin: "auto",
            aspectRatio: 1,
            borderRadius: "$lg",
            border: "0.1px solid $lightGray",
          }}
        />
        <AnimatedImage
          src={pages[activeIndex + 1]?.content}
          alt={pages[activeIndex + 1]?.content}
          css={{
            width: "50%",
            height: "100%",
            margin: "auto",
            aspectRatio: 1,
            borderRadius: "$lg",
            border: "0.1px solid $lightGray",
          }}
        />
      </Box>
    </>
  );
});

export default DoublePage;
