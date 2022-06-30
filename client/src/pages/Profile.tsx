import React, {useContext, useEffect, useState} from 'react';
import {AuthState} from "../shared/providers/AuthProvider";
import './styles/Profile.css'
interface ProfileProps {
}

export const Profile: React.FC<ProfileProps> = ({}) => {

    const { user } = useContext(AuthState);

    const [games, updateGames] = useState<{gameId:string}[]>([]);

    useEffect(()=>{
        let u = user !== null ? user.username : '0';

        const games = async () =>{
            const data = await fetch(`http://localhost:3002/user/${u}/games`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json'},
            });
            const json = await data.json();
            console.log(json);
            let array = Array(0);
            json.data.forEach((id:string)=>{
                array.push({gameId:id});
            })
            updateGames(array);
        }

        games()
            .catch(console.error);
    }, [])

    return (

        <main className={'profile'}>
            <h2> Games History </h2>
            <div className={'games-history'}>
                <h3>Games list</h3>
                {
                    games.map(game =>
                        <div key={game.gameId}>
                            <h4>gameId: {game.gameId}</h4>
                            <button onClick={()=>{
                                console.log('details');
                            } }> See details </button>
                        </div>
                    )
                }
            </div>

        </main>


    )

}