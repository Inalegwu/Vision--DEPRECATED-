import { db } from "../../storage";
import { InsertIssue } from "../../types";
import { issues } from "./issue.schema";

export async function getAllIssues() {
  const issues = await db.query.issues.findMany();

  return issues.map((v) => ({ id: v.id, name: v.name }));
}

export async function saveIssue(values: InsertIssue) {
  try {
    db.insert(issues).values(values);
  } catch (e) {
    throw e;
  }
}
export async function getIssueById(id: string) {
  const issue = await db.query.issues.findFirst({
    where: (issues, { eq }) => eq(issues.id, id),
    with: {
      pages: true,
    },
  });

  if (!issue) {
    return {
      status: false,
    };
  }

  return {
    status: true,
    issue,
  };
}

