import { CaretLeftIcon, MinusIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { Badge, Button, Flex, Text } from "@radix-ui/themes";
import { trpcReact } from "@src/shared/config";
import moment from "moment";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../components";

export default function EditCollection() {
  const router = useNavigate();
  const utils = trpcReact.useUtils();
  const { collectionId } = useParams<{ collectionId: string }>();

  if (!collectionId) {
    router("/", {
      preventScrollReset: true,
    });
    return;
  }

  const goBack = useCallback(() => {
    // @ts-ignore go back a page
    router(-1, {
      preventScrollReset: true,
      unstable_viewTransition: true,
    });
  }, [router]);

  const { data } = trpcReact.collection.getCollectionById.useQuery({
    id: collectionId,
  });

  const { mutate, isLoading: removing } =
    trpcReact.collection.removeIssueFromCollection.useMutation({
      onSuccess: () => {
        utils.collection.getIssuesInCollection.invalidate();
        utils.collection.getCollectionById.invalidate();
        utils.library.getLibrary.invalidate();
      },
    });

  const removeIssueFromCollection = useCallback(
    (i: string) => {
      mutate({ id: i });
    },
    [mutate],
  );

  const editIssue = useCallback(
    (i: string) => {
      router(`/editIssue/${i}`, {
        preventScrollReset: true,
      });
    },
    [router],
  );

  return (
    <Layout>
      <Flex direction="column" grow="1" className="w-full h-full">
        <Flex align="center" p="4" gap="3">
          <Button onClick={goBack} variant="soft" className="w-9 h-9">
            <CaretLeftIcon width={20} height={20} />
          </Button>
          <Text size="7">{data?.name}</Text>
        </Flex>
        {/* <Flex align="start" p="4" gap="2" direction="column" justify="center">
          <Text>Change Name</Text>
          <TextField.Root className="w-full">
            <TextField.Input size="3" radius="small" placeholder="New Name" />
          </TextField.Root>
          <Button>Save</Button>
        </Flex> */}
        <Flex
          p="4"
          direction="column"
          gap="2"
          className="overflow-y-scroll h-[50%] p-2 pb-400"
        >
          {data?.issues.map((v) => {
            return (
              <Flex
                align="center"
                gap="4"
                justify="between"
                mb="2"
                key={v.id}
                className={`w-full p-2 ${removing && "opacity-[0.5]"}`}
              >
                <img
                  src={v.thumbnailUrl}
                  className="w-30 h-35 rounded-md border-solid border-[0.1px] border-slate-500"
                  alt={v.name}
                />
                <Flex direction="column" align="start" gap="1">
                  <Text size="7" weight="medium">
                    {v.name}
                  </Text>
                  <Badge variant="soft" color="mint" size="1">
                    Added {moment(v.dateCreated).fromNow()}
                  </Badge>
                </Flex>
                <Flex grow="1" align="start" p="3" gap="2" justify="end">
                  <Button variant="soft" onClick={() => editIssue(v.id)}>
                    Edit Issue
                    <Pencil1Icon />
                  </Button>
                  <Button
                    onClick={() => removeIssueFromCollection(v.id)}
                    variant="soft"
                    color="gray"
                  >
                    Remove Issue
                    <MinusIcon />
                  </Button>
                </Flex>
              </Flex>
            );
          })}
        </Flex>
      </Flex>
    </Layout>
  );
}
