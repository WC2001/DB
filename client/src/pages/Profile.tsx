import React, {useContext, useEffect, useState} from 'react';
import {AuthState} from "../shared/providers/AuthProvider";
import './styles/Profile.css'
import {useNavigate} from 'react-router-dom';
import {Game, WebsocketState} from "../shared/providers";
interface ProfileProps {
}


export const Profile: React.FC<ProfileProps> = ({}) => {

    const { user } = useContext(AuthState);
    const { chooseGame } = useContext(WebsocketState);
    const [games, updateGames] = useState<Game[]>([]);
    const [userState, setUser] = useState<{username:string, password:string}>({username:'', password:''});
    const [whiteGames, setWhiteGames] = useState<number>(0);
    const [whiteWon, setWhiteWon] = useState<number>(0);
    const [blackGames, setBlackGames] = useState<number>(0);
    const [blackWon, setBlackWon] = useState<number>(0);

    const navigate = useNavigate();

    const game = async (username:string)=>{
        let no_white = 0;
        let no_black = 0;
        let white_won = 0;
        let black_won = 0;
        const data = await fetch(`http://localhost:3002/user/${username}/games`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'},
        });
        const json = await data.json();
        console.log(json);
        let array = Array(0);
        json.data.forEach((elem:{id:string, white:string, black:string, draw:boolean, winner:string,
            started:boolean, moves:string[], _id:string})=>{

            array.push({_id:elem._id, id:elem.id, winner:elem.winner, draw:elem.draw,
                moves:elem.moves, started:elem.started, white:elem.white, black:elem.black});
            no_white = elem.white===user?.username ? no_white+1 : no_white;
            white_won = elem.winner===user?.username && elem.white===user.username ? white_won+1 : white_won;
            no_black = elem.black===user?.username ? no_black+1 : no_black;
            black_won = elem.winner===user?.username && elem.black===user.username ? black_won+1 : black_won;

        })
        updateGames(array);
        setBlackGames(no_black);
        setWhiteGames(no_white);
        setBlackWon(black_won);
        setWhiteWon(white_won);
    }

    useEffect( ()=> {
        ;( async()=>{
            setUser(user!);
            console.log(user);
            let u = user !== null ? user.username : '0';
            await game(u);
        } )()
    }, [])

    useEffect( ()=> {
        ;( async()=>{
            setUser(user!);
            console.log(user);
            let u = user !== null ? user.username : '0';
            await game(u);
        } )()
    }, [user])

    return (

        <main className={'profile'}>
            <h2> Games History </h2>
            <div className={'games-history'}>
                <h3>Games list</h3>
                {
                    games.map(game =>
                        <div key={game.id}>
                            <h4>gameId: {game.id}</h4>
                            <button onClick={()=>{
                                chooseGame(game);
                                navigate('/review');
                            } }> See details </button>
                        </div>
                    )
                }
            </div>
            <div className={'stats'}>
                <h3>Statistics</h3>
                <div>
                    <h4>Total games played: {whiteGames+blackGames}</h4>
                    <h4>Total games won: {whiteWon+blackWon}</h4>
                    <h4>Win ratio: {whiteGames+blackGames!==0 ? (((whiteWon+blackWon)*100)/(whiteGames+blackGames)).toFixed(2):0}%</h4>
                </div>
                <div>
                    <h4>White games: {whiteGames}</h4>
                    <h4>White wins: {whiteWon}</h4>
                    <h4>White win ratio: {whiteGames!==0 ? ((whiteWon*100)/whiteGames).toFixed(2) : 0}%</h4>
                </div>
                <div>
                    <h4>Black games: {blackGames}</h4>
                    <h4>Black wins: {blackWon}</h4>
                    <h4>Black win ratio: {blackGames!==0 ? ((blackWon*100)/blackGames).toFixed(2) : 0}%</h4>
                </div>
            </div>

        </main>


    )

}