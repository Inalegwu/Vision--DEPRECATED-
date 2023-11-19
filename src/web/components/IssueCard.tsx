import { Box, Button, Image, LinkButton, Text } from "./atoms";
import { Issue } from "../../shared/types";
import { trpcReact } from "../../shared/config";
import toast from "react-hot-toast";
import { useNavigate, useNavigation } from "react-router-dom";
import React, { useCallback, useRef, useState } from "react";
import ContextMenu, { ContextMenuRefProps } from "./ContextMenu";
import { Pencil, Trash } from "@phosphor-icons/react";

type Props = {
  issue: Issue;
};

export default function IssueCard(props: Props) {
  const utils = trpcReact.useUtils();
  const router = useNavigate();
  const contextMenuRef = useRef<ContextMenuRefProps>(null);

  // use to position context menu
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // the only actions this component can carry out
  // are editing and deleting
  const { mutate: deleteIssue, isLoading: deleting } =
    trpcReact.issue.deleteIssue.useMutation({
      onSuccess: () => {
        utils.library.invalidate();
        toast.success("Gone for now 😣");
      },
      onError: () => {
        toast.error("Couldn't Remove from Library 🫤");
      },
    });

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.ctrlKey) {
        contextMenuRef.current?.toggle();
        setMousePos({ x: e.nativeEvent.x, y: e.nativeEvent.y });
      } else {
        router(`/${props.issue.id}`);
      }
    },
    [props.issue, setMousePos]
  );

  return (
    <Box
      css={{
        display: "flex",
        flexDirection: "column",
        alignContent: "flex-start",
        alignItems: "flex-start",
        gap: "$md",
        transition: "0.3s ease-in-out",
        "&:hover": {
          color: "$lightGray",
          cursor: "pointer",
        },
      }}
      onClick={handleClick}
    >
      <ContextMenu
        style={{
          position: "absolute",
          top: mousePos.y + 10,
          left: mousePos.x + 10,
          background: "$gray",
          borderRadius: "$md",
          border: "0.1px solid rgba(255,255,255,0.3)",
        }}
        ref={contextMenuRef}
      >
        <Button
          css={{
            padding: "$xl",
            borderBottom: "0.1px solid rgba(255,255,255,0.3)",
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            gap: "$md",
            justifyContent: "flex-start",
            color: "$lightGray",
            width: "100%",
            borderTopRightRadius: "$md",
            borderTopLeftRadius: "$md",
            "&:hover": {
              background: "$secondary",
              color: "$white",
            },
          }}
        >
          <Pencil />
          <Text>Edit Issue Data</Text>
        </Button>
        <Button
          onClick={() => deleteIssue({ id: props.issue.id })}
          css={{
            padding: "$xl",
            borderBottom: "0.1px solid rgba(255,255,255,0.3)",
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            gap: "$md",
            justifyContent: "flex-start",
            color: "$danger",
            width: "100%",
            borderBottomRightRadius: "$md",
            borderBottomLeftRadius: "$md",
            "&:hover": {
              background: "$danger",
              color: "$white",
            },
          }}
        >
          <Trash />
          <Text>Remove {props.issue.name} from library</Text>
        </Button>
      </ContextMenu>
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
            border: "0.1px solid rgba(255,255,255,0.6)",
          },
          opacity: `${deleting ? "0.5" : "1"}`,
        }}
      >
        <Image
          css={{ height: "100%", width: "100%" }}
          src={props.issue.thumbnailUrl}
          alt={props.issue.name}
        />
        C
      </Box>
      <Box css={{ width: 170 }}>
        <Text>{props.issue.name}</Text>
      </Box>
    </Box>
  );
}
