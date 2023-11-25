import { Issue } from "../../shared/types";
import { useCallback } from "react";
import { AnimatedBox, Box, Image, Text } from "./atoms";
import { useNavigate } from "react-router-dom";

type Props = {
  issue: Issue;
};

export default function IssueCard(props: Props) {
  const router = useNavigate();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      router(`/${props.issue.id}`);
    },
    [props.issue]
  );

  return (
    <AnimatedBox
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      css={{
        display: "flex",
        flexDirection: "column",
        alignContent: "flex-start",
        alignItems: "flex-start",
        gap: "$md",
        color: "$lightGray",
        transition: "0.3s ease-in-out",
        "&:hover": {
          color: "$white",
          cursor: "pointer",
        },
      }}
      onClick={handleClick}
    >
      <Box
        css={{
          border: "0.1px solid rgba(255,255,255,0.3)",
          height: 260,
          width: 170,
          borderRadius: "$md",
          overflow: "hidden",
          color: "$white",
          transition: "0.5s ease-in-out",
          "&:hover": {
            border: "0.1px solid rgba(255,255,255,0.6)",
          },
        }}
      >
        <Image
          css={{ height: "100%", width: "100%" }}
          src={props.issue.thumbnailUrl}
          alt={props.issue.name}
        />
      </Box>
      <Box css={{ width: 170 }}>
        <Text>{props.issue.name}</Text>
      </Box>
    </AnimatedBox>
  );
}
