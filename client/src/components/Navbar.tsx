import React from 'react';
import {Link} from "react-router-dom";

interface NavbarProps {
}

export const Navbar: React.FC<NavbarProps> = ({}) => {
    return (
        <nav>
            <div> <Link to="/"> Home </Link> </div>
            <div> <Link to="/about"> About </Link> </div>
            <div> <Link to="/login"> Log in </Link> </div>
            {/*<div> <Link to="/asdfe"> Error </Link> </div>*/}
        </nav>
    )
}