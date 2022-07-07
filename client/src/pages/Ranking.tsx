import React, {useEffect, useState} from 'react';
import './styles/Ranking.css'
interface RankingProps {
}

export const Ranking: React.FC<RankingProps> = ({}) => {
    const [top10, setTop10] = useState<{username:string, games:number, winrate:string}[]>([]);
    const place = ['first', 'second', 'third', ''];
    const updateTop10 = async ()=>{
        const data = await fetch(`http://localhost:3002/userStats`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'},
        });

        const json = await data.json()
        console.log(json);
        let array = Array(0);
        json.data.forEach((user:{username:string, games:number, winrate:string})=>{
            array.push({username:user.username, games:user.games, winrate:user.winrate})
        })
        setTop10(array);
    }

    useEffect( ()=> {
        ;( async()=>{
            await updateTop10();
        } )()
    }, [])

    return (
        <main className="top10">
            <h1> TOP10</h1>
            <div className={'currentTop10'}>
                <h2> Players List </h2>
                {
                    top10.map( (user, i) => <div key={ user.username }>
                            <div>
                                <h3 className={`${place[i]}`}>{i+1}. { user.username }</h3>
                                <h3 className={`${place[i]}`}>Games played: {user.games}</h3>
                                <h3 className={`${place[i]}`}>Winrate: {user.winrate}%</h3>
                            </div>

                        </div>
                    )
                }
            </div>
        </main>
    )
}