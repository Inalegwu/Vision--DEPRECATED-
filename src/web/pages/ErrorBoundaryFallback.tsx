import { FallbackProps } from "react-error-boundary";
import { Box, Text } from "../components/atoms";

function ErrorBoundaryFallback(props: FallbackProps) {
  return (
    <Box
      css={{
        width: "100%",
        height: "100vh",
        background: "$background",
        padding: "$lg",
        display: "flex",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text>{props.error}</Text>
    </Box>
  );
}

export default ErrorBoundaryFallback;
