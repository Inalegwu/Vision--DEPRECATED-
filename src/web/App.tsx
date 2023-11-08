import { HashRouter, Routes, Route } from "react-router-dom";
import { Collection, Home, Issue, Library, Settings } from "./pages";
import { Toaster } from "react-hot-toast";
import { useAtom } from "jotai";
import { themeState } from "./state";

export const App = () => {
  const [theme] = useAtom(themeState);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/:collectionId" element={<Collection />} />
        <Route path="/:issueId" element={<Issue />} />
      </Routes>
      <Toaster
        position="top-right"
        containerStyle={{
          top: 30,
        }}
        toastOptions={{
          style: {
            padding: 5,
            display: "flex",
            flexDirection: "column",
            alignContent: "flex-start",
            alignItems: "flex-start",
            gap: 2,
            fontSize: 13,
            fontWeight: 500,
            color: `${theme === "dark" ? "#FFFFFF" : "#1C1C1C"}`,
            background: `${theme === "dark" ? "#1C1C1C" : "#ECECEC"}`,
          },
        }}
      />
    </HashRouter>
  );
};

