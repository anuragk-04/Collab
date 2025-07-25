import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Registration } from "./pages/Registration";
import { Navbar } from "./components/Navbar";
import { RoomsPage } from "./pages/RoomsPage";
import { RoomPage } from "./pages/RoomPage";
import { Profile } from "./pages/ProfilePage";


const routes = [
  { path: "/", element: <Login />, navbar: true },
  { path: "/login", element: <Login />, navbar: true },
  { path: "/registration", element: <Registration />, navbar: true },
  { path: "/rooms", element: <RoomsPage />, navbar: false },
  { path: "/room/:roomId", element: <RoomPage />, navbar: false },
  { path: "/profile", element: <Profile />,  navbar: false}
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
