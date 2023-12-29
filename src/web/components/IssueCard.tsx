import { useObservable } from "@legendapp/state/react";
import { Check, Pencil, Trash } from "@phosphor-icons/react";
import { Issue, Point } from "@shared/types";
import { trpcReact } from "@src/shared/config";
import { AnimatePresence } from "framer-motion";
import { useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useWindow } from "../hooks";
import { readingState } from "../state";
import ContextMenu, { ContextMenuRefProps } from "./ContextMenu";
import { AnimatedBox, Box, Button, Image, LinkButton, Text } from "./atoms";

type Props = {
  issue: Issue;
};

export default function IssueCard(props: Props) {
  const router = useNavigate();
  const utils = trpcReact.useUtils();
  const contextMenuRef = useRef<ContextMenuRefProps>(null);
  const points = useObservable<Point>({
    x: 0,
    y: 0,
  });

  const contextVisible = contextMenuRef.current?.isVisible();

  const currentlyReading = readingState.currentlyReading
    .get()
    .find((v) => v.id === props.issue.id);

  const { mutate, isLoading: deleting } =
    trpcReact.issue.removeIssue.useMutation({
      onError: (err) => {
        console.log(err);
        toast.error("Couldn't Delete That Issue");
      },
      onSuccess: () => {
        utils.issue.invalidate();
        utils.library.invalidate();
        toast.success(`${props.issue.name} Deleted Successfully`);
      },
    });

  const handleClick = useCallback(() => {
    router(`/${props.issue.id}`);
  }, [props.issue, router]);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      points.set({
        x: e.pageX,
        y: e.pageY,
      });
      contextMenuRef.current?.show();
    },
    []
  );

  useWindow("click", () => {
    if (contextVisible) {
      contextMenuRef.current?.hide();
    }
  });

  const deleteIssue = useCallback(() => {
    contextMenuRef.current?.hide();
    mutate({
      id: props.issue.id,
    });
  }, [props.issue, deleting, mutate]);

  return (
    <>
      <ContextMenu
        style={{
          border: "0.12px solid $lightGray",
          background: "$blackMuted",
          borderRadius: "$md",
          backdropFilter: "blur(100px)",
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
        ref={contextMenuRef}
        points={points.get()}
      >
        <LinkButton
          css={{
            color: "$white",
            fontSize: 14,
            padding: "$lg",
            borderBottom: "0.1px solid $lightGray",
            width: "100%",
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "$md",
          }}
          to={`/editIssue/${props.issue?.id}`}
        >
          <Pencil size={14} />
          <Text>Edit Issue Info</Text>
        </LinkButton>
        <Button
          onClick={deleteIssue}
          css={{
            color: "$danger",
            padding: "$lg",
            width: "100%",
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "$md",
          }}
        >
          <Trash size={14} />
          <Text>Delete Issue</Text>
        </Button>
      </ContextMenu>
      <AnimatedBox
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        css={{
          display: "flex",
          flexDirection: "column",
          alignContent: "flex-start",
          alignItems: "flex-start",
          gap: "$md",
          color: "$white",
          position: "relative",
          opacity: `${deleting ? 0.5 : 1}`,
          transition: "0.3s ease-in-out",
          "&:hover": {
            cursor: "pointer",
          },
        }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        {/* <AnimatePresence>
          {doneReading && (
            <AnimatedBox
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              css={{
                top: "-3%",
                left: "93%",
                display: "flex",
                position: "absolute",
                zIndex: 3,
                color: "$primary",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                background: "$white",
                backdropFilter: "blur(200px)",
                borderRadius: "$full",
                padding: "$md",
              }}
            >
              <Check size={10} />
            </AnimatedBox>
          )}
        </AnimatePresence> */}
        <Box
          css={{
            border: "0.1px solid rgba(255,255,255,0.3)",
            height: 260,
            width: 170,
            borderRadius: "$md",
            overflow: "hidden",
            color: "$white",
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            transition: "0.5s ease-in-out",
            "&:hover": {
              border: "0.1px solid $secondary",
            },
          }}
        >
          <Image
            css={{ height: "100%", width: "100%" }}
            src={props.issue?.thumbnailUrl}
            alt={props.issue?.name}
          />
          {currentlyReading && (
            <Box
              css={{
                top: "90%",
                position: "absolute",
                zIndex: 3,
                width: "96%",
                borderRadius: "$full",
                background: "$lightGray",
                backdropFilter: "blur(400px)",
              }}
            >
              <AnimatedBox
                initial={{ width: "0%" }}
                transition={{ duration: 1, ease: "easeOut" }}
                animate={{ width: `${(currentlyReading.page / currentlyReading.total) * 100}%` }}
                css={{
                  padding: "$sm",
                  background: "$primary",
                  borderRadius: "$full",
                }}
              />
            </Box>
          )}
        </Box>
        <Box css={{ width: 170 }}>
          <Text css={{ fontSize: 13, color: "$white" }}>
            {props.issue?.name}
          </Text>
        </Box>
      </AnimatedBox>
    </>
  );
}
