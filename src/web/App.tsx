import { HashRouter, Routes, Route } from "react-router-dom";
import { Issue, Library } from "./pages";
import { Toaster } from "react-hot-toast";

export const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Library />} />
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
            color: "#FFFFFF",
            background: "#1C1C1C",
          },
        }}
      />
    </HashRouter>
  );
};

