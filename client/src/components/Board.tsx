import React, {useContext, useState} from "react";
import {PieceEnum} from "../shared/types";
import {Field} from "./Field";
import {WebsocketState} from "../shared/providers";
import {AuthState} from "../shared/providers/AuthProvider";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom';

interface BoardProps {
}

export type FieldElement = {piece:PieceEnum, color:string, state:string};


export const Board : React.FC<BoardProps> = ({}) => {
    const {socket, currentGame, currentMoves, addMove, refreshMoves} = useContext(WebsocketState);
    const {user} = useContext(AuthState);
    const navigate = useNavigate();
    const notify = (text:string) => toast(text);

    console.log(currentGame);



    const playerColor:string = user?.username === currentGame?.split('-')[0] ? 'white' : 'black';

    const order = playerColor === 'white' ? [ PieceEnum.Rook , PieceEnum.Knight, PieceEnum.Bishop, PieceEnum.Queen,
        PieceEnum.King, PieceEnum.Bishop, PieceEnum.Knight, PieceEnum.Rook ] :
        [ PieceEnum.Rook , PieceEnum.Knight, PieceEnum.Bishop, PieceEnum.King,
            PieceEnum.Queen, PieceEnum.Bishop, PieceEnum.Knight, PieceEnum.Rook ];
    const order1 = [PieceEnum.Empty, PieceEnum.Empty, PieceEnum.Empty, PieceEnum.Empty, PieceEnum.Empty,
        PieceEnum.Empty, PieceEnum.Empty, PieceEnum.Empty];
    const order2 = [PieceEnum.Pawn, PieceEnum.Pawn, PieceEnum.Pawn, PieceEnum.Pawn, PieceEnum.Pawn, PieceEnum.Pawn,
        PieceEnum.Pawn, PieceEnum.Pawn]

    const [kingsPositions, setKingsPositions] = useState<{white_king:{x:number,y:number}, black_king:{x:number, y:number}}>(
        playerColor === 'white' ?
        {white_king:{x:7,y:4}, black_king:{x:0,y:4}} :
        {white_king:{x:0,y:3}, black_king:{x:7,y:3}}
    )
    const [turn, setTurn] = useState<boolean>(playerColor === 'white');

    const oppositeColor = (color:string) :string=> {
        return color==='white' ? 'black' : 'white';
    }

    socket?.off('player_move').on('player_move', ({moves, game})=>{
        if(currentGame === game){
            addMove(moves[moves.length - 1]);
            let split = moves[moves.length-1].split('-');
            let field1 = getField(split[0]);
            let field2 = getField(split[1]);
            console.log(moves);
            console.log('field1:', field1);
            console.log('field2:', field2);
            console.log('move');
            move({x:field1.x,y:field1.y}, {x:field2.x, y:field2.y});
            setTurn(true);

        }
    });

    socket?.off('game_over').on('game_over', game=>{
        if(currentGame === game){
            refreshMoves();
            notify('You lost.')
            setTimeout(()=>{
                navigate('/friends')
            }, 10000);
        }
    })


    const [ boardState, setBoardState ] = useState<FieldElement[][]>([
        [ ...order.map( f=> ({ piece: f, color: oppositeColor(playerColor), state:'initial' }) ) ],
        [ ...order2.map( f=> ({ piece: f, color: oppositeColor(playerColor), state:'initial' }) ) ],
        [...order1.map( f=> ({ piece: f, color: '', state:'initial' }) )],
        [...order1.map( f=> ({ piece: f, color: '', state:'initial' }) )],
        [...order1.map( f=> ({ piece: f, color: '', state:'initial' }) )],
        [...order1.map( f=> ({ piece: f, color: '', state:'initial' }) )],
        [ ...order2.map( f=> ({ piece: f, color: playerColor, state:'initial' }) ) ],
        [ ...order.map( f=> ({ piece: f, color: playerColor, state:'initial' }) ) ],
    ])

    const getField=(label:string)=>{
        let list = playerColor === 'white' ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] :
            ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
        let column:number = 0;
        list.forEach((elem, i)=>{
            if(label[0] === elem){
                column = i;
            }
        })
        let row = playerColor === 'white' ? 8 - +label[1] : +label[1] - 1;

        return {x:row, y: column};

    }

    let move = (from:{x:number,y:number}, to:{x:number, y:number})=>{
        const board = [...boardState];
        let piece:PieceEnum = board[from.x][from.y].piece;
        const color:string = board[from.x][from.y].color;
        board[to.x][to.y] = {piece:piece, color:color, state:'initial'};
        board[from.x][from.y] = {piece:PieceEnum.Empty, color:'', state:'initial'};
        if(piece === PieceEnum.King){
            setKingsPositions( color==='white' ? {white_king:{x:to.x,y:to.y},
                black_king: {x:kingsPositions.black_king.x, y: kingsPositions.black_king.y}} :
                {white_king:{x:kingsPositions.white_king.x, y: kingsPositions.white_king.y},
                    black_king:{x:to.x, y:to.y}});
        }
        setBoardState(board);
    }

    return (
        <div className="board">
            <ToastContainer/>
            {
                boardState.map(
                    (row, rowID) => (
                        <div key={rowID} className="row">
                            {
                                row.map( (field, colID) => ( <Field key={ `${rowID}-${colID}` }
                                                                    stateUpdate={(board:FieldElement[][])=>setBoardState([...board])}
                                                                    blackField={ (rowID+colID)%2===0 }
                                                                    board={boardState}
                                                                    kings={kingsPositions}
                                                                    turn={turn}
                                                                    turnUpdate={(turn:boolean)=>setTurn(turn)}
                                                                    kingsUpdate={(kings:{white_king:{x:number,y:number},
                                                                        black_king:{x:number, y:number}})=>setKingsPositions(kings)}
                                                                    x={rowID}
                                                                    y={colID} /> ))
                            }
                        </div>
                    )
                )
            }
        </div>
    );
}
