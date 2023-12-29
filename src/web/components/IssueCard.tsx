import { useObservable } from "@legendapp/state/react";
import { Pencil, Trash } from "@phosphor-icons/react";
import { Issue, Point } from "@shared/types";
import { trpcReact } from "@src/shared/config";
import { AnimatePresence } from "framer-motion";
import moment from "moment";
import { useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTimeout, useWindow } from "../hooks";
import { readingState } from "../state";
import ContextMenu, { ContextMenuRefProps } from "./ContextMenu";
import { AnimatedBox, AnimatedText, Box, Button, Image, LinkButton, Text } from "./atoms";

type Props = {
  issue: Issue;
};

export default function IssueCard(props: Props) {
  const router = useNavigate();
  const utils = trpcReact.useUtils();
  const contextMenuRef = useRef<ContextMenuRefProps>(null);

  const infoVisible=useObservable(true);

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

  useTimeout(()=>{
    infoVisible.set(false)
  },3000)

  const deleteIssue = useCallback(() => {
    contextMenuRef.current?.hide();
    mutate({
      id: props.issue.id,
    });
  }, [props.issue, deleting, mutate]);

  return (
    <>
    {/* context menu */}
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
          width:170,
          height:70,
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
          <Text css={{fontSize:13,fontWeight:"lighter"}}>Edit Issue Info</Text>
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
          <Text css={{fontSize:13,fontWeight:"lighter"}}>Delete Issue</Text>
        </Button>
      </ContextMenu>
    <Box onContextMenu={handleContextMenu} css={{display:"flex",flexDirection:"column",alignContent:"flex-start",alignItems:"flex-start",gap:"$sm"}}>
      <Box onClick={handleClick} css={{width:165,height:260,cursor:"pointer",borderRadius:"$md",position:"relative",overflow:"hidden"}}>
        <Image src={props.issue.thumbnailUrl} alt={props.issue.name} css={{width:"100%",height:"100%",position:"absolute",zIndex:0}}/>
        <Box css={{width:"100%",height:"100%",position:"absolute",zIndex:1,background:"rgba(0,0,0,0.6)",display:"flex",flexDirection:"column",alignContent:"flex-start",alignItems:"flex-start",justifyContent:"flex-end",padding:"$md",gap:"$sm"}}>
          <Text css={{fontSize:14,fontWeight:"normal"}}>{props.issue.name}</Text>
          <Box css={{width:"100%",borderRadius:"$full",background:"$lightGray",backdropFilter:"blur(300px)"}}>
            <AnimatedBox initial={{width:0}} animate={{width:`${(currentlyReading?.page!/currentlyReading?.total!)*100}%`}} css={{background:"$secondary",borderRadius:"$full",padding:"$sm"}}/>
          </Box>
        </Box>
      </Box>
      <AnimatePresence>{
       infoVisible.get()&& <AnimatedText  initial={{opacity:0}} animate={{opacity:1}} css={{fontSize:11,color:"$lightGray",fontWeight:"lighter"}}>{moment(props.issue.dateCreated).fromNow()}</AnimatedText> 
        }</AnimatePresence>
    </Box>
    </>
  );
}
