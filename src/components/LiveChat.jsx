'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function LiveChat({ room = 'support', isAdmin = false, adminToken = null }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const wsRef = useRef(null)
  const messagesRef = useRef(null)

  // ===== GA4 Event Tracker =====
  function trackEvent(action, params = {}) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, params)
    }
  }

  // ===== Load initial messages and setup WebSocket =====
  useEffect(() => {
    // Track chat open
    trackEvent('livechat_open', { room, sender_type: isAdmin ? 'admin' : 'user' })

    // Fetch previous messages
    fetch(`/api/chat/${room}`)
      .then(r => r.json())
      .then(d => setMessages(d || []))
      .catch(err => console.error('[LiveChat] fetch error', err))

    // Setup WebSocket
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws'
    const tokenQuery = isAdmin && adminToken ? `?token=${adminToken}` : ''
    const wsUrl = `${protocol}://${location.hostname}:8000/ws/chat/${room}/${tokenQuery}`

    wsRef.current = new WebSocket(wsUrl)

    wsRef.current.onopen = () => console.log('[LiveChat] connected:', wsUrl)
    wsRef.current.onclose = () => console.log('[LiveChat] disconnected')
    wsRef.current.onerror = (e) => console.error('[LiveChat] WS error', e)

    wsRef.current.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data)
        setMessages(prev => [...prev, { sender: data.sender, text: data.message }])

        // Track incoming message
        trackEvent('livechat_message_received', {
          room,
          sender_type: data.sender === 'admin' ? 'admin' : 'user',
          message_length: data.message.length
        })

        // Scroll to bottom
        setTimeout(() => messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' }), 50)
      } catch (err) {
        console.error('[LiveChat] message parse error', err)
      }
    }

    return () => wsRef.current?.close()
  }, [room, isAdmin, adminToken])

  // ===== Send a message =====
  function send() {
    if (!text.trim() || !wsRef.current) return

    wsRef.current.send(JSON.stringify({ message: text }))

    // Track sent message
    trackEvent('livechat_message', {
      room,
      sender_type: isAdmin ? 'admin' : 'user',
      message_length: text.length,
      message_text: text // optional, remove for privacy
    })

    setText('')
  }

  // ===== Optional: Track chat close =====
  function handleClose() {
    trackEvent('livechat_close', { room, sender_type: isAdmin ? 'admin' : 'user' })
    // You can hide the chat here
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed right-6 bottom-6 w-80 max-h-[68vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
    >
      <div className="p-3 bg-gradient-to-r from-[#002147] to-[#003366] text-white font-semibold flex justify-between items-center">
        <span>Live Support</span>
        <button onClick={handleClose} className="text-white text-lg font-bold">×</button>
      </div>

      <div ref={messagesRef} className="p-3 overflow-auto flex-1 space-y-3 bg-white">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[80%] ${m.sender === 'admin' ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
            <div className={`inline-block px-4 py-2 rounded-2xl ${m.sender === 'admin' ? 'bg-[#eef6ff]' : 'bg-gray-100'}`}>
              <div className="text-xs text-gray-500">{m.sender}</div>
              <div className="text-sm break-words">{m.text}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 flex gap-2 border-t border-gray-100">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 p-2 rounded-md border focus:outline-none focus:ring-1 focus:ring-[#002147]"
          placeholder="Ask us anything..."
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button onClick={send} className="px-3 py-2 rounded-md bg-[#002147] text-white hover:bg-[#003366] transition-colors">
          Send
        </button>
      </div>
    </motion.div>
  )
}
