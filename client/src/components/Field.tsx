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
    kings:object;
}

export const Field : React.FC<FieldProps> = ({piece, color, blackField,
                                                 board,x,y, stateUpdate, possible,kings}) => {
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
    const testKing = (x1:number,y1:number,x2:number,y2:number,board:FieldElement[][],kings:any)=>{
        let testedPiece= {piece:board[x][y].piece, color:board[x][y].color, state:board[x][y].state};
        if(board[x1][y1].color === 'white'){
            board[x1][y1].piece = PieceEnum.Empty;
            board[x1][y1].color = '';
            board[x1][y1].state = 'initial';
            board[x2][y2].piece = testedPiece.piece;
            board[x2][y2].color = testedPiece.color;
            board[x2][y2].state = testedPiece.state;
            kings.white_king.x = x2;
            kings.white_king.y = y2;
            if(inCheck(board,x2,y2,kings)){
                board[x1][y1].piece = testedPiece.piece;
                board[x1][y1].color = testedPiece.color;
                board[x1][y1].state = testedPiece.state;
                board[x2][y2].piece = PieceEnum.Empty;
                board[x2][y2].color = '';
                board[x2][y2].state = 'initial';
                kings.white_king.x = x1;
                kings.white_king.y = y1;
                return false;
            }
            board[x1][y1].piece = testedPiece.piece;
            board[x1][y1].color = testedPiece.color;
            board[x1][y1].state = testedPiece.state;
            board[x2][y2].piece = PieceEnum.Empty;
            board[x2][y2].color = '';
            board[x2][y2].state = 'initial';
            kings.white_king.x = x1;
            kings.white_king.y = y1;
            return true;
        }
    }

    const testMove=(x:number,y:number,x2:number,y2:number, board:FieldElement[][], kings:any)=>{
        let i = board[x][y].color === 'white' ? 0 : 1;
        const toCheck = [kings.white_king, kings.black_king];
        let testedPiece = {piece:board[x][y].piece, color:board[x][y].color, state:board[x][y].state};
        let capturedPiece = {piece:board[x2][y2].piece, color:board[x2][y2].color, state:board[x2][y2].state};
        board[x][y].piece = PieceEnum.Empty;
        board[x][y].color = '';
        board[x][y].state = 'initial';
        board[x2][y2].piece = testedPiece.piece;
        board[x2][y2].color = testedPiece.color;
        board[x2][y2].state = testedPiece.state;
        console.log(toCheck[i]);
        if(inCheck(board,toCheck[i].x,toCheck[i].y,kings)){
            board[x][y].piece = testedPiece.piece;
            board[x][y].color = testedPiece.color;
            board[x][y].state = testedPiece.state;
            board[x2][y2].piece = capturedPiece.piece;
            board[x2][y2].color = capturedPiece.color;
            board[x2][y2].state = capturedPiece.state;
            return true;
        }
        board[x][y].piece = testedPiece.piece;
        board[x][y].color = testedPiece.color;
        board[x][y].state = testedPiece.state;
        board[x2][y2].piece = capturedPiece.piece;
        board[x2][y2].color = capturedPiece.color;
        board[x2][y2].state = capturedPiece.state;
        return false;
    }

    const Knight=(board:FieldElement[][], x:number, y:number, color:string, check:boolean, kings:any)=>{
        let res = Array(0);

        let toCheck = [{x:x+1,y:y+2}, {x:x+1,y:y-2}, {x:x-1,y:y+2}, {x:x-1,y:y-2}, {x:x-2,y:y+1}, {x:x-2,y:y-1}, {x:x+2,y:y-1}, {x:x+2,y:y+1}];
        toCheck.forEach((e)=>{
            if(!check){
                if(validField(e.x, e.y) && board[e.x][e.y].color !== color){
                    res.push(e);
                }
            }
            else if(!testMove(x,y,e.x,e.y,board,kings)){
                if(validField(e.x, e.y) && board[e.x][e.y].color !== color){
                    res.push(e);
                }
            }
        })
        if(check)
            console.log(res);
        return res;
    }
    const Bishop=(board:FieldElement[][], x:number, y:number, color:string, check:boolean, kings:any)=>{
        let res = Array(0);
        let i = 1;

        while(validField(x+i,y+i)){
            if(board[x+i][y+i].color !== color){
                if(!check)
                    res.push({x:x+i,y:y+i})
                else if (!testMove(x,y,x+i,y+i,board,kings)){
                    res.push({x:x+i,y:y+i})
                }
            }
            if(board[x+i][y+i].color !== ''){
                break;
            }
            i+=1;
        }
        i = 1;
        while(validField(x-i,y+i)){
            if(board[x-i][y+i].color !== color){
                if(!check)
                    res.push({x:x-i,y:y+i})
                else if (!testMove(x,y,x-i,y+i,board,kings)){
                    res.push({x:x-i,y:y+i})
                }
            }
            if(board[x-i][y+i].color !== ''){
                break;
            }
            i+=1;
        }
        i = 1;
        while(validField(x+i,y-i)){
            if(board[x+i][y-i].color !== color){
                if(!check)
                    res.push({x:x+i,y:y-i})
                else if (!testMove(x,y,x+i,y-i,board,kings)){
                    res.push({x:x+i,y:y-i})
                }
            }
            if(board[x+i][y-i].color !== ''){
                break;
            }
            i+=1;
        }
        i = 1
        while(validField(x-i,y-i)){
            if(board[x-i][y-i].color !== color){
                if(!check)
                    res.push({x:x-i,y:y-i})
                else if (!testMove(x,y,x-i,y-i,board,kings)){
                    res.push({x:x-i,y:y-i})
                }
            }
            if(board[x-i][y-i].color !== ''){
                break;
            }
            i+=1;
        }
        if(check)
            console.log(res);
        return res;
    }
    const Rook=(board:FieldElement[][], x:number, y:number, color:string, check:boolean, kings:any)=>{
        let res = Array(0);

        let i = 1;
        while (validField(x,y-i)){
            if(board[x][y-i].color !== color){
                if(!check)
                    res.push({x:x,y:y-i})
                else if (!testMove(x,y,x,y-i,board,kings)){
                    res.push({x:x,y:y-i})
                }
            }
            if(board[x][y-i].color !== ''){
                break;
            }
            i+=1;
        }
        i = 1;
        while (validField(x,y+i)){
            if(board[x][y+i].color !== color){
                if(!check)
                    res.push({x:x,y:y+i})
                else if (!testMove(x,y,x,y+i,board,kings)){
                    res.push({x:x,y:y+i})
                }
            }
            if(board[x][y+i].color !== ''){
                break;
            }
            i+=1;
        }
        i = 1;
        while (validField(x+i,y)){
            if(board[x+i][y].color !== color){
                if(!check)
                    res.push({x:x+i,y:y})
                else if (!testMove(x,y,x+i,y,board,kings)){
                    res.push({x:x+i,y:y})
                }
            }
            if(board[x+i][y].color !== ''){
                break;
            }
            i+=1;
        }
        i = 1;
        while (validField(x-i,y)){
            if(board[x-i][y].color !== color){
                if(!check)
                    res.push({x:x-i,y:y})
                else if (!testMove(x,y,x-i,y,board,kings)){
                    res.push({x:x-i,y:y})
                }
            }
            if(board[x-i][y].color !== ''){
                break;
            }
            i+=1;
        }
        if(check)
            console.log(res);
        return res;
    }
    const King=(board:FieldElement[][], x:number, y:number, color:string, check:boolean, kings:any)=>{
        let res = Array(0);
        let toCheck = [{x:x-1,y:y-1}, {x:x-1,y:y}, {x:x-1,y:y+1}, {x:x,y:y-1}, {x:x,y:y+1}, {x:x+1,y:y-1}, {x:x+1,y:y}, {x:x+1,y:y+1},]
        toCheck.forEach((e)=>{
            if(check){
                if(validField(e.x,e.y) && board[e.x][e.y].color !== color && testKing(x,y,e.x,e.y,board,kings)){
                    res.push(e);
                }
            }
            else if(validField(e.x,e.y) && board[e.x][e.y].color !== color){
                res.push(e);
            }
        })
        if(check)
            console.log(res);
        return res;
    }
    const Queen=(board:FieldElement[][], x:number, y:number, color:string, check:boolean, kings:any)=>{
        return Bishop(board,x,y,color,check,kings).concat(Rook(board,x,y,color,check,kings));
    }

    const Pawn=(board:FieldElement[][], x:number, y:number, color:string, check:boolean,kings:any)=>{
        let res = Array(0);

        let step = color === 'white' ? -1 : 1;
        let start = color ==='white' ? 6 : 1;

        if(validField(x+step,y) && board[x+step][y].color === ''){
            if(!check){
                res.push({x:x+step,y:y});
                if(validField(x+2*step,y) && board[x+2*step][y].color === '' && x===start){
                    res.push({x:x+2*step,y:y});
                }
            }
            else if(!testMove(x,y,x+step,y,board,kings)){
                res.push({x:x+step,y:y});
                if(validField(x+2*step,y) && board[x+2*step][y].color === '' && x===start){
                    res.push({x:x+2*step,y:y});
                }
            }
        }
        if(!check){
            if(validField(x+step,y-1) && board[x+step][y-1].color !== '' && board[x+step][y-1].color!==color){
                res.push({x:x+step,y:y-1});
            }
            if(validField(x+step,y+1) && board[x+step][y+1].color !== '' && board[x+step][y+1].color!==color){
                res.push({x:x+step,y:y+1});
            }
        }else{
            if(!testMove(x,y,x+step,y-1,board,kings)){
                if(validField(x+step,y-1) && board[x+step][y-1].color !== '' && board[x+step][y-1].color!==color){
                    res.push({x:x+step,y:y-1});
                }
            }
            if(!testMove(x,y,x+step,y+1,board,kings)){
                if(validField(x+step,y+1) && board[x+step][y+1].color !== '' && board[x+step][y+1].color!==color){
                    res.push({x:x+step,y:y+1});
                }
            }
        }

        if(check)
            console.log(res);
        return res;
    }
    const inCheck =(board:FieldElement[][],x:number,y:number,kings:any)=>{
        for(let i=0;i<64; i++) {
            possibleMoves(board, Math.floor(i/8), i % 8,
                board[Math.floor(i/8)][i % 8].color,false,kings).forEach((move)=>{
                    if(move.x === x && move.y === y){
                        console.log('check');
                        return true;
                    }
            })
        }
        return false;
    }
    const possibleMoves = (board:FieldElement[][], x:number, y:number, color:string, check:boolean, kings:any)=>{

        if(board[x][y].piece===PieceEnum.Knight){
            return Knight(board,x,y,color,check,kings);
        }
        if(board[x][y].piece===PieceEnum.King){
            return King(board,x,y,color,check,kings);
        }
        if(board[x][y].piece===PieceEnum.Rook){
            return Rook(board,x,y,color,check,kings);
        }
        if(board[x][y].piece===PieceEnum.Bishop){
            return Bishop(board,x,y,color,check,kings);
        }
        if(board[x][y].piece===PieceEnum.Queen){
            return Queen(board,x,y,color,check,kings);
        }
        if(board[x][y].piece===PieceEnum.Pawn){
            return Pawn(board,x,y,color,check,kings);
        }
        else
            return []
    }

    const clickHandle = (board:FieldElement[][], x:number, y:number, color:string, kings:any)=>{
        if(board[x][y].state === 'initial'){

            let toUpdate = possibleMoves(board,x,y,color,true,kings);
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
            board[x][y] = {piece:board[toChange.x][toChange.y].piece, color:board[toChange.x][toChange.y].color, state:'initial'};
            board[toChange.x][toChange.y] = {piece:PieceEnum.Empty, color:'', state:'initial'};
            console.log(board);
            stateUpdate(board);
        }
        else{

        }
    }

    return (

        <div className={ blackField? 'field dark' : 'field'}  onClick={()=>clickHandle(board,x,y,board[x][y].color,kings)}>
            {
                // piece != PieceEnum.Empty && <FontAwesomeIcon icon={[ color==='white'? "far" : "fas", `chess-${piece}`]} />
                piece !== PieceEnum.Empty && <FontAwesomeIcon color={ color } icon={iconsMap.get(`${piece}`) as IconDefinition} />
            }
        </div>
    )
}
