import React, {useContext, useMemo, useState} from "react";
import {PieceEnum} from "../shared/types";
import {Field} from "./Field";
import {WebsocketState} from "../shared/providers";
import {AuthState} from "../shared/providers/AuthProvider";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom';
import {FieldElement} from "./Board";
import {ReviewField} from "./ReviewField";

interface ReviewBoardProps {
}

class BoardReview{
    boardArray: FieldElement[][][];

    constructor(moves:string[], color:string, initial:FieldElement[][]) {
        this.boardArray = [];
        this.boardArray.push(initial);
        moves.forEach((move)=>{
            let split = move.split('-');
            this.move({x:this.getLabel(split[0], color).x, y:this.getLabel(split[0], color).y},
                {x:this.getLabel(split[1], color).x, y:this.getLabel(split[1], color).y},
                [...this.boardArray[this.boardArray.length-1]]);
        })
    }

    getLabel(move:string, color:string):{x:number,y:number}{
        let list = color === 'white' ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] :
            ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
        let column:number = 0;
        list.forEach((elem, i)=>{
            if(move[0] === elem){
                column = i;
            }
        })
        let row = color === 'white' ? 8 - +move[1] : +move[1] - 1;

        return {x:row, y: column};
    }

    move (from:{x:number,y:number}, to:{x:number, y:number}, last: FieldElement[][]){
        let board = last.map((row)=>row.slice());
        let piece:PieceEnum = board[from.x][from.y].piece;
        const color:string = board[from.x][from.y].color;
        board[to.x][to.y] = {piece:piece, color:color, state:'initial'};
        board[from.x][from.y] = {piece:PieceEnum.Empty, color:'', state:'initial'};
        this.boardArray.push(board);
    }

}

export const ReviewBoard: React.FC<ReviewBoardProps> = ({}) => {

    const {user} = useContext(AuthState);
    const {chosenGame, refreshChosen} = useContext(WebsocketState);
    const navigate = useNavigate();
    const playerColor = chosenGame.white === user?.username ? 'white' : 'black';

    console.log('review:', chosenGame);

    const order = playerColor === 'white' ? [ PieceEnum.Rook , PieceEnum.Knight, PieceEnum.Bishop, PieceEnum.Queen,
            PieceEnum.King, PieceEnum.Bishop, PieceEnum.Knight, PieceEnum.Rook ] :
        [ PieceEnum.Rook , PieceEnum.Knight, PieceEnum.Bishop, PieceEnum.King,
            PieceEnum.Queen, PieceEnum.Bishop, PieceEnum.Knight, PieceEnum.Rook ];
    const order1 = [PieceEnum.Empty, PieceEnum.Empty, PieceEnum.Empty, PieceEnum.Empty, PieceEnum.Empty,
        PieceEnum.Empty, PieceEnum.Empty, PieceEnum.Empty];
    const order2 = [PieceEnum.Pawn, PieceEnum.Pawn, PieceEnum.Pawn, PieceEnum.Pawn, PieceEnum.Pawn, PieceEnum.Pawn,
        PieceEnum.Pawn, PieceEnum.Pawn]

    const oppositeColor = (color:string) :string=> {
        return color==='white' ? 'black' : 'white';
    }

    const [currentMove, setCurrentMove] = useState<number>(0);

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
    const boardReviewArray = new BoardReview(chosenGame.moves, playerColor, boardState);
    console.log(boardReviewArray.boardArray[currentMove]);

    return (
        <div className="container">
            <div className="board">
                <ToastContainer/>
                {
                    boardReviewArray.boardArray[currentMove].map(
                        (row, rowID) => (
                            <div key={rowID} className="row">
                                {
                                    row.map( (field, colID) => ( <ReviewField key={ `${rowID}-${colID}` }
                                                                              blackField={ (rowID+colID)%2===0 }
                                                                              board={boardReviewArray.boardArray[currentMove]}
                                                                              x={rowID}
                                                                              y={colID} /> ))
                                }
                            </div>
                        )
                    )
                }

            </div>
            <div className="buttons">
                <button onClick={()=>{
                    setCurrentMove(currentMove-1);
                    console.log('prev')
                }} disabled={currentMove===0}>Previous</button>
                <button onClick={()=>{
                    setCurrentMove(currentMove+1);
                }} disabled={currentMove===boardReviewArray.boardArray.length-1}>Next</button>
                <button onClick={()=>{
                    refreshChosen();
                }}>Go back</button>
            </div>
        </div>



    )
}