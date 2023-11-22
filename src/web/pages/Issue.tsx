import {
  Box,
  LinkButton,
  Image,
  Text,
  AnimatedBox,
  AnimatedImage,
  Button,
} from "../components/atoms";
import { Spinner } from "../components";
import { useParams } from "react-router-dom";
import { IssueParams } from "../../shared/types";
import { trpcReact } from "../../shared/config";
import { CaretLeft, CaretRight, CornersOut } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { layoutAtom } from "../state";
import toast from "react-hot-toast";

export default function Issue() {
  const [readerLayout, setReaderLayout] = useAtom(layoutAtom);
  const { issueId } = useParams<IssueParams>();

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [mouseOver, setMouseOver] = useState<boolean>(false);
  const [navigationShowing, setNavigationShowing] = useState<boolean>(true);

  const { data: issue, isLoading: loadingIssue } =
    trpcReact.issue.getIssue.useQuery(
      {
        id: issueId!,
      },
      {
        onError: (e) => {
          toast.error(e.message);
        },
      }
    );

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
    console.log(activeIndex);
    if (activeIndex === issue?.issue.pages.length! - 1) {
      return;
      toast.success("That's all folks 😊");
    }
    setActiveIndex(activeIndex + 1);
  }, [activeIndex, setActiveIndex, issue]);

  const handleLeftClick = useCallback(() => {
    if (activeIndex === 0) {
      return;
    }
    setActiveIndex(activeIndex - 1);
  }, [activeIndex, setActiveIndex]);

  window.addEventListener("keydown", (e) => {
    if (e.key === "[" || e.key === "ArrowLeft") {
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
          {/* distance view */}
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
                  width: "",
                }}
                onPan={(_, i) => {
                  console.log(i);
                }}
                transition={{
                  duration: 0.3,
                  bounce: true,
                  ease: "easeOut",
                }}
                animate={{
                  width: `${(activeIndex / issue?.issue.pages.length!) * 100}%`,
                }}
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
        <AnimatedImage
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          initial={{
            opacity: 1,
          }}
          animate={{
            opacity: loadingIssue ? 0 : 1,
          }}
          src={issue?.issue.pages[activeIndex].content}
          alt={issue?.issue.pages[activeIndex].name}
          css={{
            width: "50%",
            height: "100%",
            margin: "auto",
            aspectRatio: 1,
          }}
        />
      </Box>
    </Box>
  );
}
