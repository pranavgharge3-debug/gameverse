import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/auth.store';
import { messageAPI } from '../services/api.services';
import { friendAPI } from '../services/api.services';
import { clanAPI } from '../services/api.services';

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

  // Initialize Socket.io connection
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
      // Only add message if it belongs to current conversation
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

  // Load conversations
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

  // Load messages when conversation is selected
  useEffect(() => {
    if (!user || !selectedConversation) return;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const data = await messageAPI.getMessages(selectedConversation.partner.id);
        setMessages(data);
        scrollToBottom();

        // Join the room for real-time updates
        const roomId = `dm_${selectedConversation.partner.id}`;
        socketRef.current?.emit('room:join', roomId);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Leave room when unmounting or changing conversation
    return () => {
      if (selectedConversation) {
        const roomId = `dm_${selectedConversation.partner.id}`;
        socketRef.current?.emit('room:leave', roomId);
      }
    };
  }, [selectedConversation, user]);

  // Load clan messages when clan is selected
  useEffect(() => {
    if (!user || !selectedClan) return;

    const loadClanMessages = async () => {
      setLoading(true);
      try {
        const data = await messageAPI.getMessages(undefined, selectedClan.clan.id);
        setMessages(data);
        scrollToBottom();

        // Join the clan room for real-time updates
        const roomId = `clan_${selectedClan.clan.id}`;
        socketRef.current?.emit('room:join', roomId);
      } catch (error) {
        console.error('Failed to load clan messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClanMessages();

    // Leave room when unmounting or changing clan
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

      // Emit via Socket.io for real-time delivery
      socketRef.current?.emit('message:send', { roomId, message });

      setMessages((prev) => [...prev, message]);
      setMessageText('');
      scrollToBottom();

      // Stop typing indicator
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

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Auto-stop typing after 3 seconds of inactivity
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
    <div className="card glass min-h-[70vh] max-w-6xl mx-auto flex overflow-hidden p-0 border-white/5">
      {/* Sidebar List */}
      <div className="w-80 border-r border-white/5 flex flex-col bg-dark-bg/25">
        {/* Tab Toggle */}
        <div className="flex border-b border-white/5">
          <button
            onClick={() => {
              setActiveTab('friends');
              setSelectedConversation(null);
              setSelectedClan(null);
              setMessages([]);
            }}
            className={`flex-1 py-4 text-sm font-semibold tracking-wider transition-colors ${
              activeTab === 'friends' ? 'text-purple-primary border-b-2 border-purple-primary' : 'text-gray-400 hover:text-white'
            }`}
          >
            Friends
          </button>
          <button
            onClick={() => {
              setActiveTab('clans');
              setSelectedConversation(null);
              setSelectedClan(null);
              setMessages([]);
            }}
            className={`flex-1 py-4 text-sm font-semibold tracking-wider transition-colors ${
              activeTab === 'clans' ? 'text-purple-primary border-b-2 border-purple-primary' : 'text-gray-400 hover:text-white'
            }`}
          >
            Clans
          </button>
        </div>

        {/* List of Contacts */}
        <div className="flex-grow overflow-y-auto p-4 space-y-2">
          {activeTab === 'friends' ? (
            conversations.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No conversations yet. Start chatting with friends!
              </div>
            ) : (
              conversations.map((conv) => {
                const isOnline = onlineUsers.includes(conv.partner.id);
                const isSelected = selectedConversation?.partner.id === conv.partner.id;

                return (
                  <div
                    key={conv.partner.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'bg-purple-primary/20 border border-purple-primary/30' : 'bg-white/5 border border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-purple-primary/20 flex items-center justify-center font-bold">
                        {conv.partner.avatarUrl ? (
                          <img src={conv.partner.avatarUrl} alt={conv.partner.username} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          conv.partner.username[0]
                        )}
                      </div>
                      {isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-dark-card"></div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="font-semibold text-sm truncate">{conv.partner.username}</div>
                      <div className={`text-xs truncate ${isOnline ? 'text-green-400' : 'text-gray-400'}`}>
                        {isOnline ? 'Online' : 'Offline'}
                      </div>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            clanConversations.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No clan chats yet. Join a clan to start chatting!
              </div>
            ) : (
              clanConversations.map((clanConv) => {
                const isSelected = selectedClan?.clan.id === clanConv.clan.id;

                return (
                  <div
                    key={clanConv.clan.id}
                    onClick={() => setSelectedClan(clanConv)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'bg-purple-primary/20 border border-purple-primary/30' : 'bg-white/5 border border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-primary/20 flex items-center justify-center font-bold">
                      🛡️
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="font-semibold text-sm truncate">{clanConv.clan.name}</div>
                      <div className="text-xs text-gray-400 truncate">{clanConv.memberCount} Members</div>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
      </div>

      {/* Main Chat Pane */}
      <div className="flex-grow flex flex-col bg-dark-bg/40">
        {activeChatInfo ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-primary/20 flex items-center justify-center font-bold">
                {typeof activeChatInfo.avatar === 'string' && activeChatInfo.avatar.startsWith('http') ? (
                  <img src={activeChatInfo.avatar} alt={activeChatInfo.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  activeChatInfo.avatar
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm">{activeChatInfo.name}</h3>
                <span className={`text-xs ${activeChatInfo.isOnline ? 'text-green-400' : 'text-gray-400'}`}>
                  {activeChatInfo.status}
                </span>
              </div>
            </div>

            {/* Message Logs */}
            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              {loading ? (
                <div className="text-center py-12 text-gray-500">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                <>
                  <div className="text-center py-2">
                    <span className="text-[10px] bg-white/5 px-3 py-1 rounded text-gray-500 uppercase tracking-widest font-semibold">
                      Today
                    </span>
                  </div>

                  {messages.map((msg) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        {!isMe && (
                          <div className="text-[10px] text-gray-400 mb-1">{msg.sender.username}</div>
                        )}
                        <div
                          className={`p-3 rounded-lg text-sm max-w-sm ${
                            isMe ? 'bg-purple-primary text-white rounded-tr-none' : 'bg-white/5 text-gray-200 rounded-tl-none'
                          }`}
                        >
                          {msg.content}
                        </div>
                        <div className="text-[9px] text-gray-500 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {/* Typing Indicator */}
              {currentTyping && (
                <div className="text-xs text-purple-primary animate-pulse">
                  {currentTyping.username} is typing...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Typing Input */}
            <div className="p-4 border-t border-white/5">
              <form onSubmit={handleSendMessage} className="flex gap-2">
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
                  className="flex-grow px-4 py-2.5 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm"
                  placeholder="Type your message here..."
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="btn-primary py-2 px-6 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
