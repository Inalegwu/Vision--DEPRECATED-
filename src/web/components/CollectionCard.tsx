import { AnimatedText, Box, Image } from "@components/atoms";
import { useObservable } from "@legendapp/state/react";
import { Collection, Issue } from "@src/shared/types";
import { AnimatePresence } from "framer-motion";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTimeout } from "../hooks";

type CollectionCardProps = {
  collection: Collection & { issues: Issue[] };
};

export default function CollectionCard({ collection }: CollectionCardProps) {
  const router = useNavigate();

  const mouseOver=useObservable(false);

  const handleClick = useCallback(() => {
    router(`/collections/${collection.id}`);
  }, [router, collection]);


  useTimeout(()=>{
 
    mouseOver.set(false)

  },3000)


  return (
    <>
    <Box css={{display:"flex",flexDirection:"column",alignContent:"flex-start",alignItems:"flex-start",gap:"$sm"}}>
      <Box onMouseOver={()=>mouseOver.set(true)} onClick={handleClick} css={{width:165,height:260,position:"relative",overflow:"hidden",borderRadius:"$md",cursor:"pointer"}}>
        <Image src={collection.issues[collection.issues.length-1].thumbnailUrl} css={{width:"100%",height:"100%",position:"absolute",zIndex:0}}/>
        <Box css={{width:"100%",height:"100%",padding:"$md",background:"rgba(0,0,0,0.5)",position:"absolute",zIndex:1,display:"flex",flexDirection:"column",alignContent:"flex-start",alignItems:"flex-start",justifyContent:"flex-end"}}>
          <AnimatedText layout css={{fontSize:13,fontWeight:"normal"}}>{collection.name}</AnimatedText>
          <AnimatePresence>
            {mouseOver.get() &&
              <AnimatedText initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} css={{fontSize:12.5}}>{collection.issues.length} issue(s)</AnimatedText> 
            }
         </AnimatePresence>
      </Box>
      </Box>
    </Box>
    </>
  );
}
