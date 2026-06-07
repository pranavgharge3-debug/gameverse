import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Chat() {
  const [activeTab, setActiveTab] = useState<'friends' | 'clans'>('friends');
  const [messageText, setMessageText] = useState('');
  
  const activeChat = {
    name: activeTab === 'friends' ? 'Shroud (Mike)' : 'Sentinels [SEN]',
    status: activeTab === 'friends' ? 'Online' : 'Active Members: 12',
    avatar: activeTab === 'friends' ? 'S' : '🛡️',
  };

  const mockMessages = [
    { id: '1', sender: 'Shroud', content: 'Hey, are you down for Valorant tournaments tonight?', time: '10:04 AM' },
    { id: '2', sender: 'You', content: 'Definitely! I will gather the other clan members.', time: '10:05 AM' },
    { id: '3', sender: 'Shroud', content: 'Awesome, let me know when everyone is ready.', time: '10:06 AM' },
  ];

  return (
    <div className="card glass min-h-[70vh] max-w-6xl mx-auto flex overflow-hidden p-0 border-white/5">
      {/* Sidebar List */}
      <div className="w-80 border-r border-white/5 flex flex-col bg-dark-bg/25">
        {/* Tab Toggle */}
        <div className="flex border-b border-white/5">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-4 text-sm font-semibold tracking-wider transition-colors ${
              activeTab === 'friends' ? 'text-purple-primary border-b-2 border-purple-primary' : 'text-gray-400 hover:text-white'
            }`}
          >
            Friends
          </button>
          <button
            onClick={() => setActiveTab('clans')}
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
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-purple-primary/20 flex items-center justify-center font-bold">S</div>
              <div className="flex-grow min-w-0">
                <div className="font-semibold text-sm truncate">Shroud</div>
                <div className="text-xs text-green-400 truncate">Online</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-purple-primary/20 flex items-center justify-center font-bold">🛡️</div>
              <div className="flex-grow min-w-0">
                <div className="font-semibold text-sm truncate">Sentinels [SEN]</div>
                <div className="text-xs text-gray-400 truncate">12 Members Online</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Pane */}
      <div className="flex-grow flex flex-col bg-dark-bg/40">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-primary/20 flex items-center justify-center font-bold">
            {activeChat.avatar}
          </div>
          <div>
            <h3 className="font-bold text-sm">{activeChat.name}</h3>
            <span className="text-xs text-gray-400">{activeChat.status}</span>
          </div>
        </div>

        {/* Message Logs */}
        <div className="flex-grow p-6 overflow-y-auto space-y-4">
          <div className="text-center py-2">
            <span className="text-[10px] bg-white/5 px-3 py-1 rounded text-gray-500 uppercase tracking-widest font-semibold">Today</span>
          </div>

          {mockMessages.map((msg) => {
            const isMe = msg.sender === 'You';
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="text-[10px] text-gray-400 mb-1">{msg.sender}</div>
                <div className={`p-3 rounded-lg text-sm max-w-sm ${isMe ? 'bg-purple-primary text-white rounded-tr-none' : 'bg-white/5 text-gray-200 rounded-tl-none'}`}>
                  {msg.content}
                </div>
                <div className="text-[9px] text-gray-500 mt-1">{msg.time}</div>
              </div>
            );
          })}
        </div>

        {/* Typing Input */}
        <div className="p-4 border-t border-white/5">
          <form onSubmit={(e) => { e.preventDefault(); setMessageText(''); }} className="flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-grow px-4 py-2.5 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm"
              placeholder="Type your message here..."
            />
            <button type="submit" className="btn-primary py-2 px-6 text-sm">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
