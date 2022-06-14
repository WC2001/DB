import React, {useState} from 'react';
import './styles/Friends.css'
interface FriendsProps {
}

export const Friends: React.FC<FriendsProps> = ({}) => {
    const mock = [{ username: 'Andi', score: '10-1' }, { username: 'Kuba', score: '5-5' }]
    const [friendList, setFriendList] = useState<{username: string, score: string}[]>([...mock])

    return (
        <main>
            <h1> FRIENDS </h1>
            <div className={'currentFriends'}>
                <h2> Friends List </h2>
                {
                    friendList.map( friend => (
                        <div>
                            <h3>{ friend.username }</h3>
                            <p> Score (Games won): { friend.score } </p>
                            <button> Play </button>
                        </div>)
                    )
                }
            </div>
        </main>
    )
}
