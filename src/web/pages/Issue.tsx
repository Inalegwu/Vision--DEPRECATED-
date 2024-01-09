import { AnimatedBox, Box, Button, Text } from "@components/atoms";
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
import {
  useDebounce,
  useKeyPress,
  useTimeout,
  useWindow,
} from "@src/web/hooks";
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

  // if the user has a currently reading state saved, it will
  // be used to render a progress bar for the users reading progress
  // this will also enable somethings in the future as well.
  const currentlyReading = readingState.currentlyReading
    .get()
    .find((v) => v.id === issueId);

  // internal state
  const activeIndex = useObservable<number>(currentlyReading?.page || 0);
  const mouseOver = useObservable<boolean>(false);
  const navigationShowing = useObservable<boolean>(false);

  // use these values where it would cause Rules of Hooks errors
  // i.e conditionals and the rest
  const activeIndexValue = activeIndex.get();
  const navigationShowingValue = navigationShowing.get();

  // debounce the users page navigation keypress
  // to prevent trigerring events multiple times
  const keyPress = useDebounce((e: KeyboardEvent) => {
    if (e.keyCode === 91 || e.keyCode === 104) {
      handleLeftClick();
    }
    // ] or H to scroll right
    else if (e.keyCode === 93 || e.keyCode === 108) {
      handleRightClick();
    } else {
      return;
    }
  }, 100);

  // get the issue data
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

  // maximizes the window for either distraction free mode or just activating
  // fullscreen mode
  const { mutate: maximizeWindow, data: windowStat } =
    trpcReact.window.maximizeWindow.useMutation();

  // show the navigation overlay on mouse move
  useWindow("mousemove", () => {
    if (!navigationShowing.get()) {
      navigationShowing.set(true);
    }
  });

  // Trigger the panel change
  // when the appropriate navigation keys
  // are pressed
  useKeyPress(keyPress);

  // hide the navigation view 4 seconds after showing
  // if the mouse isn't overlapping any action element
  useTimeout(() => {
    if (navigationShowing.get() && !mouseOver.get()) {
      navigationShowing.set(false);
    }
  }, 4000);

  // takes the user to the next
  // panel
  const handleRightClick = useCallback(() => {
    // on default layout
    if (activeIndex.get() === issue?.issue?.pages?.length!) {
      return;
    }

    // the users active layout style is double layout
    // stop the user from moving forward when the next page
    // is the issues page length + 2
    if (
      activeLayout === "DoublePage" &&
      activeIndex.get() === issue?.issue?.pages?.length! - 2
    ) {
      return;
    }

    // if none of the cases above , increment page count
    activeIndex.set(activeIndex.get() + 1);
  }, [activeIndex, issue, activeLayout]);

  // Takes the user back to the previous panel
  const handleLeftClick = useCallback(() => {
    // if we are currently on the first page , do absolutely nothing
    // I'll probably make this a wrap around
    if (activeIndex.get() === 0) {
      return;
    }

    activeIndex.set(activeIndex.get() - 1);
  }, [activeIndex]);

  // turn on distraction free mode
  // this hides the navigation ui and stops listening for
  // mouse moves, no distractions
  // this also takes the app into fullscreen mode for full immersion
  const toggleDistractionFreeMode = useCallback(() => {
    toast.success("You're now in distraction free mode", {
      position: "top-right",
    });
    globalState$.uiState.distractionFreeMode.set(true);
    if (windowStat?.fullscreen_status) return;

    maximizeWindow();
  }, [maximizeWindow, windowStat]);

  // turns on or off ambient background for the users reader view
  // ambient mode basically uses the colors from the image as a background effect
  // when active.
  // When inactive , the user has a plain black background
  const toggleAmbientBackground = useCallback(() => {
    globalState$.uiState.ambientBackground.set(!uiState.ambientBackground);
  }, [uiState.ambientBackground]);

  // change the users reader layout
  const toggleReaderLayout = useCallback((layout: ReaderLayout) => {
    globalState$.uiState.readerLayout.set(layout);
  }, []);

  // save the users reading state
  // this allows the user to jump back into a specific spot
  // when they leave the issue
  // also useful for showing reading progress in other parts of the app
  const saveIssueReadingState = useCallback(() => {
    // update the currently reading list
    // @ts-ignore goes back a page
    router(-1, {
      preventScrollReset: true,
      unstable_viewTransition: true,
    });
    // check if the issue is already
    // saved in the reading state list
    const found = readingState.currentlyReading
      .get()
      .find((v) => v.id === issueId);

    // if the issue is already saved
    if (found) {
      // this is currently very mess
      // I have to find a way to make
      // cleaner and easier to follow
      readingState.currentlyReading.set([
        // keep all other issues
        ...readingState.currentlyReading.get().filter((v) => v.id !== issueId),
        // upsert the current issue
        {
          id: issueId,
          page: activeIndexValue,
          total: issue?.issue.pages.length || 0,
        },
      ]);
      return;
    }
    // if the issues doesn't already exist
    readingState.currentlyReading.set([
      // the previous issues already saved
      ...readingState.currentlyReading.get(),
      // the new issue being added
      {
        id: issueId,
        page: activeIndexValue,
        total: issue?.issue.pages.length!,
      },
    ]);
  }, []);

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
              <Button
                onMouseOver={() => mouseOver.set(true)}
                onMouseLeave={() => mouseOver.set(false)}
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
              </Button>
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
                  {activeIndexValue} / {issue?.issue.pages.length!}
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
      {uiState.distractionFreeMode && (
        <Button
          title="Turn off Distraction free mode"
          onClick={() => globalState$.uiState.distractionFreeMode.set(false)}
          css={{
            position: "absolute",
            top: "93%",
            left: "96.3%",
            zIndex: 9999,
            borderRadius: "$full",
            padding: "$xxl",
            background: "$blackMuted",
            backdropFilter: "blur(400px)",
            color: "$primary",
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <EyeSlash size={16} />
        </Button>
      )}
      {activeLayout === "SinglePage" ? (
        <SinglePage pages={issue?.issue.pages} activeIndex={activeIndexValue} />
      ) : (
        <DoublePage pages={issue?.issue.pages} activeIndex={activeIndexValue} />
      )}
    </Box>
  );
}
