import { useParams } from "react-router-dom";
import { IssueParams } from "../../shared/types";
import { Layout } from "../components";
import { Text } from "../components/atoms";

export default function EditIssue() {
  const { issueId } = useParams<IssueParams>();

  return (
    <Layout>
      <Text>{issueId}</Text>
    </Layout>
  );
}
