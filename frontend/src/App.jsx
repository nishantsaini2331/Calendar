// src/App.js

import React from "react";
import Calendar from "./components/Calendar";
import { Route, Routes } from "react-router-dom";
import AuthForm from "./pages/AuthForm";
import NotFound from "./components/NotFound";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AllEvents from "./components/AllEvents";

function App() {
  return (
    <div className="overflow-hidden">

    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<AuthForm type={"signin"} />}></Route>
        <Route path="/signup" element={<AuthForm type={"signup"} />}></Route>
        <Route path="/all-event" element={<AllEvents />}></Route>
      </Route>
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
    </div>
  );
}

export default App;
