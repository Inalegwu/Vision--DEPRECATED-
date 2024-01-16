import { CaretLeftIcon, MinusIcon } from "@radix-ui/react-icons";
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

  const { data, isLoading: fetchingCollectionInfo } =
    trpcReact.collection.getCollectionById.useQuery({ id: collectionId });

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

  return (
    <Layout>
      <Flex direction="column" grow="1" className="w-full h-full">
        <Flex align="center" p="4" gap="3">
          <Button onClick={goBack} variant="soft">
            <CaretLeftIcon width={18} height={18} />
          </Button>
          <Text size="7">{data?.name}</Text>
        </Flex>
        <Flex p="4" direction="column">
          {data?.issues.map((v) => {
            return (
              <Flex
                align="center"
                gap="4"
                justify="between"
                key={v.id}
                className={`w-full p-2 ${removing && "opacity-[0.5]"}`}
              >
                <img
                  src={v.thumbnailUrl}
                  className="w-30 h-35 rounded-md"
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
                <Flex grow="1" align="start" p="3" justify="end">
                  <Button
                    onClick={() => removeIssueFromCollection(v.id)}
                    variant="soft"
                    color="cyan"
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
