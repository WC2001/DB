import {Board} from "./Board";

export type MessagePayload = {
     message: string
     player: string,
     game: string
}

export type PlayerMovePayload = {
    player: string,
    board: Board,
    game: string
}

export interface ClientToServerEvents {
    message: (payload: MessagePayload)=> void;
    create_game: (game: string)=> void;
    request_game: (data:{user:string, game:string})=>void;
}
export interface ServerToClientEvents {
    message: (payload: MessagePayload)=> void;
    player_move: (payload: PlayerMovePayload)=> void;
    gameover: ()=> void;
}
