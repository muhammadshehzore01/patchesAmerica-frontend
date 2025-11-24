'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function LiveChat({ room = 'support', isAdmin = false, adminToken = null }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const wsRef = useRef(null)
  const messagesRef = useRef(null)

  useEffect(() => {
    fetch(`/api/chat/${room}`).then(r => r.json()).then(d => setMessages(d || []))
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws'
    const tokenQuery = isAdmin && adminToken ? `?token=${adminToken}` : ''
    // Note: WS host points to :8000 where Daphne runs
    const wsUrl = `${protocol}://${location.hostname}:8000/ws/chat/${room}/${tokenQuery}`
    wsRef.current = new WebSocket(wsUrl)
    wsRef.current.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data)
        setMessages(prev => [...prev, { sender: data.sender, text: data.message }])
        // scroll
        setTimeout(() => messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' }), 50)
      } catch { }
    }
    return () => wsRef.current && wsRef.current.close()
  }, [room, isAdmin, adminToken])

  function send() {
    if (!text.trim() || !wsRef.current) return
    wsRef.current.send(JSON.stringify({ message: text }))
    setText('')
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed right-6 bottom-6 w-80 max-h-[68vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      <div className="p-3 bg-gradient-to-r from-[#002147] to-[#003366] text-white font-semibold">Live Support</div>
      <div ref={messagesRef} className="p-3 overflow-auto flex-1 space-y-3 bg-white">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[80%] ${m.sender === 'admin' ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
            <div className={`inline-block px-4 py-2 rounded-2xl ${m.sender === 'admin' ? 'bg-[#eef6ff]' : 'bg-gray-100'}`}>
              <div className="text-xs text-gray-500">{m.sender}</div>
              <div className="text-sm">{m.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 flex gap-2 border-t border-gray-100">
        <input value={text} onChange={e => setText(e.target.value)} className="flex-1 p-2 rounded-md border" placeholder="Ask us anything..." />
        <button onClick={send} className="px-3 py-2 rounded-md bg-[#002147] text-white">Send</button>
      </div>
    </motion.div>
  )
}
