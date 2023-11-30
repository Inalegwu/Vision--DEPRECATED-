import { ThemeCSS } from "@src/shared/types";
import { AnimatedBox } from "./atoms";

export type SkeletonProps = {
  css: ThemeCSS;
  children?: React.ReactNode;
};

export default function Skeleton({ css, children }: SkeletonProps) {
  return (
    <AnimatedBox
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: -1, duration: 1500, ease: "easeInOut" }}
      css={css}
    >
      {children}
    </AnimatedBox>
  );
}
