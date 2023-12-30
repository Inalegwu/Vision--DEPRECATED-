import { AnimatedText, Box, Image } from "@components/atoms";
import { useObservable } from "@legendapp/state/react";
import { Collection, Issue } from "@src/shared/types";
import { AnimatePresence } from "framer-motion";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTimeout } from "../hooks";

type CollectionWithIssues=Collection&{
  issues:Issue[]
}

type CollectionCardProps = {
  collection: CollectionWithIssues;
};

export default function CollectionCard({ collection }: CollectionCardProps) {
  const router = useNavigate();

  const mouseOver=useObservable(false);

  // navigate the user to the collection page
  const handleClick = useCallback(() => {
    router(`/collections/${collection.id}`);
  }, [router, collection]);


  // disable the mouse over effect after
  // 3 seconds to give the user time to
  // view the information
  useTimeout(()=>{
 
    mouseOver.set(false)

  },3000)


  return (
    <>

      <Box onMouseOver={()=>mouseOver.set(true)} onClick={handleClick} css={{width:165,height:260,position:"relative",borderRadius:"$md",cursor:"pointer",marginLeft:"$md"}}>
        {/* if the collection has more than 1 issue , render the rest of the stack , to give the scattered stack effec */}
        {
          collection.issues.length>1 &&(
            <>
              <Image src={collection.issues[2]?.thumbnailUrl} css={{width:"100%",height:"100%",position:"absolute",zIndex:1,transform:"rotate(2deg)",borderRadius:"$md",opacity:0.4}}/>
              <Image src={collection.issues[3]?.thumbnailUrl} css={{width:"100%",height:"100%",position:"absolute",zIndex:2,transform:"rotate(-2deg)",borderRadius:"$md",opacity:0.5}}/>
            </>
          )
        }
        {/* I'm using the last item in the list because that's most likely the first issue within that list */}
        <Image src={collection.issues[collection.issues.length-1]?.thumbnailUrl} css={{width:"100%",height:"100%",position:"absolute",zIndex:3,borderRadius:"$md"}}/>
        <Box css={{width:"100%",height:"100%",padding:"$md",background:"rgba(0,0,0,0.5)",position:"absolute",zIndex:4,display:"flex",flexDirection:"column",alignContent:"flex-start",alignItems:"flex-start",justifyContent:"flex-end"}}>
          <AnimatedText layout css={{fontSize:13,fontWeight:"lighter",color:"$white"}}>{collection.name}</AnimatedText>
          {/* shows the collection information , like the number of issues in an animated manner */}
          <AnimatePresence>
            {mouseOver.get() &&
              <AnimatedText initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} css={{fontSize:12.5,fontWeight:"lighter",color:"$white"}}>{collection.issues.length} issue(s)</AnimatedText> 
            }
         </AnimatePresence>
      </Box>
      </Box>
    </>
  );
}
