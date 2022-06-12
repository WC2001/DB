import React, {useContext, useEffect, useState} from "react";
import {WebsocketState} from "../shared/providers";
import {Board, FieldElement} from "../components";
import {PieceEnum} from "../shared/types";

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
            <Board board={boardState}/>
        </main>
    )
}