import React from 'react';
import Avatar from 'react-avatar';

function Client({ username }) {
    return (
        <div className="space-x-4 ">
            <div className="flex flex-col items-center mx-1 border-b-2 shadow-2xl  p-1 rounded-xl my-2">
                <Avatar name={username} size={30} round="20px" />
           
            <p className="text-sm text-center m-auto text-white mt-2">{username}</p>
            </div>
        </div>
    );
}

export default Client;
