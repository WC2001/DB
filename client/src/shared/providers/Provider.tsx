import React, {JSXElementConstructor, ReactElement} from 'react';
import {WebSocketProvider} from "./WebSocketProvider";
import {AuthProvider} from "./AuthProvider";

interface ProviderProps {
    children:ReactElement<any, string | JSXElementConstructor<any>>
}

export const Provider: React.FC<ProviderProps> = ({children}) => {
    return (
        <WebSocketProvider>
            <AuthProvider>
                { children }
            </AuthProvider>
        </WebSocketProvider>
    )
}
