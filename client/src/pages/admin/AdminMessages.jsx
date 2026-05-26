import { useEffect, useMemo, useState } from 'react';
import { adminMessageService } from '../../services/adminService';
import {
  FiFolder,
  FiInbox,
  FiMessageSquare,
  FiRefreshCw,
  FiSearch,
  FiSend,
  FiUser,
} from 'react-icons/fi';

const toLocalMessage = (message, visitorId) => ({
  id: message.id,
  senderId: message.senderRole === 'admin' ? 1 : Number(visitorId),
  receiverId: message.senderRole === 'admin' ? Number(visitorId) : 1,
  senderName: message.senderRole === 'admin' ? (message.senderName || 'Admin Kafumbu') : (message.senderName || 'Visiteur'),
  content: message.content,
  createdAt: message.createdAt,
  read: message.read,
});

export default function AdminMessages() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeFolder, setActiveFolder] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadConversations = async () => {
    setLoading(true);
    const data = await adminMessageService.getConversations();
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const loadThread = async (visitorId = selectedUserId) => {
    if (!visitorId) {
      setMessages([]);
      return;
    }
    const thread = await adminMessageService.getThread(visitorId);
    setMessages(Array.isArray(thread) ? thread.map((message) => toLocalMessage(message, visitorId)) : []);
  };

  useEffect(() => {
    loadConversations();
    const timer = window.setInterval(loadConversations, 12000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    loadThread();
  }, [selectedUserId]);

  const threadsData = useMemo(() => users.map((user) => ({
    user,
    lastMsg: user.last_message ? {
      content: user.last_message,
      createdAt: user.last_message_at,
      senderId: user.last_sender_role === 'admin' ? 1 : user.id,
    } : null,
    unreadCount: Number(user.unread_count || 0),
    totalCount: Number(user.total_count || 0),
  })), [users]);

  const filteredThreads = useMemo(() => threadsData.filter((thread) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q
      || String(thread.user.name || '').toLowerCase().includes(q)
      || String(thread.user.email || '').toLowerCase().includes(q)
      || String(thread.user.company || '').toLowerCase().includes(q)
      || String(thread.lastMsg?.content || '').toLowerCase().includes(q);

    if (activeFolder === 'unread') return matchesQuery && thread.unreadCount > 0;
    if (activeFolder === 'active') return matchesQuery && thread.totalCount > 0;
    return matchesQuery;
  }).sort((a, b) => {
    if (a.lastMsg && b.lastMsg) return new Date(b.lastMsg.createdAt) - new Date(a.lastMsg.createdAt);
    if (a.lastMsg) return -1;
    if (b.lastMsg) return 1;
    return String(a.user.name || '').localeCompare(String(b.user.name || ''));
  }), [activeFolder, searchQuery, threadsData]);

  const selectedUser = users.find((user) => Number(user.id) === Number(selectedUserId));
  const unreadThreads = threadsData.filter((thread) => thread.unreadCount > 0).length;

  const refreshAll = async () => {
    await loadConversations();
    await loadThread();
  };

  const handleSelectUser = async (userId) => {
    setSelectedUserId(userId);
    const thread = await adminMessageService.getThread(userId);
    setMessages(Array.isArray(thread) ? thread.map((message) => toLocalMessage(message, userId)) : []);
    await loadConversations();
  };

  const handleSend = async (event) => {
    event.preventDefault();
    if (!inputText.trim() || !selectedUserId) return;

    setSending(true);
    await adminMessageService.sendToVisitor(selectedUserId, inputText.trim());
    setInputText('');
    await refreshAll();
    setSending(false);
    window.setTimeout(() => {
      const container = document.getElementById('admin-chat-scroll');
      if (container) container.scrollTop = container.scrollHeight;
    }, 50);
  };

  useEffect(() => {
    const container = document.getElementById('admin-chat-scroll');
    if (container) container.scrollTop = container.scrollHeight;
  }, [selectedUserId, messages.length]);

  return (
    <div className="rounded-xl border border-white/10 bg-[#0B1D35] flex flex-col md:flex-row h-[650px] overflow-hidden text-slate-200">
      <div className="w-full md:w-52 border-r border-white/10 p-4 bg-[#08172B]/30 flex flex-col justify-between shrink-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <FiFolder className="text-emerald-500" size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Dossiers Admin</span>
          </div>

          <nav className="space-y-1">
            <button onClick={() => setActiveFolder('active')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeFolder === 'active' ? 'bg-white/5 text-emerald-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <span className="flex items-center gap-2"><FiMessageSquare size={13} />Actives</span>
            </button>
            <button onClick={() => setActiveFolder('unread')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeFolder === 'unread' ? 'bg-white/5 text-emerald-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <span className="flex items-center gap-2"><FiInbox size={13} />Non lus</span>
              {unreadThreads > 0 && <span className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md">{unreadThreads}</span>}
            </button>
            <button onClick={() => setActiveFolder('all')} className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeFolder === 'all' ? 'bg-white/5 text-emerald-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <FiUser size={13} />Tous les visiteurs
            </button>
          </nav>
        </div>

        <button onClick={refreshAll} className="p-2 border-t border-white/5 text-center font-mono text-[7px] text-slate-500 hover:text-emerald-400 inline-flex items-center justify-center gap-1">
          <FiRefreshCw size={10} /> SYNC DB
        </button>
      </div>

      <div className="w-full md:w-72 border-r border-white/10 flex flex-col shrink-0 bg-[#08172B]/10">
        <div className="p-3 border-b border-white/10">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><FiSearch size={12} /></span>
            <input
              type="text"
              placeholder="Rechercher utilisateur..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg text-[10px] font-semibold border border-white/10 bg-[#08172B] text-white outline-none focus:border-emerald-500/40"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {filteredThreads.length === 0 ? (
            <div className="p-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
              {loading ? 'Chargement...' : activeFolder === 'unread' ? 'Aucun message non lu' : 'Aucun fil de discussion'}
            </div>
          ) : filteredThreads.map(({ user, lastMsg, unreadCount }) => (
            <button
              key={user.id}
              onClick={() => handleSelectUser(user.id)}
              className={`w-full p-4 text-left flex items-start gap-3 transition-all ${Number(selectedUserId) === Number(user.id) ? 'bg-white/5 border-l-2 border-emerald-500' : 'hover:bg-white/[0.02]'}`}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                {(user.name || 'V').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider block truncate text-white">{user.name || 'Visiteur'}</span>
                  {lastMsg && <span className="text-[7px] text-slate-500 font-bold block shrink-0 font-mono">{new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                </div>
                {user.company && <span className="text-[7.5px] text-slate-500 font-mono uppercase block truncate">{user.company}</span>}
                <p className={`text-[9px] mt-1 leading-normal truncate ${unreadCount > 0 ? 'font-black text-emerald-400' : 'text-slate-400'}`}>
                  {lastMsg ? lastMsg.content : "Pas encore d'echange..."}
                </p>
              </div>
              {unreadCount > 0 && <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0 animate-pulse" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between h-full bg-[#08172B]/20">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0B1D35]/50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-sm font-mono shrink-0">
                  {(selectedUser.name || 'V').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-white truncate">{selectedUser.name || 'Visiteur'}</span>
                    <span className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-white/10 text-slate-300 bg-white/5">{selectedUser.tier || 'none'}</span>
                  </div>
                  <div className="mt-0.5 text-[8px] text-slate-500 font-bold uppercase tracking-widest truncate">{selectedUser.email}</div>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-[7.5px] font-mono tracking-widest text-slate-500 uppercase block">Organisme: {selectedUser.company || 'Citoyen'}</span>
              </div>
            </div>

            <div id="admin-chat-scroll" className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <FiMessageSquare size={32} className="text-slate-600 mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Aucun historique</span>
                  <p className="text-[9px] text-slate-600 mt-1 max-w-[240px]">Ecrivez le premier message ci-dessous.</p>
                </div>
              ) : messages.map((message) => {
                const isAdmin = message.senderId === 1;
                return (
                  <div key={message.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}>
                    <div className={`max-w-[80%] rounded-xl px-4 py-3 border ${isAdmin ? 'bg-emerald-600/10 border-emerald-500/20 text-emerald-400' : 'bg-[#08172B] border-white/5 text-slate-200'}`}>
                      <div className="flex justify-between items-center gap-8 mb-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 font-mono">{message.senderName}</span>
                        <span className="text-[6.5px] text-slate-500 font-bold">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-[10px] leading-relaxed font-semibold break-words whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-white/10 bg-[#0B1D35]/30 shrink-0">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(event) => setInputText(event.target.value)}
                  placeholder={`Repondre a ${selectedUser.name || 'ce visiteur'}...`}
                  className="flex-1 px-4 py-3 rounded-xl text-xs font-semibold outline-none border border-white/10 bg-[#08172B] text-white focus:border-emerald-500/40"
                />
                <button type="submit" disabled={sending} className="px-5 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white">
                  <FiSend size={14} />
                  <span className="hidden sm:inline">{sending ? 'Envoi...' : 'Envoyer'}</span>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <FiInbox size={48} className="text-slate-700 mb-3" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Selectionnez une discussion</span>
            <p className="text-[10px] text-slate-600 mt-1 max-w-[280px] leading-relaxed font-semibold">Choisissez un visiteur pour voir les messages DB et lui repondre.</p>
          </div>
        )}
      </div>
    </div>
  );
}
