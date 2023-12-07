import { ThemeCSS } from "@src/shared/types";
import { AnimatedBox } from "./atoms";

export type SkeletonProps = {
  css?: ThemeCSS;
  children?: React.ReactNode;
};

export default function Skeleton({ css, children }: SkeletonProps) {
  return (
    <AnimatedBox
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 0.6 }}
      exit={{ opacity: 0.3 }}
      transition={{ repeat: Infinity, duration: 0.9, ease: "easeOut" }}
      css={{ ...css }}
    >
      {children}
    </AnimatedBox>
  );
}
