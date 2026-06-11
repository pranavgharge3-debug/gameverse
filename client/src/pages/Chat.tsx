import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/auth.store';
import { messageAPI } from '../services/api.services';
import { FiMessageSquare, FiHash, FiSend, FiUsers, FiMoreHorizontal } from 'react-icons/fi';

interface Message {
  id: string;
  content: string;
  senderId: string;
  recipientId?: string;
  clanId?: string;
  createdAt: string;
  readAt?: string;
  mediaUrls?: string[];
  sender: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  recipient?: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  clan?: {
    id: string;
    name: string;
    tag: string;
  };
}

interface Conversation {
  partner: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  lastMessage: Message;
  unreadCount: number;
}

interface ClanConversation {
  clan: {
    id: string;
    name: string;
    tag: string;
    avatarUrl?: string;
  };
  lastMessage?: Message;
  memberCount: number;
}

export default function Chat() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'friends' | 'clans'>('friends');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [selectedClan, setSelectedClan] = useState<ClanConversation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [clanConversations, setClanConversations] = useState<ClanConversation[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<Map<string, { userId: string; username: string }>>(new Map());
  const [loading, setLoading] = useState(false);
  
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000', {
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to Socket.io');
      socket.emit('user:online', user.id);
    });

    socket.on('users:online', (users: string[]) => {
      setOnlineUsers(users);
    });

    socket.on('message:receive', (message: Message) => {
      const currentRoomId = selectedConversation ? `dm_${selectedConversation.partner.id}` : selectedClan ? `clan_${selectedClan.clan.id}` : null;
      const messageRoomId = message.recipientId ? `dm_${message.recipientId}` : message.clanId ? `clan_${message.clanId}` : null;

      if (currentRoomId === messageRoomId) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
    });

    socket.on('typing:started', ({ userId, username, roomId }: { userId: string; username: string; roomId: string }) => {
      setTypingUsers((prev) => new Map(prev).set(roomId, { userId, username }));
    });

    socket.on('typing:stopped', ({ userId, roomId }: { userId: string; roomId: string }) => {
      setTypingUsers((prev) => {
        const newMap = new Map(prev);
        if (newMap.get(roomId)?.userId === userId) {
          newMap.delete(roomId);
        }
        return newMap;
      });
    });

    socket.on('user:joined', ({ userId, roomId }: { userId: string; roomId: string }) => {
      console.log(`User ${userId} joined room ${roomId}`);
    });

    socket.on('user:left', ({ userId, roomId }: { userId: string; roomId: string }) => {
      console.log(`User ${userId} left room ${roomId}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const loadConversations = async () => {
      try {
        const [convData, clanConvData] = await Promise.all([
          messageAPI.getConversations(),
          messageAPI.getClanConversations(),
        ]);
        setConversations(convData);
        setClanConversations(clanConvData);
      } catch (error) {
        console.error('Failed to load conversations:', error);
      }
    };

    loadConversations();
  }, [user]);

  useEffect(() => {
    if (!user || !selectedConversation) return;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const data = await messageAPI.getMessages(selectedConversation.partner.id);
        setMessages(data);
        scrollToBottom();

        const roomId = `dm_${selectedConversation.partner.id}`;
        socketRef.current?.emit('room:join', roomId);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    return () => {
      if (selectedConversation) {
        const roomId = `dm_${selectedConversation.partner.id}`;
        socketRef.current?.emit('room:leave', roomId);
      }
    };
  }, [selectedConversation, user]);

  useEffect(() => {
    if (!user || !selectedClan) return;

    const loadClanMessages = async () => {
      setLoading(true);
      try {
        const data = await messageAPI.getMessages(undefined, selectedClan.clan.id);
        setMessages(data);
        scrollToBottom();

        const roomId = `clan_${selectedClan.clan.id}`;
        socketRef.current?.emit('room:join', roomId);
      } catch (error) {
        console.error('Failed to load clan messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClanMessages();

    return () => {
      if (selectedClan) {
        const roomId = `clan_${selectedClan.clan.id}`;
        socketRef.current?.emit('room:leave', roomId);
      }
    };
  }, [selectedClan, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !user) return;

    const roomId = selectedConversation 
      ? `dm_${selectedConversation.partner.id}`
      : selectedClan 
      ? `clan_${selectedClan.clan.id}`
      : null;

    if (!roomId) return;

    try {
      const message = await messageAPI.sendMessage(
        selectedConversation?.partner.id,
        selectedClan?.clan.id,
        messageText.trim()
      );

      socketRef.current?.emit('message:send', { roomId, message });

      setMessages((prev) => [...prev, message]);
      setMessageText('');
      scrollToBottom();

      socketRef.current?.emit('typing:stop', { roomId });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTypingStart = () => {
    if (!user) return;

    const roomId = selectedConversation 
      ? `dm_${selectedConversation.partner.id}`
      : selectedClan 
      ? `clan_${selectedClan.clan.id}`
      : null;

    if (!roomId) return;

    socketRef.current?.emit('typing:start', { roomId, username: user.username });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('typing:stop', { roomId });
    }, 3000);
  };

  const handleTypingStop = () => {
    const roomId = selectedConversation 
      ? `dm_${selectedConversation.partner.id}`
      : selectedClan 
      ? `clan_${selectedClan.clan.id}`
      : null;

    if (!roomId) return;

    socketRef.current?.emit('typing:stop', { roomId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const getActiveChatInfo = () => {
    if (selectedConversation) {
      const isOnline = onlineUsers.includes(selectedConversation.partner.id);
      return {
        name: selectedConversation.partner.username,
        status: isOnline ? 'Online' : 'Offline',
        avatar: selectedConversation.partner.avatarUrl || selectedConversation.partner.username[0],
        isOnline,
      };
    }

    if (selectedClan) {
      return {
        name: `${selectedClan.clan.name} [${selectedClan.clan.tag}]`,
        status: `${selectedClan.memberCount} Members`,
        avatar: '🛡️',
        isOnline: true,
      };
    }

    return null;
  };

  const activeChatInfo = getActiveChatInfo();
  const currentRoomId = selectedConversation 
    ? `dm_${selectedConversation.partner.id}`
    : selectedClan 
    ? `clan_${selectedClan.clan.id}`
    : null;
  const currentTyping = currentRoomId ? typingUsers.get(currentRoomId) : null;

  return (
    <div className="card min-h-[calc(100vh-8rem)] max-w-7xl mx-auto flex overflow-hidden p-0">
      {/* Sidebar */}
      <div className="w-72 border-r border-white/5 flex flex-col bg-gray-900">
        {/* Header */}
        <div className="p-4 border-b border-white/5">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FiMessageSquare className="text-purple-primary" />
            Messages
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5">
          <button
            onClick={() => {
              setActiveTab('friends');
              setSelectedConversation(null);
              setSelectedClan(null);
              setMessages([]);
            }}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'friends' ? 'text-purple-primary bg-purple-primary/10' : 'text-gray-400 hover:text-white'
            }`}
          >
            Direct Messages
          </button>
          <button
            onClick={() => {
              setActiveTab('clans');
              setSelectedConversation(null);
              setSelectedClan(null);
              setMessages([]);
            }}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'clans' ? 'text-purple-primary bg-purple-primary/10' : 'text-gray-400 hover:text-white'
            }`}
          >
            <FiHash className="inline mr-1" />
            Clans
          </button>
        </div>

        {/* List */}
        <div className="flex-grow overflow-y-auto">
          {activeTab === 'friends' ? (
            conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                <FiMessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                <p>No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const isOnline = onlineUsers.includes(conv.partner.id);
                const isSelected = selectedConversation?.partner.id === conv.partner.id;

                return (
                  <div
                    key={conv.partner.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`flex items-center gap-3 p-4 cursor-pointer transition-all ${
                      isSelected ? 'bg-purple-primary/20 border-l-2 border-purple-primary' : 'hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-primary to-purple-dark flex items-center justify-center font-bold text-white">
                        {conv.partner.avatarUrl ? (
                          <img src={conv.partner.avatarUrl} alt={conv.partner.username} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          conv.partner.username[0]
                        )}
                      </div>
                      {isOnline && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-gray-900"></div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="font-semibold text-sm">{conv.partner.username}</div>
                      <div className={`text-xs truncate ${isOnline ? 'text-emerald-500' : 'text-gray-400'}`}>
                        {isOnline ? 'Online' : 'Offline'}
                      </div>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            clanConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                <FiHash size={32} className="mx-auto mb-2 opacity-50" />
                <p>No clan chats yet</p>
              </div>
            ) : (
              clanConversations.map((clanConv) => {
                const isSelected = selectedClan?.clan.id === clanConv.clan.id;

                return (
                  <div
                    key={clanConv.clan.id}
                    onClick={() => setSelectedClan(clanConv)}
                    className={`flex items-center gap-3 p-4 cursor-pointer transition-all ${
                      isSelected ? 'bg-purple-primary/20 border-l-2 border-purple-primary' : 'hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-accent to-purple-primary flex items-center justify-center">
                      <span className="text-xl">🛡️</span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="font-semibold text-sm">{clanConv.clan.name}</div>
                      <div className="text-xs text-gray-400">{clanConv.memberCount} members</div>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col bg-dark-card">
        {activeChatInfo ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-gray-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-primary to-purple-dark flex items-center justify-center font-bold text-white">
                  {typeof activeChatInfo.avatar === 'string' && activeChatInfo.avatar.startsWith('http') ? (
                    <img src={activeChatInfo.avatar} alt={activeChatInfo.name} className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    activeChatInfo.avatar
                  )}
                </div>
                <div>
                  <h3 className="font-bold">{activeChatInfo.name}</h3>
                  <span className={`text-xs ${activeChatInfo.isOnline ? 'text-emerald-500' : 'text-gray-400'}`}>
                    {activeChatInfo.status}
                  </span>
                </div>
              </div>
              <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                <FiMoreHorizontal size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              {loading ? (
                <div className="text-center py-12 text-gray-400">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-4">💬</div>
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <>
                  <div className="text-center py-4">
                    <span className="text-xs bg-white/5 px-4 py-2 rounded-full text-gray-400 uppercase tracking-wider font-semibold">
                      Today
                    </span>
                  </div>

                  {messages.map((msg) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md ${isMe ? 'text-right' : 'text-left'}`}>
                          {!isMe && (
                            <div className="text-xs text-gray-400 mb-1 font-semibold">{msg.sender.username}</div>
                          )}
                          <div
                            className={`inline-block px-4 py-3 rounded-2xl text-sm ${
                              isMe 
                                ? 'bg-gradient-to-r from-purple-primary to-purple-dark text-white rounded-br-md' 
                                : 'bg-white/5 text-gray-200 rounded-bl-md'
                            }`}
                          >
                            {msg.content}
                          </div>
                          <div className="text-[10px] text-gray-500 mt-1">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {currentTyping && (
                <div className="text-xs text-purple-primary animate-pulse">
                  {currentTyping.username} is typing...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-gray-900">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value);
                    if (e.target.value.trim()) {
                      handleTypingStart();
                    } else {
                      handleTypingStop();
                    }
                  }}
                  onBlur={handleTypingStop}
                  className="flex-grow px-4 py-3 bg-dark-card border border-white/10 rounded-xl focus:outline-none focus:border-purple-primary text-white text-sm"
                  placeholder="Type a message..."
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="btn-primary py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-400">
            <div className="text-center">
              <FiMessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
