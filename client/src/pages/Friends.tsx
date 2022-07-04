import React, {useContext, useEffect, useRef, useState} from 'react';
import './styles/Friends.css'
import {WebsocketState} from "../shared/providers";
import {AuthState} from "../shared/providers/AuthProvider";
interface FriendsProps {
}

export const Friends: React.FC<FriendsProps> = ({}) => {
    const mock = [{ username: 'Andi'}, { username: 'Kuba'}]
    const [friendList, setFriendList] = useState<{username: string}[]>([...mock]);
    const [userState, setUser] = useState<{username:string, password:string}>({username:'', password:''});

    const [ inviteField, setInviteField] = useState<string>('');
    const formField = useRef<HTMLInputElement>(null);

    const { socket } = useContext(WebsocketState);

    const { user } = useContext(AuthState);


    const addFriend = async ()=>{
        let u = user !== null ? user.username : '0';
        const res = await fetch('http://localhost:3002/user/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({user:u, friend: formField.current?.value})
        })
        const data = await res.json();
        console.log(data.message);
        await updateFriends(u);
    }

    /*useEffect( () => {
        console.log(user);
        let u = user !== null ? user.username : '0';
        const friends = async () => {

            const data =  await fetch(`http://localhost:3002/user/${u}/friends`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json'},
            });

            const json = await data.json();
            console.log(json);
            let array = Array(0);
            json.data.forEach((friend:string)=>{
                array.push({username:friend});
            })
            setFriendList(array);
        }

        friends()
            .catch(console.error);

    }, []);*/
    const updateFriends = async (username:string) =>{
        const data =  await fetch(`http://localhost:3002/user/${username}/friends`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'},
        });

        const json = await data.json();
        console.log(json);
        let array = Array(0);
        json.data.forEach((friend:string)=>{
            array.push({username:friend});
        })
        setFriendList(array);
    }

    useEffect( ()=> {
        ;( async()=>{
            setUser(user!);
            console.log(user);
            let u = user !== null ? user.username : '0';
            await updateFriends(u);
        } )()
    }, [])

    useEffect( ()=> {
        ;( async()=>{
            setUser(user!);
            console.log(user);
            let u = user !== null ? user.username : '0';
            await updateFriends(u);
        } )()
    }, [user])



    return (
        <main className={'friends'} >
            <h1> FRIENDS </h1>
            <div className={'currentFriends'}>
                <h2> Friends List </h2>
                {
                    friendList.map( friend => <div key={ friend.username }>
                        <h3>{ friend.username }</h3>
                        <button onClick={ ()=> {
                            let gameId = `${ user?.username ?? 'user' }-${ friend.username }-${ Date.now() }`;
                           // @ts-ignore

                            socket?.emit('create_game', {white: user?.username ?? 'user',
                                black: friend.username,
                                id: gameId} );


                            socket?.emit('request_game', {user:friend.username,
                                game:gameId});

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
                {/*<button onClick={()=> alert(`Invited ${ formField.current?.value }`)}> Invite </button>*/}
                <button onClick={addFriend}> Invite </button>
            </div>
        </main>
    )
}
