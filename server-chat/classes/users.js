class Users {

    constructor (){
        this.users = [];
    }

    addUser (user_id,name,room){
        let user = { user_id,name,room };
        this.users.push(user)
        return user;
    }

    getUser (user_id){
        let user = this.users.find(users => users.user_id === user_id);
        return user;
    }

    delUser (user_id){
        let index = this.users.findIndex(users => users.user_id === user_id);
        let user = this.getUser(user_id);
        this.users.splice(index,1);
        return user;
    }

    getUsers (){
        return this.user;
    }

}

module.exports = Users;