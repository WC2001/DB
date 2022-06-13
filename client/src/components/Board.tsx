import React, {useContext, useState} from "react";
import {PieceEnum} from "../shared/types";
import {Field} from "./Field";
import {WebsocketState} from "../shared/providers";

interface BoardProps {
    // board:FieldElement[][]
}

export type FieldElement = {piece:PieceEnum, color:string};


export const Board : React.FC<BoardProps> = ({}) => {
    const socket = useContext(WebsocketState);

    const order = [ PieceEnum.Rook , PieceEnum.Knight, PieceEnum.Bishop, PieceEnum.King, PieceEnum.Queen, PieceEnum.Bishop,
        PieceEnum.Knight, PieceEnum.Rook ];

    const [ boardState, setBoardState ] = useState<FieldElement[][]>([
        [ ...order.map( f=> ({ piece: f, color: 'black' }) ) ],
        [ ...Array(8).fill( {piece: PieceEnum.Pawn, color: 'black'} ) ],
        ...Array(4).fill( Array(8).fill( {piece: PieceEnum.Empty, color: ''} ) ),
        [ ...Array(8).fill( {piece: PieceEnum.Pawn, color: 'white'} ) ],
        [ ...order.map( f=> ({ piece: f, color: 'white' }) ) ],
    ])

    return (
        <div className="board">
            {
                boardState.map(
                    (row, rowID) => (
                        <div key={rowID} className="row">
                            {
                                row.map( (field, colID) => ( <Field key={ `${rowID}-${colID}` } piece={field.piece} color={field.color} blackField={ (rowID+colID)%2==0 } /> ))
                            }
                        </div>
                    )
                )
            }
        </div>
    );
}
