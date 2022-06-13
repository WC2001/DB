import React from "react";
import {PieceEnum} from "../shared/types";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChessPawn, faChessKing, faChessQueen, faChessBishop, faChessKnight,faChessRook} from "@fortawesome/free-solid-svg-icons";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";

interface FieldProps {
    piece:PieceEnum;
    color:string;
    blackField?: boolean;
}

export const Field : React.FC<FieldProps> = ({piece, color, blackField}) => {
    const iconsMap = new Map<string, IconDefinition>([
        ["pawn", faChessPawn],
        ["king", faChessKing],
        ["queen", faChessQueen],
        ["bishop", faChessBishop],
        ["knight", faChessKnight],
        ["rook", faChessRook]
    ])


    return (
        <div className={ blackField? 'field dark' : 'field'}>
            {
                // piece != PieceEnum.Empty && <FontAwesomeIcon icon={[ color==='white'? "far" : "fas", `chess-${piece}`]} />
                piece != PieceEnum.Empty && <FontAwesomeIcon color={ color } icon={iconsMap.get(`${piece}`) as IconDefinition} />
            }
        </div>
    )
}
