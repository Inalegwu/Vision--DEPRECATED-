import { observer } from "@legendapp/state/react";
import VStack from "../VStack";
import { Box, Input, Text } from "../atoms";

const Appearance = observer(() => {
  return (
    <Box
      css={{
        width: "100%",
        height: "100%",
        padding: "$lg",
        display: "flex",
        flexDirection: "column",
        gap: "$md",
      }}
    >
      <VStack
        alignContent="flex-start"
        alignItems="flex-start"
        style={{ gap: "$md" }}
      >
        <Text
          css={{
            fontSize: 15,
            color: "$white",
          }}
        >
          Primary Color
        </Text>
        <Input
          type="color"
          css={{
            border: "none",
            padding: "$md",
            borderRadius: "$md",
            width: "100%",
            background: "rgba(0,0,0,0.4)",
          }}
        />
      </VStack>
    </Box>
  );
});

export default Appearance;
