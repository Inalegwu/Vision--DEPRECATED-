import { Property } from "@stitches/react/types/css";
import { Box } from "./atoms";
import { ThemeCSS } from "../../shared/types";

export type HStackProps = {
  gap?: number;
  alignContent?: Property.AlignContent;
  alignItems?: Property.AlignItems;
  justifyContent?: Property.JustifyContent;
  children?: React.ReactNode;
  width?: string;
  padding?: number;
  height?: string | number;
  style?: ThemeCSS;
};

export default function HStack(props: HStackProps) {
  return (
    <Box
      css={{
        display: "flex",
        padding: props.padding || "",
        height: props.height || "",
        width: props.width || "",
        justifyContent: props.justifyContent || "flex-start",
        alignContent: props.alignContent || "flex-start",
        alignItems: props.alignItems || "flex-start",
        gap: props.gap || 1,
        ...props.style,
      }}
    >
      {props.children}
    </Box>
  );
}
