import React, {useState} from "react";
import {PieceEnum} from "../shared/types";
import {Field} from "./Field";

interface BoardProps {
    board:FieldElement[][]

}
export type FieldElement = {piece:PieceEnum, color:string};

const order = [ PieceEnum.Rook , PieceEnum.Knight, PieceEnum.Bishop, PieceEnum.King, PieceEnum.Queen, PieceEnum.Bishop,
    PieceEnum.Knight, PieceEnum.Rook ];

const [ boardState, setBoardState ] = useState<FieldElement[][]>([
    [ ...order.map( f=> ({ piece: f, color: 'black' }) ) ],
    [ ...Array(8).fill( {piece: PieceEnum.Pawn, color: 'black'} ) ],
    ...Array(4).fill( Array(8).fill( {piece: PieceEnum.Empty, color: ''} ) ),
    [ ...Array(8).fill( {piece: PieceEnum.Pawn, color: 'white'} ) ],
    [ ...order.map( f=> ({ piece: f, color: 'white' }) ) ],
])



export const Board : React.FC<BoardProps> = ({board}) => {
    const [ boardState, setBoardState ] = useState<FieldElement[][]>()
    return (
        <div className="board">
            {
                board.map(
                    row => (
                        <div className="row">
                            {
                                row.map( field => ( <Field piece={field.piece} color={field.color} /> ))
                            }
                        </div>
                    )
                )
            }
        </div>
    );
}