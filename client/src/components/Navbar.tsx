import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import {AuthState} from "../shared/providers/AuthProvider";

interface NavbarProps {
}

export const Navbar: React.FC<NavbarProps> = ({}) => {
    const {user, logout} = useContext(AuthState);
    return (
        <nav>
            <div className={window.location.pathname === "/about" || window.location.pathname === "/" ? "current" : ""}>
                <Link to={window.location.pathname !== "/game" ? "/about" : "#"} > About </Link>
            </div>
            {user ? <div className={window.location.pathname === "/ranking"? "current" : ""}> <Link to={window.location.pathname !== "/game" ? "/ranking" : "#"}> Ranking</Link> </div> : null}
            {user ? <div className={window.location.pathname === "/friends"? "current" : ""}> <Link to={window.location.pathname !== "/game" ? "/friends" : "#"}> Friends </Link> </div> : null}
            {user ? null : <div className={window.location.pathname === "/login"? "current" : ""}> <Link to={window.location.pathname !== "/game" ? "/login" : "#"}> Log in </Link> </div>}
            {user ? null : <div className={window.location.pathname === "/register"? "current" : ""}> <Link to={window.location.pathname !== "/game" ? "/register" : "#"}> Register </Link> </div>}
            {user ? <div className={window.location.pathname === "/profile"? "current" : ""}> <Link to={window.location.pathname !== "/game" ? "/profile" : "#"}> Profile </Link> </div> : null}
            {user ? <div>{user?.username}</div> : null}
            {user ? <div onClick={window.location.pathname !== "/game" ? logout : ()=>{}}>Log out</div> : null}
            {/*<div> <Link to="/asdfe"> Error </Link> </div>*/}
        </nav>
    )
}
