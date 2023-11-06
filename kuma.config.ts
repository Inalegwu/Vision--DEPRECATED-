import { createTheme } from "@kuma-ui/core";

const theme = createTheme({
  colors: {
    primary: "#4097E8",
    background: "#000000",
    secondary: "#AC5423",
    gray: "#333333",
    deepBlack: "#1C1C1C",
    white: "#FFFFFF",
  },
  spacings: {
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
});

export type UserTheme = typeof theme;

declare module "@kuma-ui/core" {
  export interface Theme extends UserTheme {}
}

export default theme;

