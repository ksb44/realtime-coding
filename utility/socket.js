import {io} from 'socket.io-client'

export const initSocket = async () =>{

    const options={
        transports: ['websocket'],
        'force new connection':true,
        timeout:10000,
        reconnectionAttempt:'Infinity'
    }
    return io("https://backend-realtime-w5sb.onrender.com",options)
}
