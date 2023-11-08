import { Box } from "./atoms";

export type VStackProps = {
  gap?: number;
  alignContent?: string;
  alignItems?: string;
  justifyContent?: string;
  children?: React.ReactNode;
  width?: string;
};

export default function VStack(props: VStackProps) {
  return (
    <Box
      css={{
        display: "flex",
        flexDirection: "column",
        width: props.width || "",
        justifyContent: props.justifyContent || "flex-start",
        alignContent: props.alignContent || "flex-start",
        alignItems: props.alignItems || "flex-start",
        gap: props.gap || 1,
      }}
    >
      {props.children}
    </Box>
  );
}

