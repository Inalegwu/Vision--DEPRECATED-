import { Box } from "@kuma-ui/core";
import { useParams } from "react-router-dom";
import { IssueParams } from "../../shared/types";

export default function Issue() {
  const { issueId } = useParams<IssueParams>();

  console.log(issueId);

  return <Box>content</Box>;
}

