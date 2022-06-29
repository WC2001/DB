import React, {createContext, JSXElementConstructor, ReactElement, useContext, useEffect, useState} from 'react';
import io, {Socket} from "socket.io-client";
import {Board, ClientToServerEvents, ServerToClientEvents} from "../types";
import {AuthState} from "./AuthProvider";

interface WebSocketProverProps {
    children:ReactElement<any, string | JSXElementConstructor<any>>
}

// export type SocketState = Socket<ServerToClientEvents, ClientToServerEvents> | null;


export type SocketState = {
    socket : Socket<ServerToClientEvents, ClientToServerEvents>|null,
    messages? : {message: string, username: string}[],
    setMessages? : Function,
    setRoom? : Function,
    board?: Board,
    room? : string,
    rooms? : string[]
};


export const WebsocketState = createContext<SocketState>({
    socket: {} as Socket,
    messages: [],
    setMessages: ()=>{},
    setRoom: ()=> {},
    rooms: [],
    room: ''
});


export const WebSocketProvider: React.FC<WebSocketProverProps> = ({children}) => {

    const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>|null>(null);
    const { user } = useContext(AuthState);
    const [room, setRoom] = useState<string>('')
    const [rooms, setRooms] = useState<string[]>([])
    const [messages, setMessages] = useState<{message: string, username: string}[]>([])



    useEffect(() => {
        const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(`http://localhost:3002`);
        setSocket(newSocket);

        return () => {
            newSocket.close()
        };
    }, [setSocket]);

    // socket?.on('')


    // socket.on(EVENTS.SERVER.ROOMS, (value) => {
    //     setRooms(value);
    // });
    //
    // socket.on(EVENTS.SERVER.JOINED_ROOM, (value) => {
    //     setRoomId(value);
    //
    //     setMessages([]);
    // });


    return (
        <WebsocketState.Provider value={{
            socket,
            room,
            rooms,
            messages,
            setMessages,
            setRoom
        }}>
            { children }
        </WebsocketState.Provider>
    )
}
