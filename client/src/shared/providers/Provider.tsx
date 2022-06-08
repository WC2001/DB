import React, {JSXElementConstructor, ReactElement} from 'react';
import {WebSocketProvider} from "./WebSocketProvider";

interface ProviderProps {
    children:ReactElement<any, string | JSXElementConstructor<any>>
}

export const Provider: React.FC<ProviderProps> = ({children}) => {
    return (
        <WebSocketProvider>
            { children }
        </WebSocketProvider>
    )
}