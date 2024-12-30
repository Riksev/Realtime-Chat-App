import React, { useEffect, useState } from 'react'
import axios from 'axios'

const EventSourcing = () => {
  const [messages, setMessages] = useState([])
  const [value, setValue] = useState('')

  const SERVER_PORT = 5000

  const subscribe = async () => {
    const eventSource = new EventSource(
      `http://localhost:${SERVER_PORT}/connect`
    )
    eventSource.onmessage = function (event) {
      const message = JSON.parse(event.data)
      setMessages(prev => [message, ...prev])
    }
  }

  useEffect(() => {
    subscribe()
  }, [])

  const sendMessage = async () => {
    await axios.post(`http://localhost:${SERVER_PORT}/new-messages`, {
      message: value,
      id: Date.now(),
    })
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
            <div className="message" key={mess.id}>
              {mess.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EventSourcing
