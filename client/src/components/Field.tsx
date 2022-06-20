import React from "react";
import {PieceEnum} from "../shared/types";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faChessBishop,
    faChessKing,
    faChessKnight,
    faChessPawn,
    faChessQueen,
    faChessRook
} from "@fortawesome/free-solid-svg-icons";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {FieldElement} from "./Board";

interface FieldProps {
    piece:PieceEnum;
    color:string;
    blackField?: boolean;
    board: FieldElement[][];
    x:number;
    y:number;
    possible:boolean;
    stateUpdate: (board: FieldElement[][])=>void;
}

export const Field : React.FC<FieldProps> = ({piece, color, blackField,board,x,y, stateUpdate, possible}) => {
    const iconsMap = new Map<string, IconDefinition>([
        ["pawn", faChessPawn],
        ["king", faChessKing],
        ["queen", faChessQueen],
        ["bishop", faChessBishop],
        ["knight", faChessKnight],
        ["rook", faChessRook]
    ])
    const validField=(x:number, y:number)=>{
        return !(x >= 8 || y >= 8 || x < 0 || y < 0);
    }
    const Knight=(board:FieldElement[][], x:number, y:number, color:string)=>{
        let res = Array(0);
        let toCheck = [{x:x+1,y:y+2}, {x:x+1,y:y-2}, {x:x-1,y:y+2}, {x:x-1,y:y-2}, {x:x-2,y:y+1}, {x:x-2,y:y-1}, {x:x+2,y:y-1}, {x:x+2,y:y+1}];
        toCheck.forEach((e)=>{
            if(validField(e.x, e.y)){
                console.log(1);
                console.log(board[e.x][e.y].color);
            }
            if(validField(e.x, e.y) && board[e.x][e.y].color !== color){

                res.push(e);
            }
        })
        console.log(res);
        return res;
    }
    const Bishop=(board:FieldElement[][], x:number, y:number, color:string)=>{
        let res = Array(0);
        let i = 1;

        while(validField(x+i,y+i)){
            if(board[x+i][y+i].color !== color){
                res.push({x:x+i,y:y+i})
            }
            if(board[x+i][y+i].color !== ''){
                break;
            }
            i+=1;
        }
        i = 1;
        while(validField(x-i,y+i)){
            if(board[x-i][y+i].color !== color){
                res.push({x:x-i,y:y+i})
            }
            if(board[x-i][y+i].color !== ''){
                break;
            }
            i+=1;
        }
        i = 1;
        while(validField(x+i,y-i)){
            if(board[x+i][y-i].color !== color){
                res.push({x:x+i,y:y-i})
            }
            if(board[x+i][y-i].color !== ''){
                break;
            }
            i+=1;
        }
        i = 1
        while(validField(x-i,y-i)){
            if(board[x-i][y-i].color !== color){
                res.push({x:x-i,y:y-i})
            }
            if(board[x-i][y-i].color !== ''){
                break;
            }
            i+=1;
        }
        console.log(res);
        return res;
    }
    const Rook=(board:FieldElement[][], x:number, y:number, color:string)=>{
        let res = Array(0);
        let i = 1;
        while (validField(x,y-i)){
            if(board[x][y-i].color !== color){
                res.push({x:x,y:y-i})
            }
            if(board[x][y-i].color !== ''){
                break;
            }
            i+=1;
        }
        i = 1;
        while (validField(x,y+i)){
            if(board[x][y+i].color !== color){
                res.push({x:x,y:y+i})
            }
            if(board[x][y+i].color !== ''){
                break;
            }
            i+=1;
        }
        i = 1;
        while (validField(x+i,y)){
            if(board[x+i][y].color !== color){
                res.push({x:x+i,y:y})
            }
            if(board[x+i][y].color !== ''){
                break;
            }
            i+=1;
        }
        i = 1;
        while (validField(x-i,y)){
            if(board[x-i][y].color !== color){
                res.push({x:x-i,y:y})
            }
            if(board[x-i][y].color !== ''){
                break;
            }
            i+=1;
        }
        console.log(res);
        return res;
    }
    const King=(board:FieldElement[][], x:number, y:number, color:string)=>{
        let res = Array(0);
        let toCheck = [{x:x-1,y:y-1}, {x:x-1,y:y}, {x:x-1,y:y+1}, {x:x,y:y-1}, {x:x,y:y+1}, {x:x+1,y:y-1}, {x:x+1,y:y}, {x:x+1,y:y+1},]
        toCheck.forEach((e)=>{
            if(validField(e.x,e.y) && board[e.x][e.y].color !== color && !inCheck(board,e.x,e.y,color)){
                res.push(e);
            }
        })
        console.log(res);
        return res;
    }
    const Queen=(board:FieldElement[][], x:number, y:number, color:string)=>{
        return Bishop(board,x,y,color).concat(Rook(board,x,y,color));
    }
    const Pawn=(board:FieldElement[][], x:number, y:number, color:string)=>{
        let res = Array(0);
        let step = color === 'white' ? -1 : 1;
        let start = color ==='white' ? 6 : 1;

        if(validField(x+step,y) && board[x+step][y].color === ''){
            res.push({x:x+step,y:y});
            if(validField(x+2*step,y) && board[x+2*step][y].color === '' && x===start){
                res.push({x:x+2*step,y:y});
            }
        }
        if(validField(x+step,y-1) && board[x+step][y-1].color !== '' && board[x+step][y-1].color!==color){
            res.push({x:x+step,y:y-1});
        }
        if(validField(x+step,y+1) && board[x+step][y+1].color !== '' && board[x+step][y+1].color!==color){
            res.push({x:x+step,y:y+1});
        }
        console.log(res);
        return res;
    }
    const inCheck =(board:FieldElement[][], x:number, y:number, color:string)=>{
        for(let i=0;i<64; i++) {
            if(board[Math.floor(i/8)][i%8].piece !== PieceEnum.King){
                if (possibleMoves(board, Math.floor(i/8), i % 8, board[Math.floor(i/8)][i % 8].color).includes({x: x, y: y})) {
                    return true;
                }
            }
        }
        return false;
    }
    const possibleMoves = (board:FieldElement[][], x:number, y:number, color:string)=>{

        if(board[x][y].piece===PieceEnum.Knight){
            return Knight(board,x,y,color);
        }
        if(board[x][y].piece===PieceEnum.King){
            return King(board,x,y,color);
        }
        if(board[x][y].piece===PieceEnum.Rook){
            return Rook(board,x,y,color);
        }
        if(board[x][y].piece===PieceEnum.Bishop){
            return Bishop(board,x,y,color);
        }
        if(board[x][y].piece===PieceEnum.Queen){
            return Queen(board,x,y,color);
        }
        if(board[x][y].piece===PieceEnum.Pawn){
            return Pawn(board,x,y,color);
        }
        else
            return []
    }

    const clickHandle = (board:FieldElement[][], x:number, y:number, color:string)=>{
        if(board[x][y].state === 'initial'){

            let toUpdate = possibleMoves(board,x,y,color);
            toUpdate.forEach((e)=>{
                board[e.x][e.y].state = 'possible';
            });
            board[x][y].state = 'selected';
            console.log(board);
            stateUpdate(board);

        }
        else if(board[x][y].state === 'selected'){
            board.forEach((row)=>{
                row.forEach((e)=>{
                    e.state = 'initial';
                })
            })
            console.log(board);
            stateUpdate(board);
        }
        else if(board[x][y].state === 'possible'){
            let toChange = {x:0, y:0};
            for(let i=0;i<8;i++){
                for(let j=0;j<8;j++){
                    if(board[i][j].state === 'selected'){
                        toChange.x = i;
                        toChange.y = j;
                    }
                    board[i][j].state = 'initial';
                }
            }
            board[x][y] = board[toChange.x][toChange.y];
            board[toChange.x][toChange.y] = {piece:PieceEnum.Empty, color:'', state:'initial'};
            console.log(board);
            stateUpdate(board);
        }
        else{

        }
    }

    return (

        <div className={ blackField? 'field dark' : 'field'}  onClick={()=>clickHandle(board,x,y,color)}>
            {
                // piece != PieceEnum.Empty && <FontAwesomeIcon icon={[ color==='white'? "far" : "fas", `chess-${piece}`]} />
                piece !== PieceEnum.Empty && <FontAwesomeIcon color={ color } icon={iconsMap.get(`${piece}`) as IconDefinition} />
            }
        </div>
    )
}
