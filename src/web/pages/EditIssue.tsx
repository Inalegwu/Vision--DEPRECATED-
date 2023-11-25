import { Layout } from "../components";
import { trpcReact } from "../../shared/config";
import { Box, Text } from "../components/atoms";
import { IssueParams } from "../../shared/types";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useState } from "react";

export default function EditIssue() {
  const router = useNavigate();
  const { issueId } = useParams<IssueParams>();

  if (!issueId) {
    return router("/");
  }

  const [newName, setNewName] = useState<string>("");

  const { data: issue, isLoading: fetchingIssue } =
    trpcReact.issue.getIssueData.useQuery({ id: issueId! });

  const { mutate: updateIssueName, isLoading: updatingIssue } =
    trpcReact.issue.changeIssueName.useMutation();

  const changeIssueName = useCallback(() => {
    updateIssueName({
      id: issueId,
      newName,
    });
  }, [issueId, newName]);

  return (
    <Layout>
      <Box css={{ width: "100%", height: "100%", display: "flex" }}>
        <Box
          css={{
            width: "70%",
            height: "100%",
            padding: "$lg",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Text css={{ fontSize: 30, fontWeight: "bold" }}>
            {issue?.data?.name}
          </Text>
          <Box
            css={{
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              gap: "$md",
            }}
          >
            <Text css={{ fontWeight: "lighter" }}>Name : </Text>
          </Box>
        </Box>
        <Box
          css={{
            width: "30%",
            height: "100%",
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        ></Box>
      </Box>
    </Layout>
  );
}
