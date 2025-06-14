import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Registration } from "./pages/Registration";
import { Navbar } from "./components/Navbar";

const routes = [
  { path: "/", element: <Home />, navbar: true },
  { path: "/login", element: <Login />, navbar: true },
  { path: "/registration", element: <Registration />, navbar: true }
];

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                <>
                  {route.navbar && <Navbar />}
                  {route.element}
                </>
              }
            />
          ))}
        </Routes>
      </div>
    </Router>
  )
}

export default App
