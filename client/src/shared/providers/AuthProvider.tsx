import React, {createContext, JSXElementConstructor, ReactElement, useContext, useEffect, useState} from 'react';
import {User} from "../types";
import {useStorage} from "../hooks";
import { ToastContainer, toast } from 'react-toastify';
import {
    Routes,
    Route,
    Link,
    useNavigate,
} from 'react-router-dom';
import {json} from "stream/consumers";
import {WebsocketState} from "./WebSocketProvider";

interface AuthProviderProps {
    children:ReactElement<any, string | JSXElementConstructor<any>>
}

export const AuthState = createContext<{
   user: User|null,
   login: (data: User)=> void,
   logout: ()=> void
}>({ user: null, login: ()=> {}, logout: ()=> {} });
export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [ user, setUser ] = useStorage<User|null>('session', null);
    // const [ user, setUser ] = useState<User|null>(null);
    const {refreshMoves} = useContext(WebsocketState);
    const notify = (text:string) => toast(text);
    const navigate = useNavigate();
    useEffect(()=>{
        const sessionBlob = window.sessionStorage.getItem('session');
        if(sessionBlob){
            setUser(JSON.parse(sessionBlob));
        }
    }, [])
    return (
        <AuthState.Provider value={{
            user: user,
            login: async ( data: User )=> {
                const res = await fetch( 'http://localhost:3002/user/login', {
                    method: 'POST',
                    headers: {  'Content-Type': 'application/json' },
                    body: JSON.stringify({username:data.username, password:data.password} )
                });
                const json  = await res.json();
                console.log(json);
                setUser({username:json.data[0].username, password:json.data[0].password});
                notify(json);
                setTimeout(()=>{

                    navigate('/friends');
                }, 3000);
            },
            logout: async () => {
                await refreshMoves();
                setUser(null);
                navigate('/login');
            }
        }}>
            { children }
        </AuthState.Provider>
    )
}
