import { AnimatedBox, Box, Button, LinkButton, Text } from "@components/atoms";
import { DoublePage, SinglePage, Spinner, VStack } from "@components/index";
import { CaretLeft, CaretRight, CornersOut } from "@phosphor-icons/react";
import { trpcReact } from "@shared/config";
import { IssueParams } from "@shared/types";
import { LOADING_PHRASES, getRandomIndex } from "@shared/utils";
import { useKeyPress, useWindow } from "@src/web/hooks";
import { readerLayout } from "@src/web/state";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function Issue() {
  const router = useNavigate();
  const { issueId } = useParams<IssueParams>();
  const scrubRef = useRef<HTMLDivElement>(null);

  if (!issueId) {
    router("/");
    return;
  }

  // internal state
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [mouseOver, setMouseOver] = useState<boolean>(false);
  const [navigationShowing, setNavigationShowing] = useState<boolean>(true);

  const activeLayout = readerLayout.get();

  const { data: issue, isLoading: loadingIssue } =
    trpcReact.issue.getIssue.useQuery(
      {
        id: issueId,
      },
      {
        onError: (err) => {
          toast.error(err.message);
        },
      },
    );

  const { mutate: maximizeWindow } =
    trpcReact.window.maximizeWindow.useMutation();

  // show or hide the overlay navigation when the mouse moves
  useWindow("mousemove", () => {
    if (!navigationShowing) {
      setNavigationShowing(true);
    }
  });

  // go forward or backward a page
  useKeyPress((e) => {
    if (e.key === "[" || e.key === "ArrowRight") {
      handleLeftClick();
    } else if (e.key === "]" || e.key === "ArrowRight") {
      handleRightClick();
    } else {
      return;
    }
  });

  useEffect(() => {
    const navigationTimeout = setTimeout(() => {
      if (navigationShowing && !mouseOver) {
        setNavigationShowing(false);
      }
    }, 4000);

    return () => {
      clearTimeout(navigationTimeout);
    };
  }, [navigationShowing, setNavigationShowing, mouseOver]);

  const handleRightClick = useCallback(() => {
    if (activeIndex === issue?.issue.pages.length! - 1) {
      return;
    }
    setActiveIndex(activeIndex + 1);
  }, [activeIndex, setActiveIndex, issue]);

  const handleLeftClick = useCallback(() => {
    if (activeIndex === 0) {
      return;
    }
    setActiveIndex(activeIndex - 1);
  }, [activeIndex, setActiveIndex]);

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
            <Spinner size={20} />
            <Text css={{ fontSize: 15 }}>
              {LOADING_PHRASES[getRandomIndex(0, LOADING_PHRASES.length - 1)]}
            </Text>
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
              onMouseOver={() => setMouseOver(true)}
              onMouseLeave={() => setMouseOver(false)}
              to="/"
              css={{
                padding: "$lg",
                background: "$primary",
                color: "$white",
                borderRadius: "$md",
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CaretLeft size={16} />
            </LinkButton>
            <Text css={{ color: "$white", fontSize: 15 }}>
              {issue?.issue?.name}
            </Text>
            {/* keep the window draggable */}
            <Box
              css={{
                flex: 1,
                padding: "$md",
                height: 50,
                cursor:"grabbing"
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
                borderRadius: "$md",
              }}
            >
              <Button
                onMouseOver={() => setMouseOver(true)}
                onMouseLeave={() => setMouseOver(false)}
                onClick={() => maximizeWindow()}
                css={{
                  color: "$primary",
                  padding: "$lg",
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "$md",
                  "&:hover": {
                    background: "$primary",
                    color: "$white",
                  },
                }}
              >
                <CornersOut size={16} />
              </Button>
            </Box>
          </Box>
          {/* track view */}
          <VStack style={{ width: "100%" }} gap={6}>
            {!loadingIssue && (
              <Text css={{ fontSize: 15, color: "$gray" }}>
                {activeIndex} / {issue?.issue.pages.length! - 1}
              </Text>
            )}
            <Box
              onMouseOver={() => setMouseOver(true)}
              onMouseDown={() => setMouseOver(false)}
              css={{
                background: "$blackMuted",
                backdropFilter: "blur(50px)",
                borderRadius: "$md",
                width: "100%",
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                lineHeight: 80,
                overflowY: "hidden",
              }}
            >
              <Button
                css={{
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "$white",
                  padding: "$sm",
                  height: "100%",
                  width: "5%",
                  background: "$blackMuted",
                  backdropFilter: "blur(400px)",
                  borderTopLeftRadius: "$md",
                  borderBottomLeftRadius: "$md",
                }}
                onClick={handleLeftClick}
                disabled={activeIndex === 0}
              >
                <CaretLeft />
              </Button>
              <Box
                css={{
                  width: "90%",
                  height: "100%",
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <AnimatedBox
                  initial={{
                    width: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    bounce: true,
                    ease: "easeOut",
                  }}
                  animate={{
                    width: `${
                      (activeIndex / issue?.issue.pages.length!) * 100
                    }%`,
                  }}
                  ref={scrubRef}
                  css={{
                    display: "flex",
                    alignContent: "center",
                    alignItems: "center",
                    gap: "$md",
                    height: "80%",
                    padding: "$sm",
                    borderTopRightRadius: "$md",
                    borderBottomRightRadius: "$md",
                    overflowY: "scroll",
                    background: "$primary",
                  }}
                />
              </Box>
              <Button
                onMouseOver={() => setMouseOver(true)}
                onMouseLeave={() => setMouseOver(false)}
                css={{
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "$white",
                  padding: "$sm",
                  background: "$blackMuted",
                  backdropFilter: "blur(400px)",
                  left: "95%",
                  height: "100%",
                  width: "5%",
                  borderTopRightRadius: "$md",
                  borderBottomRightRadius: "$md",
                }}
                disabled={activeIndex === issue?.issue.pages.length! - 1}
                onClick={handleRightClick}
              >
                <CaretRight />
              </Button>
            </Box>
          </VStack>
        </AnimatedBox>
      )}
      {/* Panel View */}
      {activeLayout.layout === "SinglePage" ? (
        <SinglePage pages={issue?.issue.pages} activeIndex={activeIndex} />
      ) : (
        <DoublePage pages={issue?.issue.pages} activeIndex={activeIndex} />
      )}
    </Box>
  );
}
