import {
  Box,
  LinkButton,
  Image,
  Text,
  AnimatedBox,
  Button,
} from "../components/atoms";
import { Spinner } from "../components";
import { useParams } from "react-router-dom";
import { IssueParams } from "../../shared/types";
import { trpcReact } from "../../shared/config";
import {
  CaretLeft,
  SquareSplitVertical,
  CornersOut,
  Square,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { layoutAtom } from "../state";

export default function Issue() {
  const [readerLayout, setReaderLayout] = useAtom(layoutAtom);
  const [navigationShowing, setNavigationShowing] = useState<boolean>(true);
  const { issueId } = useParams<IssueParams>();

  const { mutate: maximizeWindow } =
    trpcReact.window.maximizeWindow.useMutation();

  window.addEventListener("mousemove", () => {
    if (!navigationShowing) {
      setNavigationShowing(true);
    }
  });

  useEffect(() => {
    const navigationTimeout = setTimeout(() => {
      if (navigationShowing) {
        setNavigationShowing(false);
      }
    }, 7000);

    return () => {
      clearTimeout(navigationTimeout);
    };
  }, [navigationShowing, setNavigationShowing]);

  if (!issueId) return;

  const { data: issue, isLoading: loadingIssue } =
    trpcReact.issue.getIssue.useQuery({
      id: issueId!,
    });

  return (
    <Box
      css={{
        width: "100%",
        height: "100vh",
        background: "$background",
        color: "$white",
      }}
    >
      {loadingIssue && (
        <Box
          css={{
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            zIndex: 9999,
            width: "100%",
            height: "100%",
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
            <Spinner />
            <Text>Getting Panels Ready</Text>
          </Box>
        </Box>
      )}
      {/* navigation overlay */}
      {navigationShowing && (
        <AnimatedBox
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: navigationShowing ? 1 : 0,
          }}
          css={{
            width: "100%",
            height: "100vh",
            position: "absolute",
            zIndex: 99999,
            padding: "$xl",
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "space-between",
            background: "$blackMuted",
          }}
        >
          <Box
            css={{
              width: "100%",
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "$xxxl",
            }}
          >
            <LinkButton
              to="/"
              css={{
                padding: "$lg",
                background: "$secondary",
                color: "$white",
                borderRadius: "$md",
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CaretLeft size={20} />
            </LinkButton>
            <Text css={{ color: "$white", fontSize: 20 }}>
              {issue?.issue?.name}
            </Text>
            {/* keep the window draggable */}
            <Box
              css={{
                flex: 1,
                padding: "$md",
                height: 50,
              }}
              id="drag-region"
            />
            <Box
              css={{
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                background: "$blackMuted",
                backdropFilter: "blur(400px)",
                borderRadius: "$lg",
              }}
            >
              <Button
                onClick={() => setReaderLayout("SinglePage")}
                css={{
                  color: "$white",
                  padding: "$xxxl",
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRight: "0.1px solid rgba(255,255,255,0.1)",
                  borderTopLeftRadius: "$lg",
                  borderBottomLeftRadius: "$lg",
                  background: `${
                    readerLayout === "SinglePage" ? "$secondary" : ""
                  }`,
                  "&:hover": {
                    background: "$secondary",
                  },
                }}
              >
                {/* TODO  change to single page view icon */}
                <Square size={17} />
              </Button>
              <Button
                css={{
                  color: "$lightGray",
                  padding: "$xxxl",
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRight: "0.1px solid rgba(255,255,255,0.1)",
                  background: `${
                    readerLayout === "DoublePage" ? "$secondary" : ""
                  }`,
                  "&:hover": {
                    background: "$secondary",
                  },
                }}
                onClick={() => setReaderLayout("DoublePage")}
              >
                {/* TODO change to double page view icon */}

                <SquareSplitVertical size={17} />
              </Button>
              <Button
                onClick={() => maximizeWindow()}
                css={{
                  color: "$lightGray",
                  padding: "$xxxl",
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  borderTopRightRadius: "$lg",
                  borderBottomRightRadius: "$lg",
                  background: `${
                    readerLayout === "DoublePage" ? "$secondary" : ""
                  }`,
                  "&:hover": {
                    background: "$secondary",
                  },
                }}
              >
                <CornersOut size={16} />
              </Button>
            </Box>
          </Box>
          {/* thumbnail view */}
          <Box
            css={{
              width: "100%",
              padding: "$hg",
              height: 80,
              background: "$blackMuted",
              backdropFilter: "blur(400px)",
              borderRadius: "$xl",
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              overflowX: "scroll",
              overflowY: "hidden",
              gap: "$md",
            }}
          >
            {issue?.issue?.pages.map((v) => {
              return (
                <Image
                  key={v.id}
                  src={v.content}
                  alt={v.name}
                  css={{ width: 100, height: 40, borderRadius: "$md" }}
                />
              );
            })}
          </Box>
        </AnimatedBox>
      )}
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
        <Image
          src={issue?.issue?.pages[0].content}
          alt={issue?.issue?.pages[0].name}
          css={{ width: "50%", height: "100%", margin: "auto" }}
        />
      </Box>
    </Box>
  );
}
