import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import debounce from 'lodash.debounce';
 const ACTIONS={
    JOIN:'join',
    JOINED:'joined',
    DISCONNECTED:'disconnected',
    CODE_CHANGE:'code-change',
    SYNC_CODE:'sync-code',
    LEAVE:'leave',

}
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};

function getAllConnectedClients(id) {
    return Array.from(io.sockets.adapter.rooms.get(id) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

const DEBOUNCE_DELAY = 500;

const handleCodeChange = debounce(({ roomId, code }) => {
    io.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
}, DEBOUNCE_DELAY);

io.on('connection', (socket) => {

    socket.on(ACTIONS.JOIN, ({ id, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(id);
        const clients = getAllConnectedClients(id);

        io.to(id).emit(ACTIONS.JOINED, {
            clients,
            username,
            socketId: socket.id,
        });
    });
   
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        if(code!=='')
        handleCodeChange({ roomId, code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {

        if(code!=='' || code !==null)
        io.to(socketId).emit(ACTIONS.SYNC_CODE, { code });
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];

        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });

        delete userSocketMap[socket.id];
        socket.leave();
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
});
