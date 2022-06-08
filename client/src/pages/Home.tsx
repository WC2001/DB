import React, {useContext, useEffect} from "react";
import {WebsocketState} from "../shared/providers";

interface HomeProps {
}

export const Home : React.FC<HomeProps> = ({}) => {
    const socket = useContext(WebsocketState);

    useEffect( ()=> {
        // @ts-ignore
        socket?.emit("message", { message: 'xd' , game: 'xxx', player: 'xyz' })
        console.log(socket)
        console.log('xd')
    },[] )

    return (
        <main>
            <h1> Login </h1>
        </main>
    )
}