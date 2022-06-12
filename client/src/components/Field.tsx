import React from "react";
import {PieceEnum} from "../shared/types";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

interface FieldProps {
    piece:PieceEnum;
    color:string;
}

export const Field : React.FC<FieldProps> = ({piece, color}) => {
    return (
        <div className={'field'}>
            {
                piece != PieceEnum.Empty && <FontAwesomeIcon icon={[ color==='white'? "far" : "fas", `chess-${piece}`]} />
            }
        </div>
    )
}