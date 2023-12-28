import { createStitches } from "@stitches/react";

export const { styled, css, config } = createStitches({
  theme: {
    colors: {
      primary: '#289776b7',
      background: "#000000",
      secondary: '#289776c0',
      gray: "rgba(255,255,250,0.2)",
      lightGray: "rgba(255,255,255,0.4)",
      blackMuted: "rgba(0,0,0,0.8)",
      deepBlack: "rgba(0,0,0,0)",
      white: "rgb(255,255,255)",
      danger: "rgba(255,90,90,0.9)",
    },
    space: {
      sm: "2px",
      md: "4px",
      lg: "8px",
      xl: "10px",
      xxl: "12px",
      xxxl: "14px",
      hg: "20px",
      xhg:"40px",
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
