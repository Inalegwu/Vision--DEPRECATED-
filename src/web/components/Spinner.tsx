import { Box } from "@kuma-ui/core";

export type SpinnerProps = {
  size?: number;
};

export default function Spinner({ size }: SpinnerProps) {
  return (
    <Box
      width={size || 30}
      height={size || 30}
      borderWidth={2}
      borderColor="blue"
      borderRadius={size || 30 / 2}
    />
  );
}

