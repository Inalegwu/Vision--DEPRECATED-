import { observer } from "@legendapp/state/react";
import { AspectRatio, Box } from "@radix-ui/themes";
import { globalState$ } from "@src/web/state";
import { LayoutProps } from "../../../shared/types";
import { AnimatedImage } from "../atoms";

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
      <Box className="w-full h-screen flex items-center justify-center gap-4 bg-transparent backdrop-blur-2xl p-15">
        <AspectRatio ratio={16 / 9}>
          <img
            src={pages[activeIndex]?.content}
            alt={pages[activeIndex]?.name}
            className="w-full h-full m-auto rounded-md border-solid border-gray-300"
          />
        </AspectRatio>
        {pages[activeIndex + 1].content !== "" && (
          <AspectRatio ratio={16 / 9}>
            <img
              src={pages[activeIndex + 1]?.content}
              alt={pages[activeIndex + 1]?.content}
              className="w-full h-full rounded-md border-solid border-gray-300"
            />
          </AspectRatio>
        )}
      </Box>
    </>
  );
});

export default DoublePage;
