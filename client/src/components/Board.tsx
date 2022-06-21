import React, {useContext, useState} from "react";
import {PieceEnum} from "../shared/types";
import {Field} from "./Field";
import {WebsocketState} from "../shared/providers";

interface BoardProps {
    // board:FieldElement[][]
}

export type FieldElement = {piece:PieceEnum, color:string, state:string};


export const Board : React.FC<BoardProps> = ({}) => {
    const socket = useContext(WebsocketState);

    const order = [ PieceEnum.Rook , PieceEnum.Knight, PieceEnum.Bishop, PieceEnum.King, PieceEnum.Queen, PieceEnum.Bishop,
        PieceEnum.Knight, PieceEnum.Rook ];
    const order1 = [PieceEnum.Empty, PieceEnum.Empty, PieceEnum.Empty, PieceEnum.Empty, PieceEnum.Empty,
        PieceEnum.Empty, PieceEnum.Empty, PieceEnum.Empty];
    const order2 = [PieceEnum.Pawn, PieceEnum.Pawn, PieceEnum.Pawn, PieceEnum.Pawn, PieceEnum.Pawn, PieceEnum.Pawn,
        PieceEnum.Pawn, PieceEnum.Pawn]

    const getKings = ()=>{
        let wKing = {x:0,y:0};
        let bKing = {x:0,y:0};
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                if(boardState[i][j].piece === PieceEnum.King){
                    if(boardState[i][j].color === 'white'){
                        wKing.x = i;
                        wKing.y = j;
                    }else{
                        bKing.x = i;
                        bKing.y = j;
                    }
                }
            }
        }
        return {white_king:wKing, black_king:bKing}
    }

    let [ boardState, setBoardState ] = useState<FieldElement[][]>([
        [ ...order.map( f=> ({ piece: f, color: 'black', state:'initial' }) ) ],
        [ ...order2.map( f=> ({ piece: f, color: 'black', state:'initial' }) ) ],
        [...order1.map( f=> ({ piece: f, color: '', state:'initial' }) )],
        [...order1.map( f=> ({ piece: f, color: '', state:'initial' }) )],
        [...order1.map( f=> ({ piece: f, color: '', state:'initial' }) )],
        [...order1.map( f=> ({ piece: f, color: '', state:'initial' }) )],
        [ ...order2.map( f=> ({ piece: f, color: 'white', state:'initial' }) ) ],
        [ ...order.map( f=> ({ piece: f, color: 'white', state:'initial' }) ) ],
    ])


    return (
        <div className="board">
            {
                boardState.map(
                    (row, rowID) => (
                        <div key={rowID} className="row">
                            {
                                row.map( (field, colID) => ( <Field key={ `${rowID}-${colID}` }
                                                                    stateUpdate={(board:FieldElement[][])=>setBoardState(()=>board)}
                                                                    piece={field.piece}
                                                                    color={field.color}
                                                                    blackField={ (rowID+colID)%2===0 }
                                                                    possible = { boardState[rowID][colID].state === 'possible'}
                                                                    board={boardState}
                                                                    kings={getKings()}
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
