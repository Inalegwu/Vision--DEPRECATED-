import { HashRouter, Routes, Route } from "react-router-dom";
import { Collection, Home, Issue, Library, Settings } from "./pages";

export const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/:collectionId" element={<Collection />} />
        <Route path="/:issueId" element={<Issue />} />
      </Routes>
    </HashRouter>
  );
};

