import { AnimatedText, Box, Image, Text } from "@components/atoms";
import { useObservable } from "@legendapp/state/react";
import { Collection, Issue } from "@src/shared/types";
import { AnimatePresence } from "framer-motion";
import moment from "moment";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTimeout } from "../hooks";

type CollectionCardProps = {
  collection: Collection & { issues: Issue[] };
};

export default function CollectionCard({ collection }: CollectionCardProps) {
  const router = useNavigate();

  const infoText=useObservable(true);

  const handleClick = useCallback(() => {
    router(`/collections/${collection.id}`);
  }, [router, collection]);


  useTimeout(()=>{
    infoText.set(false);
  },3000)


  return (
    <>
    <Box css={{display:"flex",flexDirection:"column",alignContent:"flex-start",alignItems:"flex-start",gap:"$sm"}}>
      <Box onClick={handleClick} css={{width:165,height:260,position:"relative",overflow:"hidden",borderRadius:"$md",cursor:"pointer"}}>
        <Image src={collection.issues[0].thumbnailUrl} css={{width:"100%",height:"100%",position:"absolute",zIndex:0}}/>
        <Box css={{width:"100%",height:"100%",padding:"$md",background:"rgba(0,0,0,0.4)",position:"absolute",zIndex:1,display:"flex",flexDirection:"column",alignContent:"flex-start",alignItems:"flex-start",justifyContent:"flex-end"}}>
          <Text css={{fontSize:13,fontWeight:"normal"}}>{collection.name}</Text>
          <Text css={{fontSize:12.5}}>{collection.issues.length} issue(s)</Text>
        </Box>
      </Box>
      <AnimatePresence>
        {infoText.get()&&<AnimatedText 
         initial={{opacity:0}} animate={{opacity:1}} css={{fontSize:11,color:"$lightGray",fontWeight:"lighter"}}
        >{moment(collection.dateCreated).fromNow()}</AnimatedText>}
      </AnimatePresence>
    </Box>
    </>
  );
}
