import { useParams } from "react-router-dom";
import { Layout } from "../components";
import { CollectionParams } from "../../shared/types";

export default function Collection() {
  const { collectionId } = useParams<CollectionParams>();

  console.log(collectionId);

  return <Layout>content</Layout>;
}

