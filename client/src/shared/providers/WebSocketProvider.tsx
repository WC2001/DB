import React, {createContext, JSXElementConstructor, ReactElement, useEffect, useState} from 'react';
import io, {Socket} from "socket.io-client";
import {ClientToServerEvents, ServerToClientEvents} from "../types";

interface WebSocketProverProps {
    children:ReactElement<any, string | JSXElementConstructor<any>>
}

export type SocketState = Socket<ServerToClientEvents, ClientToServerEvents> | null;


export const WebsocketState = createContext<SocketState>(null);


export const WebSocketProvider: React.FC<WebSocketProverProps> = ({children}) => {
    const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>|null>(null);

    useEffect(() => {
        const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(`http://localgithost:3001`);
        setSocket(newSocket);

        return () => {
            newSocket.close()
        };
    }, [setSocket]);

    return (
        <WebsocketState.Provider value={socket}>
            { children }
        </WebsocketState.Provider>
    )
}