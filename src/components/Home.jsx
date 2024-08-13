import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [user, setUser] = useState('');

  const handleClick = () => {
    const newId = uuidv4();
    setId(newId);
    toast.success('Room Created');
  };

  const handleJoin = (e) => {
    e.preventDefault()
    if (!id || !user) {
      toast.error('ROOM ID & Username are required');
      return;
    }
    navigate(`/editor/${id}`,{
        state: { user }
    });
    toast.success('Room Joined');
  };

  return (
    <>
      <h2 className='text-white text-2xl text-center mb-4 m-auto'>Learn With People</h2>
      <div className='w-1/2 m-auto border-2 rounded-2xl text-center'>
        <div className='flex justify-center mt-4'>
          <img
            className='rounded-2xl'
            src="https://thin-nology.com/wp-content/uploads/server-room-1920x1080-1.jpeg"
            alt="Server Room"
            height={200}
            width={450}
          />
        </div>
        <p className='my-2 text-white'>Paste Invitation ROOM ID</p>
        <div className='flex flex-col my-2'>
            <form className='flex flex-col' >
          <input
            className='mx-20 px-2 py-2 my-2 rounded-lg font-bold'
            type="text"
            placeholder='ROOM ID'
            value={id}
            onChange={e => setId(e.target.value)}
          />
          <input
            onChange={e => setUser(e.target.value)}
            className=' mx-20 px-2 py-2 my-2 font-bold  rounded-lg'
            type="text"
            placeholder='USERNAME'
            value={user}
          />
        
        <button
          type='submit'
          onClick={handleJoin}
          className='bg-purple-600 my-2 py-2 px-4 w-1/2 m-auto rounded-2xl text-white hover:bg-purple-900'
        >
          Join
        </button>
        </form>
        </div>
        <p className='mb-2'>
          If you don't have an invite, create a{' '}
          <span
            onClick={handleClick}
            className='text-purple-600 hover:underline cursor-pointer'
          >
            new room
          </span>
        </p>
      </div>
    </>
  );
}

export default Home;
