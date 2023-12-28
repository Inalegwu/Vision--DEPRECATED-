import Skeleton from "./Skeleton";
import { AnimatedBox } from "./atoms";

export default function IssueSkeleton() {
  return (
    <Skeleton css={{ display: "flex", flexDirection: "column", gap: "$md" }}>
      <AnimatedBox
        css={{
          borderRadius: "$md",
          border: "0.1px solid rgba(255,255,255,0.2)",
          height: 260,
          width: 175,
          background: "$gray",
        }}
      />
      <AnimatedBox
      initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{
          ease: "easeInOut",
          bounce: true,
          duration:1,
          repeat: Infinity,
        }}
        css={{
          padding: "$md",
          borderRadius: "$sm",
          background: "$gray",
        }}
      />
      <AnimatedBox
        initial={{ width: "0%" }}
        animate={{ width: "70%" }}
        transition={{
          ease: "easeInOut",
          bounce: true,
          repeat: Infinity,
          duration:1
        }}
        css={{
          padding: "$md",
          borderRadius: "$sm",
          background: "$gray",
        }}
      />
    </Skeleton>
  );
}
