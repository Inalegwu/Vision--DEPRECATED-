import { AnimatedText, Image } from "@components/atoms";
import { useObservable } from "@legendapp/state/react";
import { Box } from "@radix-ui/themes";
import { Collection, Issue } from "@src/shared/types";
import { AnimatePresence } from "framer-motion";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTimeout } from "../hooks";
import { globalState$ } from "../state";

type CollectionWithIssues = Collection & {
  issues: Issue[];
};

type CollectionCardProps = {
  collection: CollectionWithIssues;
};

export default function CollectionCard({ collection }: CollectionCardProps) {
  const router = useNavigate();

  const mouseOver = useObservable(false);

  const { colorMode } = globalState$.uiState.get();

  // navigate the user to the collection page
  const handleClick = useCallback(() => {
    router(`/collections/${collection.id}`);
  }, [router, collection]);

  // disable the mouse over effect after
  // 3 seconds to give the user time to
  // view the information
  useTimeout(() => {
    mouseOver.set(false);
  }, 3000);

  return (
    <>
      <Box
        onMouseOver={() => mouseOver.set(true)}
        onClick={handleClick}
        className="w-44 h-65 overflow-hidden relative  rounded-md cursor-pointer ml-1"
      >
        {/* if the collection has more than 1 issue , render the rest of the stack , to give the scattered stack effec */}
        {collection.issues.length > 1 && (
          <>
            <Image
              src={collection.issues[2]?.thumbnailUrl}
              css={{
                width: "100%",
                height: "100%",
                position: "absolute",
                zIndex: 1,
                transform: "rotate(2deg)",
                borderRadius: "$md",
                opacity: 0.4,
              }}
            />
            <Image
              src={collection.issues[3]?.thumbnailUrl}
              css={{
                width: "100%",
                height: "100%",
                position: "absolute",
                zIndex: 2,
                transform: "rotate(-2deg)",
                borderRadius: "$md",
                opacity: 0.5,
              }}
            />
          </>
        )}
        {/* I'm using the last item in the list because that's most likely the first issue within that list */}
        <img
          src={collection.issues[collection.issues.length - 1]?.thumbnailUrl}
          alt={collection.issues[collection.issues.length - 1]?.name}
          className="w-full h-full absolute z-3 rounded-md border-[0.1px] border-solid border-slate-200"
        />
        <Box className="w-full h-full p-1 bg-black/65 absolute z-4 flex flex-col items-start content-start justify-end rounded-md">
          <AnimatedText
            layout
            css={{
              fontSize: 13,
              fontWeight: "normal",
              color: "$white",
            }}
          >
            {collection.name}
          </AnimatedText>
          {/* shows the collection information , like the number of issues in an animated manner */}
          <AnimatePresence>
            {mouseOver.get() && (
              <AnimatedText
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                css={{
                  fontSize: 12.5,
                  fontWeight: "normal",
                  color: "$white",
                }}
              >
                {collection.issues.length} issue(s)
              </AnimatedText>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </>
  );
}
