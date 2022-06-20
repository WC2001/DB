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

    const [ boardState, setBoardState ] = useState<FieldElement[][]>([
        [ ...order.map( f=> ({ piece: f, color: 'black', state:'initial' }) ) ],
        [ ...Array(8).fill( {piece: PieceEnum.Pawn, color: 'black', state:'initial'} ) ],
        ...Array(4).fill( Array(8).fill( {piece: PieceEnum.Empty, color: '', state:'initial'} ) ),
        [ ...Array(8).fill( {piece: PieceEnum.Pawn, color: 'white', state:'initial'} ) ],
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
