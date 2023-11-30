import { AnimatedBox, Box, Image, Text } from "@components/atoms";
import { Collection, Issue } from "@src/shared/types";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

type CollectionCardProps = {
  collection: Collection & { issues: Issue[] };
};

export default function CollectionCard({ collection }: CollectionCardProps) {
  const router = useNavigate();

  const handleClick = useCallback(() => {
    router(`/collections/${collection.id}`);
  }, []);

  return (
    <AnimatedBox
      onClick={handleClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      css={{
        cursor: "pointer",
        color: "$gray",
        transition: "0.5s ease-in-out",
        "&:hover": {
          color: "$white",
        },
      }}
    >
      {collection.issues[0] ? (
        <>
          <Image
            src={collection.issues[0].thumbnailUrl}
            css={{
              width: 170,
              height: 260,
              border: "0.1px solid rgba(255,255,255,0.3)",
              transition: "0.5s ease-in-out",
              //   transform: "rotate(-1deg)",
              borderRadius: "$md",
              "&:hover": {
                border: "0.1px solid rgba(255,255,255,0.6)",
              },
            }}
          />
        </>
      ) : (
        <>
          <Box
            css={{
              width: 170,
              height: 260,
              border: "0.1px solid rgba(255,255,255,0.3)",
              transition: "0.5s ease-in-out",
              //   transform: "rotate(-1deg)",
              borderRadius: "$md",
              "&:hover": {
                border: "0.1px solid rgba(255,255,255,0.6)",
              },
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text css={{ fontWeight: "bold", fontSize: 23 }}>
              {collection.name.slice(0, 2).toUpperCase()}
            </Text>
          </Box>
        </>
      )}
      <Text>{collection.name}</Text>
    </AnimatedBox>
  );
}
