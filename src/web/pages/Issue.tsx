import { Box } from "../components/atoms";
import { useParams } from "react-router-dom";
import { IssueParams } from "../../shared/types";
import { trpcReact } from "../../shared/config";

export default function Issue() {
  const { issueId } = useParams<IssueParams>();

  if (!issueId) return;

  const { data: issue, isLoading: loadingIssue } =
    trpcReact.issue.getIssueById.useQuery({
      id: issueId,
    });

  return <Box>content</Box>;
}

