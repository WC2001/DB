import React, {createContext, JSXElementConstructor, ReactElement, useContext, useEffect, useState} from 'react';
import io, {Socket} from "socket.io-client";
import {Board, ClientToServerEvents, ServerToClientEvents} from "../types";
import {AuthState} from "./AuthProvider";
import {useNavigate} from "react-router-dom";

interface WebSocketProverProps {
    children:ReactElement<any, string | JSXElementConstructor<any>>
}

// export type SocketState = Socket<ServerToClientEvents, ClientToServerEvents> | null;
export type Game = {
    _id: string,
    id: string,
    white:string,
    black:string,
    winner:string,
    draw:boolean,
    moves:string[],
    started:boolean
}


export type SocketState = {
    socket : Socket<ServerToClientEvents, ClientToServerEvents>|null,
    messages? : {message: string, username: string}[],
    setMessages? : Function,
    setRoom? : Function,
    board?: Board,
    room? : string,
    rooms? : string[]
    currentGame: string,
    currentMoves: string[],
    addMove: (move:string)=>void;
    refreshMoves: ()=>void;
    chosenGame:Game,
    chooseGame: (game:Game)=>void
    refreshChosen:()=>void
};


export const WebsocketState = createContext<SocketState>({
    socket: {} as Socket,
    messages: [],
    setMessages: ()=>{},
    setRoom: ()=> {},
    rooms: [],
    room: '',
    currentGame:'',
    currentMoves:[],
    addMove:(move:string)=>{},
    refreshMoves:()=>{},
    chosenGame:{_id:'', id:'', winner:'', draw:false, moves:[], started:false, white:'', black:''},
    chooseGame: (game:Game)=>{},
    refreshChosen: ()=> {},

});




export const WebSocketProvider: React.FC<WebSocketProverProps> = ({children}) => {

    const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>|null>(null);
    const { user } = useContext(AuthState);
    const [currentGame, setCurrentGame] = useState<string>('');
    const [currentMoves, setCurrentMoves] = useState<string[]>([]);
    const [room, setRoom] = useState<string>('')
    const [rooms, setRooms] = useState<string[]>([])
    const [messages, setMessages] = useState<{message: string, username: string}[]>([])
    const [chosenGame, setChosenGame] = useState<Game>({_id:'', id:'', white:'', black:'', winner:'',
        started:false, draw:false, moves:[]});

    const navigate = useNavigate();


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
    const chooseGame = (game:Game)=>{
        setChosenGame(game);
        navigate('/review');
    }
    const refreshChosen = () =>{
        setChosenGame({_id:'', id:'', winner:'', draw:false, moves:[], started:false, white:'', black:''});
        navigate('/profile');
    }

    const addMove = (move:string)=>{
        currentMoves.push(move);
        setCurrentMoves(currentMoves);
    }
    const refreshMoves = async ()=>{
        console.log('refreshing');
        setCurrentMoves([]);
        setCurrentGame('');
    }

    socket?.off('request_game').on('request_game', (data)=>{
        console.log(data.user);
        const invitingPerson = data.game.split('-')[0];
        if(user?.username === data.user){
            if(window.confirm(`Accept invitation from ${invitingPerson}.`)){
                socket?.emit('start_game', {user1:invitingPerson, user2:user?.username, game:data.game});
                socket?.emit('add_to_game', {user:user?.username, game:data.game});
                setCurrentGame(data.game);
                setTimeout(()=>{

                    navigate('/');
                }, 2000);
                console.log(currentGame);

            }
            else{
                socket?.emit('cancel_game', data.game);
                console.log('Rejected.');
            }
        }
        //window.confirm(`Accept invitation from ${invitingPerson}.`);
        //console.log('Invited.');
    });

    socket?.on('start_game', (data)=>{
        setCurrentGame(data.game);
        setTimeout(()=>{

            navigate('/');
        }, 2000);
        console.log(currentGame);
    })


    return (
        <WebsocketState.Provider value={{
            socket,
            room,
            rooms,
            messages,
            setMessages,
            setRoom,
            currentMoves,
            currentGame,
            chosenGame,
            addMove,
            refreshMoves,
            refreshChosen,
            chooseGame,
        }}>
            { children }
        </WebsocketState.Provider>
    )
}
