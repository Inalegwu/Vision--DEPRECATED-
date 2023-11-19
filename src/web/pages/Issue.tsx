import { Box, LinkButton, Image, Text, AnimatedBox } from "../components/atoms";
import { Spinner } from "../components";
import { useParams } from "react-router-dom";
import { IssueParams } from "../../shared/types";
import { trpcReact } from "../../shared/config";
import { CaretLeft } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export default function Issue() {
  const [navigationShowing, setNavigationShowing] = useState<boolean>(true);
  const { issueId } = useParams<IssueParams>();

  window.addEventListener("mousemove", () => {
    setNavigationShowing(true);
  });

  useEffect(() => {
    const navigationTimeout = setTimeout(() => {
      setNavigationShowing(false);
    }, 3000);

    return () => {
      clearTimeout(navigationTimeout);
    };
  }, [setNavigationShowing]);

  if (!issueId) return;

  const { data: issue, isLoading: loadingIssue } =
    trpcReact.issue.getIssue.useQuery({
      id: issueId!,
    });

  return (
    <Box
      css={{
        width: "100%",
        height: "100vh",
        background: "$background",
        color: "$white",
      }}
    >
      {loadingIssue && (
        <Box
          css={{
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            zIndex: 9999,
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            css={{
              display: "flex",
              flexDirection: "column",
              gap: "$xxxl",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spinner />
            <Text>Getting Panels Ready</Text>
          </Box>
        </Box>
      )}
      {navigationShowing && (
        <AnimatedBox
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: navigationShowing ? 1 : 0,
          }}
          css={{
            width: "100%",
            height: "100vh",
            position: "absolute",
            zIndex: 99999,
            padding: "$xl",
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            css={{
              width: "100%",
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "$xxxl",
            }}
          >
            <LinkButton
              to="/"
              css={{
                padding: "$lg",
                background: "$primary",
                color: "$white",
                borderRadius: "$md",
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CaretLeft size={20} />
            </LinkButton>
            <Text css={{ color: "$white", fontSize: 20 }}>
              {issue?.issue?.name}
              Teen Titans
            </Text>
            <Box
              css={{
                flex: 1,
                padding: "$md",
                height: 50,
              }}
              id="drag-region"
            />
          </Box>
          <Box
            css={{
              width: "100%",
              padding: "$hg",
              height: 80,
              background: "$blackMuted",
              backdropFilter: "blur(400px)",
              borderRadius: "$xl",
            }}
          >
            content
          </Box>
        </AnimatedBox>
      )}
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
        {issue?.issue?.pages.map((v) => {
          return (
            <Image
              src={v.content}
              alt={v.name}
              css={{ width: 100, height: 100 }}
            />
          );
        })}
      </Box>
    </Box>
  );
}
