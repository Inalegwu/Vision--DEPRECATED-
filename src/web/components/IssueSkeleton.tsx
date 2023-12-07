import Skeleton from "./Skeleton";
import { AnimatedBox, Box } from "./atoms";

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
      <Box
        css={{
          padding: "$md",
          borderRadius: "$sm",
          background: "$gray",
        }}
      />
      <Box
        css={{
          width: "70%",
          padding: "$md",
          borderRadius: "$sm",
          background: "$gray",
        }}
      />
    </Skeleton>
  );
}
