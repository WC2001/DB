import React, {useContext, useEffect} from "react";
import './styles/Home.css'
import {WebsocketState} from "../shared/providers";
import {Board} from "../components";

interface HomeProps {
}


export const Home : React.FC<HomeProps> = ({}) => {
    const { socket } = useContext(WebsocketState);

    useEffect( ()=> {
        // @ts-ignore
        console.log(socket)
    },[socket] )

    return (
        <main>
            <Board />
        </main>
    )
}
