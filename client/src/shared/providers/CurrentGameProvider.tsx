import React, {createContext, JSXElementConstructor, ReactElement, useEffect, useState} from 'react';
import {useStorage} from "../hooks";
import { ToastContainer, toast } from 'react-toastify';
import {
    Routes,
    Route,
    Link,
    useNavigate,
} from 'react-router-dom';

interface CurrentGameProviderProps {
    children:ReactElement<any, string | JSXElementConstructor<any>>
}

export const currentGame = createContext<{
    currentId : string|null,
    currentMoves: string[]
    init: (data:string)=>void;
    refresh: ()=>void;
    addMove: (move:string)=>void;
}>({currentId:null,currentMoves:[],init:()=>{}, addMove:(move:string)=>{}, refresh:()=>{}});

export const CurrentGameProvider: React.FC<CurrentGameProviderProps> = ({children}) => {
    const [game,setGame] = useStorage<string|null>('currentGame', null);
    const [moves, setMoves] = useStorage<string[]>('moves', []);
    const navigate = useNavigate();

    useEffect(()=>{
        const sessionBlob = window.sessionStorage.getItem('currentGame');
        if(sessionBlob){
            setGame(JSON.parse(sessionBlob));

        }
    }, [])

    return (
        <currentGame.Provider value={{
            currentId: game,
            currentMoves: moves,
            refresh: async ()=> {
                setGame(null);
                setMoves([]);
            },
            init: async (data)=>{
                setGame(data);
            },
            addMove: async (move:string)=>{
                currentGame.Provider.arguments.currentMoves.push(move);
                setMoves(currentGame.Provider.arguments.currentMoves);
            }
        }}>
            {children}
        </currentGame.Provider>
    )
}