import { Pencil, Trash } from "@phosphor-icons/react";
import { Issue, Point } from "@shared/types";
import { trpcReact } from "@src/shared/config";
import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useWindow } from "../hooks";
import ContextMenu, { ContextMenuRefProps } from "./ContextMenu";
import { AnimatedBox, Box, Button, Image, LinkButton, Text } from "./atoms";

type Props = {
  issue: Issue;
};

export default function IssueCard(props: Props) {
  const router = useNavigate();
  const utils = trpcReact.useUtils();
  const contextMenuRef = useRef<ContextMenuRefProps>(null);
  const [points, setPoints] = useState<Point>({
    x: 0,
    y: 0,
  });

  const contextVisible = contextMenuRef.current?.isVisible();

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

  console.log(contextVisible);

  const handleClick = useCallback(() => {
    router(`/${props.issue.id}`);
  }, [props.issue]);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setPoints({
        x: e.pageX,
        y: e.pageY,
      });
      contextMenuRef.current?.show();
    },
    [],
  );

  useWindow("click", () => {
    if (contextVisible) {
      contextMenuRef.current?.hide();
    }
  });

  const deleteIssue = useCallback(() => {
    contextMenuRef.current?.hide();
    console.log(props.issue.id);
    mutate({
      id: props.issue.id,
    });

    if (deleting) {
      toast.loading(`Deleting ${props.issue.name}`);
    }
  }, [props.issue, deleting]);

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
        points={points}
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
          to={`/editIssue/${props.issue.id}`}
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
          opacity: `${deleting ? 0.5 : 1}`,
          transition: "0.3s ease-in-out",
          "&:hover": {
            cursor: "pointer",
          },
        }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <Box
          css={{
            border: "0.1px solid rgba(255,255,255,0.3)",
            height: 260,
            width: 170,
            borderRadius: "$md",
            overflow: "hidden",
            color: "$white",
            transition: "0.5s ease-in-out",
            "&:hover": {
              border: "0.1px solid $secondary",
            },
          }}
        >
          <Image
            css={{ height: "100%", width: "100%" }}
            src={props.issue.thumbnailUrl}
            alt={props.issue.name}
          />
        </Box>
        <Box css={{ width: 170 }}>
          <Text css={{ fontSize: 13, color: "$white" }}>
            {props.issue.name}
          </Text>
        </Box>
      </AnimatedBox>
    </>
  );
}
