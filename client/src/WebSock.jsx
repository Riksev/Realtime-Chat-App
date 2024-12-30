import React, { useState, useRef } from 'react'

const WebSock = () => {
  const [messages, setMessages] = useState([])
  const [value, setValue] = useState('')
  const socket = useRef()
  const [connected, setConnected] = useState(false)
  const [username, setUsername] = useState('')

  const SERVER_PORT = 5000

  function connect() {
    socket.current = new WebSocket(`ws://localhost:${SERVER_PORT}`)

    socket.current.onopen = () => {
      setConnected(true)
      const message = {
        event: 'connection',
        username,
        id: Date.now(),
      }
      socket.current.send(JSON.stringify(message))
      console.log('Connection is established')
    }
    socket.current.onmessage = event => {
      const message = JSON.parse(event.data)
      setMessages(prev => [message, ...prev])
    }
    socket.current.onclose = () => {
      console.log('Server is closed')
    }
    socket.current.onerror = () => {
      console.log('Server got an error')
    }
  }

  const sendMessage = async () => {
    const message = {
      username,
      message: value,
      id: Date.now(),
      event: 'message',
    }
    socket.current.send(JSON.stringify(message))
    setValue('')
  }

  if (!connected) {
    return (
      <div className="center">
        <div className="form">
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            type="text"
            placeholder="User name"
          />
          <button onClick={connect}>Connect</button>
        </div>
      </div>
    )
  }

  return (
    <div className="center">
      <div>
        <div className="form">
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            type="text"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
        <div className="messages">
          {messages.map(mess => (
            <div key={mess.id}>
              {mess.event === 'connection' ? (
                <div className="connection_message">
                  User {mess.username} is connected
                </div>
              ) : (
                <div className="message">
                  {mess.username}: {mess.message}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WebSock
