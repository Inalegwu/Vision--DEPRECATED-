import { AnimatedBox, Box, Text } from "@components/atoms";
import { DoublePage, SinglePage, Spinner } from "@components/index";
import { useObservable } from "@legendapp/state/react";
import {
  CaretLeft,
  CornersOut,
  Eye,
  EyeSlash,
  Lightbulb,
  LightbulbFilament,
  Square,
  SquareSplitHorizontal,
} from "@phosphor-icons/react";
import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";
import { Button, Flex } from "@radix-ui/themes";
import { trpcReact } from "@shared/config";
import { IssueParams } from "@shared/types";
import { LOADING_PHRASES, getRandomIndex } from "@shared/utils";
import {
  useDebounce,
  useKeyPress,
  useTimeout,
  useWindow,
} from "@src/web/hooks";
import { globalState$, readingState } from "@src/web/state";
import { AnimatePresence } from "framer-motion";
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

  const { uiState } = globalState$.get();
  const activeLayout = globalState$.uiState.readerLayout.get();

  const currentlyReading = readingState.currentlyReading
    .get()
    .find((v) => v.id === issueId);

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
    } else {
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

  useWindow("mousemove", () => {
    if (!navigationShowing.get()) {
      navigationShowing.set(true);
    }
  });

  useKeyPress(keyPress);

  useTimeout(() => {
    if (navigationShowing.get() && !mouseOver.get()) {
      navigationShowing.set(false);
    }
  }, 3000);

  const handleRightClick = useCallback(() => {
    if (activeIndex.get() === issue?.issue?.pages?.length!) {
      return;
    }

    if (
      activeLayout === "DoublePage" &&
      activeIndex.get() === issue?.issue?.pages?.length! - 2
    ) {
      return;
    }

    activeIndex.set(activeIndex.get() + 1);
  }, [activeIndex, issue, activeLayout]);

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

  const toggleReaderLayout = useCallback(() => {
    if (globalState$.uiState.readerLayout.get() === "SinglePage") {
      globalState$.uiState.readerLayout.set("DoublePage");
    } else {
      globalState$.uiState.readerLayout.set("SinglePage");
    }
  }, []);

  const saveIssueReadingState = useCallback(() => {
    // @ts-ignore goes back a page
    router(-1, {
      preventScrollReset: true,
      unstable_viewTransition: true,
    });

    const found = readingState.currentlyReading
      .get()
      .find((v) => v.id === issueId);

    if (found) {
      readingState.currentlyReading.set([
        ...readingState.currentlyReading.get().filter((v) => v.id !== issueId),
        {
          id: issueId,
          page: activeIndexValue,
          total: issue?.issue.pages.length || 0,
        },
      ]);
    }
    readingState.currentlyReading.set([
      ...readingState.currentlyReading.get(),
      {
        id: issueId,
        page: activeIndexValue,
        total: issue?.issue.pages.length!,
      },
    ]);
  }, [activeIndexValue, issue, router]);

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
      <AnimatePresence>
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
              exit={{ opacity: 0 }}
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
                  variant="soft"
                  size="3"
                  className="p-2.5"
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
                    variant={uiState.ambientBackground ? "solid" : "soft"}
                    color={uiState.ambientBackground ? "iris" : "gray"}
                    size="3"
                    className="flex w-10 h-10 items-center justify-center"
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
                    size="3"
                    variant="soft"
                    color="gray"
                    className="flex w-10 h-10 items-center content-center"
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
                    color="gray"
                    variant="soft"
                    size="3"
                    className="flex w-10 h-10 items-center justify-center"
                    title="Activate Double Page View"
                    onClick={toggleReaderLayout}
                  >
                    {uiState.readerLayout === "DoublePage" ? (
                      <Square />
                    ) : (
                      <SquareSplitHorizontal />
                    )}
                  </Button>
                  <Button
                    onMouseOver={() => mouseOver.set(true)}
                    onMouseLeave={() => mouseOver.set(false)}
                    onClick={() => maximizeWindow()}
                    size="3"
                    variant="soft"
                    color="gray"
                    className="flex w-10 h-10 items-center justify-center"
                    title="Toggle Fullscreen"
                  >
                    <CornersOut size={16} />
                  </Button>
                </Box>
              </Box>
              {/* thumbnail view */}
              <Flex
                className="w-full p-2 rounded-md"
                direction="column"
                align="start"
                gap="3"
              >
                {!loadingIssue && (
                  <Text css={{ fontSize: 15, color: "$gray" }}>
                    {activeIndexValue} / {issue?.issue.pages.length!}
                  </Text>
                )}
                <Box className="w-full flex space-x-4 items-center content-center">
                  <Button
                    onClick={handleLeftClick}
                    variant="ghost"
                    radius="full"
                    color="gray"
                    className="p-1"
                  >
                    <CaretLeftIcon />
                  </Button>
                  <Box className="bg-white/10 backdrop-blur-2xl w-full rounded-full">
                    <AnimatedBox
                      className="p-1 bg-purple-500 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{
                        width: `${
                          (activeIndexValue / issue?.issue.pages.length!) * 100
                        }%`,
                      }}
                    />
                  </Box>
                  <Button
                    onClick={handleRightClick}
                    variant="ghost"
                    radius="full"
                    color="gray"
                    className="p-1"
                  >
                    <CaretRightIcon />
                  </Button>
                </Box>
              </Flex>
            </AnimatedBox>
          </>
        )}
      </AnimatePresence>
      {/* Panel View */}
      {uiState.distractionFreeMode && (
        <Button
          title="Turn off Distraction free mode"
          radius="full"
          onClick={() => globalState$.uiState.distractionFreeMode.set(false)}
          className="absolute top-[93%] left-[96.3%] w-10 cursor-pointer h-10 bg-black/60 flex items-center justify-center backdrop-blur-lg shadow-lg z-[9999]"
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
