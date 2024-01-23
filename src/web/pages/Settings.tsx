import { CaretLeft } from "@phosphor-icons/react";
import { Button, Flex, Heading, Tabs, Text } from "@radix-ui/themes";
import { Layout } from "@src/web/components";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export enum Tab {
  KeyboardShortcuts = "0",
  Appearance = "1",
}

export default function Settings() {
  const router = useNavigate();

  const goBack = useCallback(() => {
    // @ts-ignore go back a page
    router(-1, {
      preventScrollReset: true,
      unstable_viewTransition: true,
    });
  }, [router]);

  return (
    <Layout>
      <Flex p="2" direction="column" gap="6" className="w-full h-100vh">
        <Flex align="center" justify="start" gap="3">
          <Button onClick={goBack} className="p-2.5" variant="soft" size="3">
            <CaretLeft size={15} />
          </Button>
          <Heading size="8">Settings</Heading>
        </Flex>
        <Tabs.Root>
          <Tabs.List defaultChecked={true} defaultValue={Tab.KeyboardShortcuts}>
            <Tabs.Trigger value={Tab.KeyboardShortcuts}>
              Keyboard Shortcuts
            </Tabs.Trigger>
            <Tabs.Trigger value={Tab.Appearance}>Appearance</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content className="mt-2" value={Tab.KeyboardShortcuts}>
            <Flex direction="column">
              <Heading>Keyboard shortcuts</Heading>
              <Text className="text-gray-400">
                View and modify default keyboard shortcuts
              </Text>
            </Flex>
            <Flex grow="1" className="w-full h-screen mt-2">
              content
            </Flex>
          </Tabs.Content>
          <Tabs.Content className="mt-2" value={Tab.Appearance}>
            Appearance
          </Tabs.Content>
        </Tabs.Root>
      </Flex>
    </Layout>
  );
}
