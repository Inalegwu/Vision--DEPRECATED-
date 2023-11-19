import { createStitches } from "@stitches/react";

export const { styled, css, config } = createStitches({
  theme: {
    colors: {
      primary: "#4097E8",
      background: "#000000",
      secondary: "#473BF0",
      gray: "#333333",
      lightGray: "#ECECEC",
      blackMuted: "#1d1d1d79",
      deepBlack: "#1C1C1C",
      white: "#FFFFFF",
      danger: "#ff0000",
    },
    space: {
      sm: "2px",
      md: "4px",
      lg: "8px",
      xl: "10px",
      xxl: "12px",
      xxxl: "14px",
      hg: "20px",
    },
    radii: {
      sm: "2px",
      md: "4px",
      lg: "8px",
      xl: "10px",
      xxl: "12px",
      xxxl: "14px",
      full: "99999px",
    },
  },
});
