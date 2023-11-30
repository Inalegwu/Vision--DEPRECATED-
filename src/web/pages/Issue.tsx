import toast from "react-hot-toast";
import { Spinner } from "../components";
import { trpcReact } from "@shared/config";
import { useParams } from "react-router-dom";
import { IssueParams } from "@shared/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { CaretLeft, CaretRight, CornersOut } from "@phosphor-icons/react";
import {
  Box,
  LinkButton,
  Text,
  AnimatedBox,
  Button,
} from "../components/atoms";
import { useAtom } from "jotai";
import { layoutAtom } from "@src/web/state";
import { DoublePage, SinglePage } from "@components/index";
import { useKeyPress } from "@src/web/hooks";

export default function Issue() {
  const { issueId } = useParams<IssueParams>();
  const scrubRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [mouseOver, setMouseOver] = useState<boolean>(false);
  const [navigationShowing, setNavigationShowing] = useState<boolean>(true);
  const [readerLayout] = useAtom(layoutAtom);

  const { data: issue, isLoading: loadingIssue } =
    trpcReact.issue.getIssue.useQuery({
      id: issueId!,
    });

  const { mutate: maximizeWindow } =
    trpcReact.window.maximizeWindow.useMutation();

  window.addEventListener("mousemove", () => {
    if (!navigationShowing) {
      setNavigationShowing(true);
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
      toast.success(`You've reached the end of ${issue?.issue?.name} 🎉`, {
        position: "top-right",
      });
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

  useKeyPress((e) => {
    console.log(e.key);
    if (e.key === "[" || e.key === "ArrowRight") {
      handleLeftClick();
    } else if (e.key === "]" || e.key === "ArrowRight") {
      handleRightClick();
    } else {
      return;
    }
  });

  if (!issueId) return;

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
              onMouseOver={() => setMouseOver(true)}
              onMouseLeave={() => setMouseOver(false)}
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
                onMouseOver={() => setMouseOver(true)}
                onMouseLeave={() => setMouseOver(false)}
                onClick={() => maximizeWindow()}
                css={{
                  color: "$lightGray",
                  padding: "$xxxl",
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "$md",
                  "&:hover": {
                    background: "$secondary",
                    color: "$white",
                  },
                }}
              >
                <CornersOut size={16} />
              </Button>
            </Box>
          </Box>
          {/* track view view */}
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
                padding: "$md",
                height: "100%",
                width: "5%",
                background: "$blackMuted",
                backdropFilter: "blur(400px)",
                borderTopLeftRadius: "$md",
                borderBottomLeftRadius: "$md",
              }}
              onClick={handleLeftClick}
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
                  width: `${(activeIndex / issue?.issue.pages.length!) * 100}%`,
                }}
                ref={scrubRef}
                css={{
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                  gap: "$md",
                  height: "80%",
                  padding: "$sm",
                  borderRadius: "$md",
                  overflowY: "scroll",
                  background: "$secondary",
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
                padding: "$md",
                background: "$blackMuted",
                backdropFilter: "blur(400px)",
                left: "95%",
                height: "100%",
                width: "5%",
                borderTopRightRadius: "$md",
                borderBottomRightRadius: "$md",
              }}
              onClick={handleRightClick}
            >
              <CaretRight />
            </Button>
          </Box>
        </AnimatedBox>
      )}
      {/* Panel View */}
      {readerLayout === "SinglePage" ? (
        <SinglePage pages={issue?.issue.pages!} activeIndex={activeIndex} />
      ) : (
        <DoublePage pages={issue?.issue.pages!} activeIndex={activeIndex} />
      )}
    </Box>
  );
}
