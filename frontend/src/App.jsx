import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home_Page from "./pages/Home_Page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>  
        <Route path="/" element={<Home_Page />} />
      </Routes>
    </BrowserRouter>
  );
}