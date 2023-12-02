import Skeleton from "./Skeleton";
import { Box } from "./atoms";

export default function IssueSkeleton() {
  return (
    <Skeleton css={{ display: "flex", flexDirection: "column", gap: "$md" }}>
      <Box
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
          width: "100%",
          borderRadius: "$sm",
          background: "$gray",
        }}
      />
      <Box
        css={{
          padding: "$md",
          width: "60%",
          borderRadius: "$sm",
          background: "$gray",
        }}
      />
    </Skeleton>
  );
}
