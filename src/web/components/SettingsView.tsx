import { observer, useObservable } from "@legendapp/state/react";
import { X } from "@phosphor-icons/react";
import { AnimatePresence } from "framer-motion";
import { useCallback } from "react";
import { settingsView } from "../state";
import HStack from "./HStack";
import { Appearance } from "./SettingsViews";
import VStack from "./VStack";
import { AnimatedBox, Box, Button, Text } from "./atoms";

// the types of settings options the application has
type ActiveSettingsView = "Appearance" | "";

// using this to prevent repetitively typing
// out buttons and the respective change types
// I can just map over this and set the active settings
// view observable to the item itself
const Views: ActiveSettingsView[] = ["Appearance"];
// change the ui of the settings view depending on the active settings
// option
const SwitchSettingsView = (settingsView: ActiveSettingsView) => {
  switch (settingsView) {
    case "Appearance":
      return <Appearance />;

    default:
      return <></>;
  }
};

const SettingsView = observer(() => {
  const activeSettingsView = useObservable<ActiveSettingsView>("Appearance");

  // change the active settings view type
  // which in turn changes the ui that is being rendered
  // the the viewport
  const changeActiveSettingsView = useCallback(
    (viewType: ActiveSettingsView) => {
      activeSettingsView.set(viewType);
    },
    [activeSettingsView],
  );

  return (
    <AnimatePresence>
      {settingsView.get() && (
        <AnimatedBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          css={{
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            zIndex: 99999,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            css={{
              width: "60%",
              height: "65%",
              display: "flex",
              background: "transparent",
              borderRadius: "$lg",
              overflow: "hidden",
            }}
          >
            {/* left side */}
            <Box
              css={{
                width: "25%",
                height: "100%",
                background: "$blackMuted",
                backdropFilter: "blur(1000px)",
                borderRight: "0.1px solid rgba(255,255,255,0.2)",
                gap: "$md",
              }}
            >
              {/* close button and more */}
              <HStack
                alignContent="center"
                alignItems="center"
                justifyContent="space-between"
                style={{
                  padding: "$lg",
                }}
              >
                <Button
                  onClick={() => settingsView.set(false)}
                  css={{
                    display: "flex",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "$white",
                  }}
                >
                  <X />
                </Button>
              </HStack>
              {/* actions */}
              <VStack
                alignContent="flex-start"
                alignItems="flex-start"
                justifyContent="flex-start"
                style={{ padding: "$lg", gap: "$md" }}
              >
                {/* render the settings options as clickables to toggle the active view
                 */}
                {Views.map((v, idx) => (
                  <Button
                    key={`${idx}`}
                    onClick={() => changeActiveSettingsView(v)}
                    css={{
                      display: "flex",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      width: "100%",
                      padding: "$md",
                      borderRadius: "$md",
                      gap: "$md",
                      background: `${
                        v === activeSettingsView.get() ? "$lightGray" : ""
                      }`,
                    }}
                  >
                    <Text
                      css={{
                        color: `${
                          v === activeSettingsView.get() ? "$black" : "$white"
                        }`,
                        fontSize: 13,
                        fontWeight: "normal",
                      }}
                    >
                      {v}
                    </Text>
                  </Button>
                ))}
              </VStack>
            </Box>
            {/* right side */}
            <Box
              css={{
                width: "75%",
                height: "100%",
                background: "$background",
              }}
            >
              {/* the switchSettingsView function (defined above) renders the 
                appropriate components in the view port for the active settings view*/}
              {SwitchSettingsView(activeSettingsView.get())}
            </Box>
          </Box>
        </AnimatedBox>
      )}
    </AnimatePresence>
  );
});

export default SettingsView;
