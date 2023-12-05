import { AnimatedBox } from "./atoms";

type PulseProps = {
  size?: number;
};

export default function Pulse({ size }: PulseProps) {
  return (
    <AnimatedBox
      css={{
        border: "2px solid $primary",
        width: size ?? 20,
        height: size ?? 20,
        borderRadius: "$full",
        padding: "$lg",
        display: "flex",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
      initial={{ opacity: 0.4 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0.4 }}
      transition={{
        ease: "easeInOut",
        repeat: Infinity,
        duration: 2,
      }}
    >
      <AnimatedBox
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0.4 }}
        transition={{
          ease: "easeInOut",
          repeat: Infinity,
          duration: 1.9,
        }}
        css={{
          border: "2px solid $secondary",
          width: (size ?? 20) / 2,
          height: (size ?? 20) / 2,
          borderRadius: "$full",
        }}
      />
    </AnimatedBox>
  );
}
