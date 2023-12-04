import { Issue } from "@shared/types";
import { AnimatedBox, Box, Image, LinkButton, Text } from "./atoms";

type Props = {
  issue: Issue;
};

export default function IssueCard(props: Props) {
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
        color: "$white",
        transition: "0.3s ease-in-out",
        "&:hover": {
          cursor: "pointer",
        },
      }}
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
            border: "0.1px solid $secondary",
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
        <LinkButton to={`/${props.issue.id}`}>
          <Text css={{ fontSize: 13, color: "$white" }}>
            {props.issue.name}
          </Text>
        </LinkButton>
      </Box>
    </AnimatedBox>
  );
}
