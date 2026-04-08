'use client'
import { useEffect, useState } from 'react'
import { getConversations, getCurrentUser } from '@/lib/store'
import type { Conversation } from '@/types'
import ChatContainer from '@/components/messages/ChatContainer'
import { cn, formatTimeAgo } from '@/lib/utils'

export default function ProMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [active, setActive] = useState<Conversation | null>(null)
  const user = typeof window !== 'undefined' ? getCurrentUser() : null

  useEffect(() => {
    const all = getConversations()
    const filtered = all.filter((c: Conversation) => c.pro_id === user?.id)
    setConversations(filtered)
    if (filtered.length > 0) setActive(filtered[0])
  }, [user?.id])

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-syne font-bold text-2xl text-green-dark mb-6">Messages</h1>

      <div className="bg-white rounded-2xl border border-green-pale shadow-sm overflow-hidden flex h-[600px]">
        {/* Liste */}
        <div className="w-72 border-r border-green-pale flex flex-col">
          <div className="px-4 py-3 border-b border-green-pale">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Conversations
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 && (
              <div className="text-center text-gray-400 text-sm p-6">
                Aucune conversation.
              </div>
            )}
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActive(conv)}
                className={cn(
                  'w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-green-pale/30 transition-colors',
                  active?.id === conv.id && 'bg-green-pale/50'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-green-dark truncate">
                      {conv.client_nom}
                    </div>
                    <div className="text-xs text-gray-400 truncate mt-0.5">
                      {conv.ao_titre}
                    </div>
                    {conv.dernier_message && (
                      <div className="text-xs text-gray-500 truncate mt-1">
                        {conv.dernier_message}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {conv.dernier_message_at && (
                      <span className="text-xs text-gray-400">
                        {formatTimeAgo(conv.dernier_message_at)}
                      </span>
                    )}
                    {conv.nb_non_lus > 0 && (
                      <span className="bg-green-mid text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {conv.nb_non_lus}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1">
          {active ? (
            <ChatContainer conversation={active} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Sélectionnez une conversation
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
