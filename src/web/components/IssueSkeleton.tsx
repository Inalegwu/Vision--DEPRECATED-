import Skeleton from "./Skeleton";
import { AnimatedBox } from "./atoms";

export default function IssueSkeleton() {
  return (
    <Skeleton css={{ display: "flex", flexDirection: "column", gap: "$md" }}>
      <AnimatedBox
        css={{
          borderRadius: "$md",
          height: 260,
          width: 175,
          background: "$gray",
        }}
      />
    </Skeleton>
  );
}
