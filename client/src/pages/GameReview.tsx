import React, {useContext, useEffect} from "react";
import './styles/Review.css'
import {ReviewBoard} from "../components/ReviewBoard";


interface GameReviewProps {
}

export const GameReview: React.FC<GameReviewProps> = ({}) => {

    return (
        <main>
            <ReviewBoard/>
        </main>
    )
}