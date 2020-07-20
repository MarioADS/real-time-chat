const Users = require('../classes/users');
const users = new Users();

function userConnect (socket){

    const colors = [];

    socket.on('disconnect', () => {
        let userDis = users.delUser(socket.id);
        if (userDis){
            socket.to(userDis.room).emit('userOff', userDis);
        }
    });

    socket.on('userOn', data => {
        let { name,room } = data;
        let user = users.addUser(socket.id,name,room);
        socket.join(room, () => socket.to(user.room).emit('newUser', user) );
    });

    socket.on('messageGroup', data => {
        let user = users.getUser(socket.id);
        let msg = {name: data.name,message: data.message,time: data.time};
        socket.to(data.room).emit('messageGroup', msg);
    });

    socket.on('userTyping', data => {
        let user = users.getUser(socket.id);
        let msg = {name: data.name};
        socket.to(data.room).emit('userTyping',msg);
    });

}

module.exports = userConnect;