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
    start_game: (data:{user1:string, user2:string, game:string})=>void;
    add_to_game: (data:{user:string, game:string})=>void;
    cancel_game: (game:string)=>void;
}
export interface ServerToClientEvents {
    request_game: (data:{user:string, game:string})=>void;
    message: (payload: MessagePayload)=> void;
    player_move: (payload: PlayerMovePayload)=> void;
    start_game: (data:{user1:string, user2:string, game:string})=>void;
    gameover: ()=> void;
}
