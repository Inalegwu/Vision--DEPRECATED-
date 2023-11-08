import { motionValue } from "framer-motion";
import { AnimatedBox } from "./atoms";

export type SpinnerProps = {
  size?: number;
};

export default function Spinner({ size }: SpinnerProps) {
  return (
    <AnimatedBox
      animate={{
        rotate: [0, 180, 360],
      }}
      transition={{ repeat: Infinity, duration: 2 }}
      css={{
        width: size || 30,
        height: size || 30,
        border: "3px solid $primary",
        padding: "$lg",
        borderRadius: "$lg",
      }}
    />
  );
}

