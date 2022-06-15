import React, {useContext, useRef, useState} from 'react';
import './styles/Friends.css'
import {WebsocketState} from "../shared/providers";
import {AuthState} from "../shared/providers/AuthProvider";
interface FriendsProps {
}

export const Friends: React.FC<FriendsProps> = ({}) => {
    const mock = [{ username: 'Andi', score: '10-1' }, { username: 'Kuba', score: '5-5' }]
    const [friendList, setFriendList] = useState<{username: string, score: string}[]>([...mock])

    const [ inviteField, setInviteField] = useState<string>('');
    const formField = useRef<HTMLInputElement>(null);

    const { socket } = useContext(WebsocketState);
    const { user } = useContext(AuthState);

    return (
        <main className={'friends'}>
            <h1> FRIENDS </h1>
            <div className={'currentFriends'}>
                <h2> Friends List </h2>
                {
                    friendList.map( friend => <div key={ friend.username }>
                        <h3>{ friend.username }</h3>
                        <p> Score (Games won): { friend.score } </p>
                        <button onClick={ ()=> {
                           // @ts-ignore
                            socket?.emit('create_game', `${ user?.username ?? 'user' }-${ friend.username }-${ Date.now() }` )
                        } }> Play </button>
                    </div>
                    )
                }
            </div>
            <div className={'inviteFriend'}>
                <input
                    ref={formField}
                    placeholder={'Your Friend Nickname ...'}
                    type="text" value={ inviteField }
                    onInput={ (e)=> setInviteField(`${formField.current?.value}`)  }
                />
                <button onClick={()=> alert(`Invited ${ formField.current?.value }`)}> Invite </button>
            </div>
        </main>
    )
}
