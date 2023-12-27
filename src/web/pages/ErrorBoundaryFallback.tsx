import { Box, Button, Text } from "@components/atoms";
import { FallbackProps } from "react-error-boundary";

function ErrorBoundaryFallback(props: FallbackProps) {
  return (
    <Box
      css={{
        width: "100%",
        height: "100vh",
        background: "$danger",
        padding: "$lg",
        display: "flex",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        color:"$white"
      }}
    >
      <Text>{props.error}</Text>
      <Button onClick={()=>props.resetErrorBoundary()}>
        <Text>Reset App</Text>
      </Button>
    </Box>
  );
}

export default ErrorBoundaryFallback;
