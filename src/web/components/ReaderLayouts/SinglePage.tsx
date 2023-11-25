import { LayoutProps } from "../../../shared/types";
import { AnimatedBox, AnimatedImage } from "../atoms";

function SinglePage({ pages, activeIndex }: LayoutProps) {
  if (!pages) {
    return <></>;
  }

  return (
    <AnimatedBox
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
          <AnimatedImage
            src={v.content}
            key={v.id}
            alt={v.name}
            css={{ width: "50%", height: "100%", aspectRatio: 16 / 9 }}
          />
        );
      })}
    </AnimatedBox>
  );
}

export default SinglePage;
