import { trpcReact } from "../../shared/config";
import { Layout } from "../components";
import { Plus } from "@phosphor-icons/react";
import { useAtom } from "jotai";
import { filterState } from "../state";
import { Filter } from "../../shared/types";

const FILTERS = ["All", "Issues", "Collections"];

export default function Library() {
  const { mutate: addToLib, data } =
    trpcReact.library.addToLibrary.useMutation();

  const [filter, setFilter] = useAtom(filterState);

  const { data: libraryData, isLoading: fetchingLibraryContent } =
    trpcReact.library.getLibrary.useQuery({ filter: "All" });

  return <Layout>Library</Layout>;
}

