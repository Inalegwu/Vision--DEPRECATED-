import { HashRouter, Routes, Route } from "react-router-dom";
import { Home, Library, Settings } from "./pages";

export const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </HashRouter>
  );
};

