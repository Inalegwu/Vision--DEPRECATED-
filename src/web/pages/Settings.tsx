import { Layout } from "../components";
import { Box, Option, Select, Text } from "../components/atoms";
import { useAtom } from "jotai";
import { appIdState, themeState } from "../state";
import { ThemeState } from "../../shared/types";

export default function Settings() {
  const [appId] = useAtom(appIdState);
  const [theme, setColorTheme] = useAtom(themeState);

  return (
    <Layout>
      <Box
        css={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          css={{
            width: "80%",
            height: "90%",
            borderRadius: "$lg",
            padding: "$lg",
            background: `${theme === "dark" ? "$deepBlack" : "$lightGray"}`,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <Text
            css={{
              fontWeight: "bold",
              fontSize: 30,
              color: `${theme === "dark" ? "$white" : "$deepBlack"}`,
            }}
          >
            Settings
          </Text>
          <Box
            css={{
              width: "100%",
              padding: "$md",
              borderRadius: "$md",
              background: `${theme === "dark" ? "$gray" : "$white"}`,
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text>Color Mode</Text>
            <Select
              css={{
                padding: "$md",
                background: `${theme === "dark" ? "$deepBlack" : "$lightGray"}`,
                borderRadius: "$sm",
                color: `${theme === "dark" ? "$white" : "$deepBlack"}`,
              }}
              value={theme}
              onChange={(e) => {
                setColorTheme(e.currentTarget.value as ThemeState);
              }}
            >
              <Option value="dark">Dark</Option>
              <Option value="light">Light</Option>
            </Select>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}

