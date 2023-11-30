import toast from "react-hot-toast";
import { useEffect } from "react";
import { trackEvent } from "@aptabase/electron/renderer";
import { trpcReact } from "@shared/config";
import { Plus } from "@phosphor-icons/react";
import { Reasons } from "@shared/types";
import { Layout, VStack, HStack, Spinner, IssueCard } from "@components/index";
import { AnimatedBox, Box, Button, Text } from "@components/atoms";
import { useAtom } from "jotai";
import { applicationState } from "@src/web/state";
import { generateUUID } from "@src/shared/utils";
import { useNavigate } from "react-router-dom";

trackEvent("Library Loaded");

export default function Library() {
  const [_, setAppState] = useAtom(applicationState);
  const router = useNavigate();
  const utils = trpcReact.useUtils();
  const { mutate: addToLibrary, isLoading: addingToLibrary } =
    trpcReact.library.addToLibrary.useMutation({
      onSuccess: (data) => {
        if (data?.status === false && data.reason === Reasons.CANCELLED) {
          return;
        }
        toast.success("Added To Library", {
          duration: 6000,
        });
        utils.library.getLibrary.invalidate();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });

  useEffect(() => {
    // check first launch state of the app and pass an application id
    setAppState((v) => {
      if (v.firstLaunch) {
        // show the user a first launch screen if they are a first time user
        router("/first_launch");
        // the make sure they are never a first time user again
        // and give the app an application_id
        return {
          applicationId: generateUUID(),
          firstLaunch: false,
        };
      } else {
        return v;
      }
    });
  }, [setAppState]);

  const { data: libraryData, isLoading: fetchingLibraryContent } =
    trpcReact.library.getLibrary.useQuery();
  if (fetchingLibraryContent) {
    return (
      <Layout>
        <Box
          css={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            css={{
              display: "flex",
              flexDirection: "column",
              gap: "$xxxl",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spinner size={30} />
            <Text css={{ color: "$lightGray" }}>
              Getting things in order...
            </Text>
          </Box>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box css={{ width: "100%", height: "100%" }}>
        {/* loading overlay */}
        <AnimatedBox
          initial={{ opacity: 0, display: "none" }}
          animate={{
            opacity: addingToLibrary ? 1 : 0,
            display: addingToLibrary ? "flex" : "none",
          }}
          css={{
            position: "absolute",
            zIndex: 99999,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "center",
            background: "$blackMuted",
            backdropFilter: "blur(20px)",
          }}
        >
          <Box
            css={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              gap: "$xxxl",
              color: "$lightGray",
            }}
          >
            <Spinner />
            <Text>Sit back , This might take a while 😉 ...</Text>
          </Box>
        </AnimatedBox>
        {/* header */}
        <VStack gap={6} style={{ padding: "$lg" }}>
          <Text css={{ fontSize: 35, fontWeight: "bold" }}>My Library</Text>
          <HStack
            width="100%"
            justifyContent="space-between"
            alignContent="center"
            alignItems="center"
          >
            <HStack
              justifyContent="flex-start"
              alignContent="center"
              alignItems="center"
              gap={6}
            ></HStack>
            <Button
              css={{
                color: "$white",
                background: "$gray",
                padding: "$lg",
                borderRadius: "$full",
                "&:hover": {
                  background: "$secondary",
                },
              }}
              onClick={() => addToLibrary()}
            >
              <HStack gap={5} alignContent="center" alignItems="center">
                <Text>Add To Library</Text>
                <Plus size={10} />
              </HStack>
            </Button>
          </HStack>
        </VStack>
        {/* body */}
        <Box
          css={{
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            overflowY: "scroll",
            gap: "$xxxl",
            padding: "$lg",
            width: "100%",
          }}
        >
          {libraryData?.issues.map((v) => {
            return <IssueCard issue={v} key={v.id} />;
          })}
        </Box>
      </Box>
    </Layout>
  );
}
