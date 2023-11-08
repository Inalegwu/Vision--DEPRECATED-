import { createStitches } from "@stitches/react";

export const { styled, css } = createStitches({
  theme: {
    colors: {
      primary: "#4097E8",
      background: "#000000",
      secondary: "#AC5423",
      gray: "#333333",
      lightGray: "#ECECEC",
      deepBlack: "#1C1C1C",
      white: "#FFFFFF",
    },
    space: {
      sm: "2px",
      md: "4px",
      lg: "8px",
      xl: "10px",
      xxl: "12px",
      xxxl: "14px",
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

