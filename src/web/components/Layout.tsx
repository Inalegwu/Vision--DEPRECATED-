import { CornersOut, Minus, X } from "@phosphor-icons/react";
import { useKeyPress } from "@src/web/hooks";
import { trpcReact } from "../../shared/config";
import HStack from "./HStack";
import { Box, Button, Text } from "./atoms";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout(props: LayoutProps) {
  const { mutate: closeWindow } = trpcReact.window.closeWindow.useMutation();
  const { mutate: maximizeWindow } =
    trpcReact.window.maximizeWindow.useMutation();
  const { mutate: minimizeWindow } =
    trpcReact.window.minimizeWindow.useMutation();

  // use ctrl/cmd key + q for quitting the app
  useKeyPress((e) => {
    if (e.ctrlKey && e.key === "q") {
      closeWindow();
    }
  });

  return (
    <Box
      css={{
        height: "100vh",
        width: "100%",
        color: "$white",
        background: "$background",
      }}
    >
      {/* pulse orb */}
      <Box css={{width:600,height:600,background:"$primary",borderRadius:"$full",position:"absolute",zIndex:0}}/>
      {/* overlay */}
     <Box css={{width:"100%",height:"100%",position:"absolute",zIndex:1,background:"transparent",backdropFilter:"blur(400px)"}}>
       {/* titlebar */}
      <Box
        css={{
          width: "100%",
          height: "4%",
          display: "flex",
          padding: "$xxl",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "0.1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Box
          css={{
            display: "flex",
            alignContent: "flex-end",
            alignItems: "flex-end",
            gap: "$md",
          }}
        >
          <Text css={{fontWeight:"lighter",letterSpacing:0.3}}>Vision</Text>
        </Box>
        <Box
          id="drag-region"
          css={{
            display: "flex",
            flex: 1,
            padding: "$md",
            height: 25,
            cursor: "grab",
          }}
        />
        <HStack
          gap={10}
          alignContent="center"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Button
            css={{ color: "$lightGray", "&:hover": { color: "$white" },display:"flex",alignContent:"center",alignItems:"center",justifyContent:"center" }}
            onClick={() => minimizeWindow()}
          >
            <Minus />
          </Button>
          <Button
           css={{ color: "$lightGray", "&:hover": { color: "$white" },display:"flex",alignContent:"center",alignItems:"center",justifyContent:"center" }}
            onClick={() => maximizeWindow()}
          >
            <CornersOut />
          </Button>
          <Button
            css={{ color: "$lightGray", "&:hover": { color: "$danger" },display:"flex",alignContent:"center",alignItems:"center",justifyContent:"center" }}
            onClick={() => closeWindow()}
          >
            <X />
          </Button>
        </HStack>
      </Box>
      {/* navbar */}
      {/* <Box css={{position:"absolute",zIndex:30,background:"$blackMuted",backdropFilter:"blur(300px)",padding:"$lg",borderRadius:"$lg",left:"46%",top:"93%"}}>
        content
      </Box> */}
      <Box css={{ width: "100%", height: "96%" }}>{props.children}B</Box>
     </Box>
    </Box>
  );
}
