'use client'
import { useState, useEffect, useRef } from 'react'
import { getMessagesByConversation, sendMessage, getCurrentUser } from '@/lib/store'
import type { Message, Conversation } from '@/types'
import { formatTimeAgo } from '@/lib/utils'
import Button from '@/components/ui/Button'

interface ChatContainerProps {
  conversation: Conversation
}

export default function ChatContainer({ conversation }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [texte, setTexte] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const user = getCurrentUser()

  useEffect(() => {
    setMessages(getMessagesByConversation(conversation.id))
  }, [conversation.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!texte.trim() || !user) return

    const msg = sendMessage({
      conversation_id: conversation.id,
      expediteur_id: user.id,
      expediteur_nom: `${user.prenom} ${user.nom}`,
      expediteur_role: user.role as 'client' | 'pro',
      contenu: texte.trim(),
    })
    setMessages((prev) => [...prev, msg])
    setTexte('')
  }

  return (
    <div className="flex flex-col h-full">
      {/* En-tête conversation */}
      <div className="px-4 py-3 border-b border-green-pale bg-white">
        <div className="font-syne font-bold text-sm text-green-dark truncate">
          {conversation.ao_titre}
        </div>
        <div className="text-xs text-gray-400">
          {user?.role === 'client' ? conversation.pro_nom : conversation.client_nom}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm mt-8">
            Commencez la conversation…
          </div>
        )}
        {messages.map((msg) => {
          const isMine = msg.expediteur_id === user?.id
          return (
            <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                  isMine
                    ? 'bg-green-mid text-white rounded-br-sm'
                    : 'bg-white border border-green-pale text-green-dark rounded-bl-sm'
                }`}
              >
                {msg.contenu}
              </div>
              <span className="text-xs text-gray-400 mt-0.5">
                {formatTimeAgo(msg.created_at)}
              </span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Zone de saisie */}
      <form onSubmit={handleSend} className="flex gap-2 p-3 border-t border-green-pale bg-white">
        <input
          type="text"
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          placeholder="Votre message…"
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-light"
        />
        <Button type="submit" size="sm" disabled={!texte.trim()}>
          Envoyer
        </Button>
      </form>
    </div>
  )
}
