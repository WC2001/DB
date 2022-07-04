import React, {useContext, useState} from "react";
import {PieceEnum} from "../shared/types";
import {Field} from "./Field";
import {currentGame, WebsocketState} from "../shared/providers";
import {AuthState} from "../shared/providers/AuthProvider";

interface BoardProps {

}

export type FieldElement = {piece:PieceEnum, color:string, state:string};


export const Board : React.FC<BoardProps> = ({}) => {
    const socket = useContext(WebsocketState);
    const {user} = useContext(AuthState);
    const {currentId, currentMoves} = useContext(currentGame);
    console.log(currentId);

    const playerColor:string = user?.username === currentId?.split('-')[0] ? 'white' : 'black';

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
