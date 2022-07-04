import React, {useContext, useState} from "react";
import {PieceEnum} from "../shared/types";
import {Field} from "./Field";
import {WebsocketState} from "../shared/providers";
import {AuthState} from "../shared/providers/AuthProvider";

interface BoardProps {

}

export type FieldElement = {piece:PieceEnum, color:string, state:string};


export const Board : React.FC<BoardProps> = ({}) => {
    const {socket, currentGame, currentMoves} = useContext(WebsocketState);
    const {user} = useContext(AuthState);

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
        {white_king:{x:7,y:4}, black_king:{x:0,y:4}}
    )

    const oppositeColor = (color:string) :string=> {
        return color==='white' ? 'black' : 'white';
    }

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
    console.log(getField('a1'));
    console.log(getField('h3'));
    let a = 0;

    const move = (from:{x:number,y:number}, to:{x:number, y:number})=>{
        let piece:PieceEnum = boardState[from.x][from.y].piece;
        const color:string = boardState[from.x][from.y].color;
        boardState[to.x][to.y] = {piece:piece, color:color, state:'initial'};
        boardState[from.x][from.y] = {piece:PieceEnum.Empty, color:'', state:'initial'};
        console.log('piece:',piece);
    }
    /*if(a === 0){
        move(getField('a2'), getField('a3'));
        a += 1;
    }*/



    return (
        <div className="board">
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
