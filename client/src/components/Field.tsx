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
    blackField?: boolean;
    board: FieldElement[][];
    x:number;
    y:number;
    stateUpdate: (board: FieldElement[][])=>void;
    kings:{white_king:{x:number,y:number}, black_king:{x:number, y:number}};
    kingsUpdate:(kings:{white_king:{x:number,y:number}, black_king:{x:number, y:number}})=>void;
}

export const Field : React.FC<FieldProps> = ({blackField,
                                                 board,x,y,stateUpdate,
                                                 kings},
                                             kingsUpdate) => {
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
        let testedPiece = {piece:board[x1][y1].piece, color:board[x1][y1].color, state:board[x1][y1].state};
        let capturedPiece = {piece:board[x2][y2].piece, color:board[x2][y2].color, state:board[x2][y2].state};
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
                board[x2][y2].piece = capturedPiece.piece;
                board[x2][y2].color = capturedPiece.color;
                board[x2][y2].state = capturedPiece.state;
                kings.white_king.x = x1;
                kings.white_king.y = y1;
                return false;
            }
            board[x1][y1].piece = testedPiece.piece;
            board[x1][y1].color = testedPiece.color;
            board[x1][y1].state = testedPiece.state;
            board[x2][y2].piece = capturedPiece.piece;
            board[x2][y2].color = capturedPiece.color;
            board[x2][y2].state = capturedPiece.state;
            kings.white_king.x = x1;
            kings.white_king.y = y1;
            return true;
        }
        else{
            board[x1][y1].piece = PieceEnum.Empty;
            board[x1][y1].color = '';
            board[x1][y1].state = 'initial';
            board[x2][y2].piece = testedPiece.piece;
            board[x2][y2].color = testedPiece.color;
            board[x2][y2].state = testedPiece.state;
            kings.black_king.x = x2;
            kings.black_king.y = y2;
            if(inCheck(board,x2,y2,kings)){
                board[x1][y1].piece = testedPiece.piece;
                board[x1][y1].color = testedPiece.color;
                board[x1][y1].state = testedPiece.state;
                board[x2][y2].piece = capturedPiece.piece;
                board[x2][y2].color = capturedPiece.color;
                board[x2][y2].state = capturedPiece.state;
                kings.black_king.x = x1;
                kings.black_king.y = y1;
                return false;
            }
            board[x1][y1].piece = testedPiece.piece;
            board[x1][y1].color = testedPiece.color;
            board[x1][y1].state = testedPiece.state;
            board[x2][y2].piece = capturedPiece.piece;
            board[x2][y2].color = capturedPiece.color;
            board[x2][y2].state = capturedPiece.state;
            kings.black_king.x = x1;
            kings.black_king.y = y1;
            return true;
        }
    }

    const inCheck = (board:FieldElement[][],x:number,y:number,kings:any) : boolean =>{
        for(let i=0;i<64; i++) {
            if(board[Math.floor(i/8)][i%8].color !== board[x][y].color){
                const test = possibleMoves(board,Math.floor(i/8), i%8,false,kings);
                for (let j=0;j<test.length;j++){
                    if(test[j].x === x && test[j].y === y){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    const testMove=(x:number,y:number,x2:number,y2:number, board:FieldElement[][], kings:any)=>{
        const toCheck = board[x][y].color === 'white' ? {x:kings.white_king.x, y:kings.white_king.y} :
            {x:kings.black_king.x , y:kings.black_king.y};
        let testedPiece = {piece:board[x][y].piece, color:board[x][y].color, state:board[x][y].state};
        let capturedPiece = {piece:board[x2][y2].piece, color:board[x2][y2].color, state:board[x2][y2].state};
        board[x][y].piece = PieceEnum.Empty;
        board[x][y].color = '';
        board[x][y].state = 'initial';
        board[x2][y2].piece = testedPiece.piece;
        board[x2][y2].color = testedPiece.color;
        board[x2][y2].state = testedPiece.state;

        if(inCheck(board,toCheck.x,toCheck.y,kings)){
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

    const Knight=(board:FieldElement[][], x:number, y:number, check:boolean, kings:any)=>{
        let res = Array(0);
        let toCheck = [{x:x+1,y:y+2}, {x:x+1,y:y-2}, {x:x-1,y:y+2}, {x:x-1,y:y-2}, {x:x-2,y:y+1},
            {x:x-2,y:y-1}, {x:x+2,y:y-1}, {x:x+2,y:y+1}];

        toCheck.forEach((e)=>{
                if(validField(e.x, e.y) && board[e.x][e.y].color !== board[x][y].color) {
                    res.push(e);
                }
        })
        let empty = Array(0);
        if(check){
            for(let i=0;i<res.length;i++){
                if(!testMove(x,y,res[i].x,res[i].y,board,kings)){
                    empty.push(res[i]);
                }
            }
            console.log("e: ",empty);
        }
        return check ? empty : res;
    }
    const can_move = (board:FieldElement[][], color:string, kings:any) : boolean =>{
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                if(board[i][j].color === color && possibleMoves(board,i,j,true,kings).length > 0){
                    return true
                }
            }
        }
        return false;
    };

    const Bishop=(board:FieldElement[][], x:number, y:number, check:boolean, kings:any)=>{
        let res = Array(0);
        let i = 1;

        while(validField(x+i,y+i)){
            if(board[x+i][y+i].color !== board[x][y].color){
                    res.push({x:x+i,y:y+i});
            }
            if(board[x+i][y+i].color !== ''){
                break;
            }
            i+=1;
        }
        i = 1;
        while(validField(x-i,y+i)){
            if(board[x-i][y+i].color !== board[x][y].color){
                    res.push({x:x-i,y:y+i});
            }
            if(board[x-i][y+i].color !== ''){
                break;
            }
            i+=1;
        }
        i = 1;
        while(validField(x+i,y-i)){
            if(board[x+i][y-i].color !== board[x][y].color){
                    res.push({x:x+i,y:y-i});
            }
            if(board[x+i][y-i].color !== ''){
                break;
            }
            i+=1;
        }
        i = 1
        while(validField(x-i,y-i)){
            if(board[x-i][y-i].color !== board[x][y].color){
                    res.push({x:x-i,y:y-i});
            }
            if(board[x-i][y-i].color !== ''){
                break;
            }
            i+=1;
        }
        let empty = Array(0);
        if(check){
            for(let i=0;i<res.length;i++){
                if(!testMove(x,y,res[i].x,res[i].y,board,kings)){
                    empty.push(res[i]);
                }
            }
            console.log("e: ",empty);
        }
        return check ? empty : res;
    }
    const Rook=(board:FieldElement[][], x:number, y:number, check:boolean, kings:any)=>{
        let res = Array(0);

        let i = 1;
        while (validField(x,y-i)){
            if(board[x][y-i].color !== board[x][y].color){
                    res.push({x:x,y:y-i});
            }
            if(board[x][y-i].color !== ''){
                break;
            }
            i+=1;
        }
        i = 1;
        while (validField(x,y+i)){
            if(board[x][y+i].color !== board[x][y].color){
                    res.push({x:x,y:y+i})
            }
            if(board[x][y+i].color !== ''){
                break;
            }
            i+=1;
        }
        i = 1;
        while (validField(x+i,y)){
            if(board[x+i][y].color !== board[x][y].color){
                    res.push({x:x+i,y:y});
            }
            if(board[x+i][y].color !== ''){
                break;
            }
            i+=1;
        }
        i = 1;
        while (validField(x-i,y)){
            if(board[x-i][y].color !== board[x][y].color){
                    res.push({x:x-i,y:y});
            }
            if(board[x-i][y].color !== ''){
                break;
            }
            i+=1;
        }
        let empty = Array(0);
        if(check){
            for(let i=0;i<res.length;i++){
                if(!testMove(x,y,res[i].x,res[i].y,board,kings)){
                    empty.push(res[i]);
                }
            }
            console.log("e: ",empty);
        }
        return check ? empty : res;
    }
    const King=(board:FieldElement[][], x:number, y:number, check:boolean, kings:any)=>{
        let res = Array(0);
        let toCheck = [{x:x-1,y:y-1}, {x:x-1,y:y}, {x:x-1,y:y+1}, {x:x,y:y-1}, {x:x,y:y+1}, {x:x+1,y:y-1}, {x:x+1,y:y}, {x:x+1,y:y+1},]
        toCheck.forEach((e)=>{

            if(validField(e.x,e.y) && board[e.x][e.y].color !== board[x][y].color){
                    res.push(e);
            }
        })
        let empty = Array(0);
        if(check){
            for(let i=0;i<res.length;i++){
                if(testKing(x,y,res[i].x,res[i].y,board,kings)){
                    empty.push(res[i]);
                }
            }
            console.log("e: ",empty);
        }
        return check ? empty : res;
    }
    const Queen=(board:FieldElement[][], x:number, y:number, check:boolean, kings:any)=>{
        return Bishop(board,x,y,check,kings).concat(Rook(board,x,y,check,kings));
    }

    const Pawn=(board:FieldElement[][], x:number, y:number, check:boolean,kings:any)=>{
        let res = Array(0);

        let step = board[x][y].color === 'white' ? -1 : 1;
        let start = board[x][y].color ==='white' ? 6 : 1;

        if(validField(x+step,y) && board[x+step][y].color === '' && check){
            res.push({x:x+step,y:y});
            if(validField(x+2*step,y) && board[x+2*step][y].color === '' && x===start){
                res.push({x:x+2*step,y:y});
            }
        }
        if(validField(x+step,y-1) && board[x+step][y-1].color!=='' && board[x][y].color!==board[x+step][y-1].color){
            res.push({x:x+step,y:y-1});
        }
        if(validField(x+step,y+1) && board[x+step][y+1].color!=='' && board[x][y].color!==board[x+step][y+1].color){
            res.push({x:x+step,y:y+1});
        }

        let empty = Array(0);
        if(check){
            for(let i=0;i<res.length;i++){
                if(!testMove(x,y,res[i].x,res[i].y,board,kings)){
                    empty.push(res[i]);
                }
            }
            console.log("e: ",empty);
        }
        return check ? empty : res;
    }

    const possibleMoves = (board:FieldElement[][], x:number, y:number, check:boolean, kings:any) :{x:number,y:number}[]  =>{

        if(board[x][y].piece===PieceEnum.Knight){
            return Knight(board,x,y,check,kings);
        }
        if(board[x][y].piece===PieceEnum.King){
            return King(board,x,y,check,kings);
        }
        if(board[x][y].piece===PieceEnum.Rook){
            return Rook(board,x,y,check,kings);
        }
        if(board[x][y].piece===PieceEnum.Bishop){
            return Bishop(board,x,y,check,kings);
        }
        if(board[x][y].piece===PieceEnum.Queen){
            return Queen(board,x,y,check,kings);
        }
        if(board[x][y].piece===PieceEnum.Pawn){
            return Pawn(board,x,y,check,kings);
        }
        else
            return []
    }

    const clickHandle = (board:FieldElement[][], x:number, y:number, kings:any)=>{
        console.log(kings);
        if(board[x][y].state === 'initial'){

            let toUpdate = possibleMoves(board,x,y,true,kings);
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
            if(board[x][y].piece === PieceEnum.King){
                if(board[x][y].color === 'white'){
                    kings.white_king.x = x;
                    kings.white_king.y = y;
                    kingsUpdate(kings);
                }else{
                    kings.black_king.x = x;
                    kings.black_king.y = y;
                    kingsUpdate(kings);
                }
            }
            let color = board[toChange.x][toChange.y].color === 'white' ? 'black' : 'white';
            board[x][y] = {piece:board[toChange.x][toChange.y].piece, color:board[toChange.x][toChange.y].color, state:'initial'};
            board[toChange.x][toChange.y] = {piece:PieceEnum.Empty, color:'', state:'initial'};
            console.log(board);
            stateUpdate(board);

            if(!can_move(board,color,kings)){
                console.log(`${color} king mated.`);
            }
        }
        else{

        }
    }

    return (

        <div className={ blackField? `field dark ${board[x][y].state}` : `field ${board[x][y].state}` }  onClick={()=>clickHandle(board,x,y,kings)}>
            {
                // piece != PieceEnum.Empty && <FontAwesomeIcon icon={[ color==='white'? "far" : "fas", `chess-${piece}`]} />
                board[x][y].piece !== PieceEnum.Empty && <FontAwesomeIcon color={ board[x][y].color } icon={iconsMap.get(`${board[x][y].piece}`) as IconDefinition} />
            }
        </div>
    )
}
