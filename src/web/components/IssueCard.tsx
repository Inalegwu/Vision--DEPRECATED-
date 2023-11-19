import { Box, Image, LinkButton, Text } from "./atoms";
import { Issue } from "../../shared/types";
import { trpcReact } from "../../shared/config";
import toast from "react-hot-toast";

type Props = {
  issue: Issue;
};

export default function IssueCard(props: Props) {
  const utils = trpcReact.useUtils();
  const { mutate: deleteIssue, isLoading: deleting } =
    trpcReact.issue.deleteIssue.useMutation({
      onSuccess: () => {
        utils.library.invalidate();
        toast.success("Gone for now 😣");
      },
      onError: () => {
        toast.error("Couldn't Remove from Library 🫤");
      },
    });

  return (
    <Box
      onDoubleClick={() => deleteIssue({ id: props.issue.id })}
      css={{
        display: "flex",
        flexDirection: "column",
        alignContent: "flex-start",
        alignItems: "flex-start",
        gap: "$md",
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
            border: "0.1px solid rgba(255,255,255,0.6)",
          },
          opacity: `${deleting ? "0.5" : "1"}`,
        }}
      >
        <Image
          css={{ height: "100%", width: "100%" }}
          src={props.issue.thumbnailUrl}
          alt={props.issue.name}
        />
      </Box>
      <LinkButton
        to={`/${props.issue.id}`}
        css={{
          color: "$white",
          transition: "0.3s ease-in-out",
          "&:hover": {
            color: "$lightGray",
          },
        }}
      >
        <Text>{props.issue.name}</Text>
      </LinkButton>
    </Box>
  );
}
