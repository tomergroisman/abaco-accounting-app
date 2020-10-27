import React from 'react';
import { useUser } from '../lib/user'

export default function Unauthorized() {
    const { user } = useUser();
    console.log(user)

    return (
        <div>
            <h1>This is an unauthorized page.</h1>
            
            <h4>user: {user ? user.name : user}</h4>
        </div>
    )
}
