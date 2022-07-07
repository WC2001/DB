import React, {useState} from 'react';
import './App.css';

import {Home, About, Error, Login, Register, Friends, Profile} from './pages'

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { Navbar } from "./components";
import {Provider} from "./shared/providers";
import {GameReview} from "./pages/GameReview";
import {Ranking} from "./pages/Ranking";







function App() {
  // const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>|null>(null);
  const [ routes, setRoutes ] = useState<{path: string, element: JSX.Element}[]>([
      { path: '/about', element: <About /> },
      { path: '/login', element:<Login />},
      { path: '/register', element:<Register />},
      { path: '/friends', element:<Friends />},
      { path: '/profile', element:<Profile />},
      { path: '/review', element: <GameReview/>},
      { path: '/game', element: <Home />},
      { path: '/ranking', element: <Ranking/>},
      { path: '/',      element: <About /> },
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
