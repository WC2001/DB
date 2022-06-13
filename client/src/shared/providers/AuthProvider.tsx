import React, {createContext, JSXElementConstructor, ReactElement, useState} from 'react';
import {User} from "../types";
import {useStorage} from "../hooks";

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
    return (
        <AuthState.Provider value={{
            user: user,
            login: async ( data: User )=> {
                const res = await fetch( 'http://localhost:3000/user/login', {
                    method: 'POST',
                    headers: {  'Content-Type': 'application/json' },
                    body: JSON.stringify( data )
                });
                const json  = await res.json();
                setUser(json);
            },
            logout: async () => {
                setUser(null);
            }
        }}>
            { children }
        </AuthState.Provider>
    )
}
