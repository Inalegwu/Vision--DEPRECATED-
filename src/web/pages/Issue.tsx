import { AnimatedBox, Box, Button, LinkButton, Text } from "@components/atoms";
import { DoublePage, SinglePage, Spinner, VStack } from "@components/index";
import { useObservable } from "@legendapp/state/react";
import {
  CaretLeft,
  CaretRight,
  CornersOut,
  Eye,
  EyeSlash,
  Lightbulb,
  LightbulbFilament,
  Square,
  SquareSplitHorizontal,
} from "@phosphor-icons/react";
import { trpcReact } from "@shared/config";
import { IssueParams, ReaderLayout } from "@shared/types";
import { LOADING_PHRASES, getRandomIndex } from "@shared/utils";
import { useDebounce, useKeyPress, useTimeout } from "@src/web/hooks";
import { globalState$, readingState } from "@src/web/state";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function Issue() {
  const router = useNavigate();
  const { issueId } = useParams<IssueParams>();

  if (!issueId) {
    router("/");
    return;
  }

  // application state
  const { uiState } = globalState$.get();
  const activeLayout = globalState$.uiState.readerLayout.get();
  const currentlyReading = readingState.currentlyReading
    .get()
    .find((v) => v.id === issueId);

  // internal state
  const activeIndex = useObservable<number>(currentlyReading?.page || 0);
  const mouseOver = useObservable<boolean>(false);
  const navigationShowing = useObservable<boolean>(false);

  const activeIndexValue = activeIndex.get();
  const navigationShowingValue = navigationShowing.get();

  const keyPress = useDebounce((e: KeyboardEvent) => {
    if (e.keyCode === 91 || e.keyCode === 104) {
      handleLeftClick();
    }
    // ] or H to scroll right
    else if (e.keyCode === 93 || e.keyCode === 108) {
      handleRightClick();
    }else {
      return;
    }
  }, 100);

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

  const { mutate: maximizeWindow, data: windowStat } =
    trpcReact.window.maximizeWindow.useMutation();

  window.addEventListener("mousemove", () => {
    if (!navigationShowing.get()) {
      navigationShowing.set(true);
    }
  });

  // go forward or backward a page
  useKeyPress(keyPress);

  useTimeout(() => {
    if (navigationShowing.get() && !mouseOver.get()) {
      navigationShowing.set(false);
    }
  }, 4000);

  const handleRightClick = useCallback(() => {
    if (activeIndex.get() === issue?.issue?.pages?.length! - 1) {
      return;
    }

    if(activeLayout==="DoublePage" && activeIndex.get() === issue?.issue?.pages?.length! - 2){
       return;
    }

    activeIndex.set(activeIndex.get() + 1);
  }, [activeIndex, issue]);

  const handleLeftClick = useCallback(() => {
    if (activeIndex.get() === 0) {
      return;
    }

    activeIndex.set(activeIndex.get() - 1);
  }, [activeIndex]);

  const toggleDistractionFreeMode = useCallback(() => {
    toast.success("You're now in distraction free mode", {
      position: "top-right",
    });
    globalState$.uiState.distractionFreeMode.set(true);
    if (windowStat?.fullscreen_status) return;

    maximizeWindow();
  }, [maximizeWindow, windowStat]);

  const toggleAmbientBackground = useCallback(() => {
    globalState$.uiState.ambientBackground.set(!uiState.ambientBackground);
  }, [uiState.ambientBackground]);

  const toggleReaderLayout = useCallback(
    (layout: ReaderLayout) => {
      globalState$.uiState.readerLayout.set(layout);
    },
    [],
  );

  const saveIssueReadingState = useCallback(() => {
    // update the currently reading list 
    const found=readingState.currentlyReading.get().find((v)=>v.id===issueId);
    if(found){
      readingState.currentlyReading.set([
        ...readingState.currentlyReading.get().filter((v)=>v.id===issueId),
        {id:issueId!,page:activeIndexValue}
      ])
      return 
    }
    readingState.currentlyReading.set([
      ...readingState.currentlyReading.get(),
      { id: issueId!, page: activeIndexValue },
    ]);
  }, [activeIndexValue, issueId]);

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
      {navigationShowing.get() && !uiState.distractionFreeMode && (
        <>
          <AnimatedBox
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: navigationShowingValue ? 1 : 0,
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
                onMouseOver={() => mouseOver.set(true)}
                onMouseLeave={() => mouseOver.set(false)}
                to="/"
                onClick={saveIssueReadingState}
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
                  cursor: "grabbing",
                }}
                id="drag-region"
              />
              {/* actions */}
              <Box
                css={{
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                  gap: "$md",
                }}
              >
                <Button
                  onMouseOver={() => mouseOver.set(true)}
                  onMouseLeave={() => mouseOver.set(false)}
                  css={{
                    color: "$primary",
                    padding: "$lg",
                    display: "flex",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "$md",
                    background: "$blackMuted",
                    "&:hover": {
                      background: "$primary",
                      color: "$white",
                    },
                  }}
                  onClick={toggleAmbientBackground}
                >
                  {uiState.ambientBackground ? (
                    <LightbulbFilament size={16} />
                  ) : (
                    <Lightbulb size={16} />
                  )}
                </Button>
                <Button
                  onMouseOver={() => mouseOver.set(true)}
                  onMouseLeave={() => mouseOver.set(false)}
                  css={{
                    color: "$primary",
                    padding: "$lg",
                    display: "flex",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "$md",
                    background: "$blackMuted",
                    "&:hover": {
                      background: "$primary",
                      color: "$white",
                    },
                  }}
                  title="Turn on Distraction Free Mode"
                  onClick={toggleDistractionFreeMode}
                >
                  {uiState.distractionFreeMode ? (
                    <EyeSlash size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </Button>
                <Button
                  css={{
                    color: "$primary",
                    padding: "$lg",
                    display: "flex",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "$md",
                    background: `${
                      activeLayout === "DoublePage" ? "$primary" : "$blackMuted"
                    }`,
                    "&:hover": {
                      background: "$primary",
                      color: "$white",
                    },
                  }}
                  title="Activate Double Page View"
                  onClick={() => toggleReaderLayout("DoublePage")}
                >
                  <SquareSplitHorizontal size={16} />
                </Button>
                <Button
                  css={{
                    color: "$primary",
                    padding: "$lg",
                    display: "flex",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "$md",
                    background: `${
                      activeLayout === "SinglePage" ? "$primary" : "$blackMuted"
                    }`,
                    "&:hover": {
                      background: "$primary",
                      color: "$white",
                    },
                  }}
                  title="Activate Single Page View"
                  onClick={() => toggleReaderLayout("SinglePage")}
                >
                  <Square />
                </Button>
                <Button
                  onMouseOver={() => mouseOver.set(true)}
                  onMouseLeave={() => mouseOver.set(false)}
                  onClick={() => maximizeWindow()}
                  css={{
                    color: "$primary",
                    padding: "$lg",
                    display: "flex",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "$md",
                    background: "$blackMuted",
                    "&:hover": {
                      background: "$primary",
                      color: "$white",
                    },
                  }}
                  title="Toggle Fullscreen"
                >
                  <CornersOut size={16} />
                </Button>
              </Box>
            </Box>
            {/* track view */}
            <VStack style={{ width: "100%" }} gap={6}>
              {!loadingIssue && (
                <Text css={{ fontSize: 15, color: "$gray" }}>
                  {activeIndexValue} / {issue?.issue.pages.length! - 1}
                </Text>
              )}
              <Box
                onMouseOver={() => mouseOver.set(true)}
                onMouseDown={() => mouseOver.set(false)}
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
                  disabled={activeIndexValue === 0}
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
                        (activeIndexValue / issue?.issue.pages.length!) * 100
                      }%`,
                    }}
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
                  onMouseOver={() => mouseOver.set(true)}
                  onMouseLeave={() => mouseOver.set(false)}
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
                  disabled={activeIndexValue === issue?.issue.pages.length! - 1}
                  onClick={handleRightClick}
                >
                  <CaretRight />
                </Button>
              </Box>
            </VStack>
          </AnimatedBox>
        </>
      )}
      {/* Panel View */}
      {uiState.distractionFreeMode && <Button title="Turn off Distraction free mode" onClick={()=>globalState$.uiState.distractionFreeMode.set(false)} css={{position:"absolute",top:"93%",left:"96.3%",zIndex:9999,borderRadius:"$full",padding:"$xxl",background:"$blackMuted",backdropFilter:"blur(400px)",color:"$primary",display:"flex",alignContent:"center",alignItems:"center",justifyContent:"center"}}>
        <EyeSlash size={16}/>
        </Button>}
      {activeLayout === "SinglePage" ? (
        <SinglePage pages={issue?.issue.pages} activeIndex={activeIndexValue} />
      ) : (
        <DoublePage pages={issue?.issue.pages} activeIndex={activeIndexValue} />
      )}
    </Box>
  );
}
