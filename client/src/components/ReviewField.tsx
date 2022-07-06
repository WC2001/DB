import React, {useContext} from "react";
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
import {useStorage} from "../shared/hooks";
import {WebsocketState} from "../shared/providers";
import {AuthState} from "../shared/providers/AuthProvider";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface ReviewFieldProps {
    blackField?: boolean;
    board: FieldElement[][];
    x:number;
    y:number;
}

export const ReviewField: React.FC<ReviewFieldProps> = ({blackField, board, x, y}) => {

    const iconsMap = new Map<string, IconDefinition>([
        ["pawn", faChessPawn],
        ["king", faChessKing],
        ["queen", faChessQueen],
        ["bishop", faChessBishop],
        ["knight", faChessKnight],
        ["rook", faChessRook]
    ]);

    return (
        <div className={ blackField? `field dark ${board[x][y].state}` : `field ${board[x][y].state}` }>
            <ToastContainer/>
            {
                // piece != PieceEnum.Empty && <FontAwesomeIcon icon={[ color==='white'? "far" : "fas", `chess-${piece}`]} />
                board[x][y].piece !== PieceEnum.Empty && <FontAwesomeIcon color={ board[x][y].color } icon={iconsMap.get(`${board[x][y].piece}`) as IconDefinition} />
            }
        </div>
    )
}