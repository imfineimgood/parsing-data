import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Data from "./pages/Data";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Data />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
