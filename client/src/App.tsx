import React, {useEffect, useState} from 'react';
import './App.css';
import io, {Socket} from 'socket.io-client';

import {Home, About, Error, Login, Register} from './pages'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { Navbar } from "./components";
import {ClientToServerEvents, ServerToClientEvents} from "./shared/types";
import {Provider} from "./shared/providers";






function App() {
  // const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>|null>(null);
  const [ routes, setRoutes ] = useState<{path: string, element: JSX.Element}[]>([
      { path: '/about', element: <About /> },
      { path: '/login', element:<Login />},
      { path: '/register', element:<Register />},
      { path: '/',      element: <Home /> },
      { path: '*',      element: <Error /> },
  ])


  return (
      <Router>
          <Provider>
            <>
                <Navbar />
                <Routes>
                    {
                        routes.map( (r,index) => ( <Route key={index} path={r.path} element={r.element} />) )
                    }
                    <Route path="/" element={<Home/>} />
                </Routes>
            </>
          </Provider>
      </Router>


  );
}

export default App;
