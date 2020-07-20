import React, { Component } from 'react';
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import SocketIOClient from 'socket.io-client';

import './style.css';

class App extends Component {

  socket = SocketIOClient('localhost:7070');
  time = new Date();
  
  constructor (){
    super();
    this.state = {
      user: null,
      userTyping: '',
      messages: [],
      newUser: ''
    };

    this.newMessage = React.createRef();
  }

  componentDidMount (){
    this.handleName().then(() => this.state.user.name ? this.socket.emit('userOn',this.state.user) : null );

    this.socket.on('connect', () => {
      console.log('Bienvenido');
      // socket listeners
      this.socket.on('newUser', data => {
        this.setState(prevState => ({messages: [...prevState.messages,{message: `${data.name} se ha conectado`,status: true}]}));
      });

      this.socket.on('userOff', data => {
        this.setState(prevState => ({messages: [...prevState.messages,{message: `${data.name} se ha desconectado`,status: false}]}));
      });

      this.socket.on('userTyping', data => {
        this.setState({userTyping: `${data.name}  está escribiendo...`});
      });

      this.socket.on('messageGroup', data => {
        this.setState(prevState => ({messages: [...prevState.messages,data],userTyping: ''}));
      });
      
    });
  }

  handleName = async () => {
    const userName = prompt('Ingresa tu nombre','');
    const dataUser = {name: userName,room: 'social chat'}
    dataUser ? this.setState({user: dataUser}) : alert('Necesitas ingresar tu nombre');    
  };

  handleTyping = () => this.state.user.name ? this.socket.emit('userTyping',this.state.user) : null;
  
  handleMessage = async (newMessage) => this.setState(prevState => ({messages: [...prevState.messages,newMessage]}));

  sendMessage = () => {
    const sendMessage = {
      message: this.newMessage.current.value, 
      time: `${this.time.getHours()}:${this.time.getMinutes()}`,
      name: this.state.user.name,
      room: this.state.user.room,
      itSelf: true
    };
    
    this.handleMessage(sendMessage).then( () => {
      this.socket.emit('messageGroup', sendMessage);
      this.newMessage.current.value = '';
    });
    
  };

  ChatHeader = () => {
    return (
      <div className = 'chatHeader'>
        <h4>Social Chat</h4>
        <p>{ this.state.userTyping }</p>
      </div>
    );
  };

  MessageSent = (props) => {
    const { message, time, id} = props.data;
    return (
      <div className="outMessages" key = {id}>
        <div className="sentMessages">
            <p> 
              {message}
              <span className="timeMessage">{time}</span>
            </p>
          </div>
      </div>);
  };

  MessageReceived = (props) => {
    const { name, message, time, id } = props.data;
    return (
      <div className="inMessages" key = {id}>
        <div className="recivedMessages">
          <p> 
            <b style = {{color: 'black'}}>{name}</b><br></br>
              {message}
            <span className="timeMessage">{time}</span>
          </p>
        </div>
      </div>);
  };

  ChatContainer = () => {
    return (
      <div className = 'chatMessages'>
        { this.state.messages.map( (msg,index) => {
          if (Object.keys(msg).length === 3) return <this.MessageReceived data = {{name: msg.name, message: msg.message, time: msg.time,key: index}}/>
          if (msg.itSelf) return <this.MessageSent data = {{message: msg.message, time: msg.time,key: index}}/> 
          if (msg.status === true) return <p className = 'userStatus' style = {{color: 'green'}} key = {index}>{msg.message}</p> 
          if (msg.status === false) return <p className = 'userStatus' style = {{color: 'red'}} key = {index}>{msg.message}</p> 
        }) }
      </div>
    );
  };

  ChatFooter = () => {
    return (
      <div className = 'chatFooter'>
        <div className="typeMsg">
          <div className="inputMsg">
            <input type="text" className="msgWrite" placeholder="Escribe un mensaje" autoFocus onKeyPress = {this.handleTyping} ref = {this.newMessage}/>
            <button onClick = { this.sendMessage } style = {{marginRight: '15px'}} className="btnStyle"> <FontAwesomeIcon icon= {faPaperPlane} /></button>
          </div>
        </div>
      </div>
    );
  };

  render (){
    if (this.state.user){
      return (
        <div className = 'containerMain'>
          <this.ChatHeader />
          <this.ChatContainer />
          <this.ChatFooter />
        </div>
      );
    }else {
      return <div>RECARGA LA PAGÍNA</div>;
    }
  }
}


export default App;
