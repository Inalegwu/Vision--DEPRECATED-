import { Property } from "@stitches/react/types/css";
import { Box } from "./atoms";

export type HStackProps = {
  gap?: number;
  alignContent?: Property.AlignContent;
  alignItems?: Property.AlignItems;
  justifyContent?: Property.JustifyContent;
  children?: React.ReactNode;
  width?: string;
};

export default function HStack(props: HStackProps) {
  return (
    <Box
      css={{
        display: "flex",
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

