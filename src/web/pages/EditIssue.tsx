import { useParams } from "react-router-dom";
import { IssueParams } from "../../shared/types";
import { Layout } from "../components";
import { Box, LinkButton, Text } from "../components/atoms";
import { CaretLeft } from "@phosphor-icons/react";
import { trpcReact } from "../../shared/config";

export default function EditIssue() {
  const { issueId } = useParams<IssueParams>();

  const { data: issue, isLoading: fetchingIssue } =
    trpcReact.issue.getIssue.useQuery({ id: issueId! });

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
            {issue?.issue?.name}
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
