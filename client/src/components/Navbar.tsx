import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import {AuthState} from "../shared/providers/AuthProvider";

interface NavbarProps {
}

export const Navbar: React.FC<NavbarProps> = ({}) => {
    const {user, logout} = useContext(AuthState);
    return (
        <nav>
            <div> <Link to="/"> Home </Link> </div>
            <div> <Link to="/about"> About </Link> </div>
            {user ? <div> <Link to="/friends"> Friends </Link> </div> : null}
            {user ? null : <div> <Link to="/login"> Log in </Link> </div>}
            {user ? null : <div> <Link to="/register"> Register </Link> </div>}
            {user ? <div> <Link to="/profile"> Profile </Link> </div> : null}
            {user ? <div onClick={logout}>Log out</div> : null}
            {/*<div> <Link to="/asdfe"> Error </Link> </div>*/}
        </nav>
    )
}
