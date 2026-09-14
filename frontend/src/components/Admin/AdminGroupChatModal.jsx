import React, { useState, useEffect, useRef } from 'react';
import { 
  FaTrash, FaUserPlus, FaUsers, FaPaperPlane, 
  FaImage, FaTimes, FaAt, FaSmile, FaCheck 
} from 'react-icons/fa';

const defaultUsersList = [
  { _id: 'u-1', fullName: 'keshan', role: 'Senior developer', username: 'keshan', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=keshan' },
  { _id: 'u-2', fullName: 'dinith', role: 'Dev', username: 'dinith', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dinith' },
  { _id: 'u-3', fullName: 'Ashen Silva', role: 'Guide Admin', username: 'ashen', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ashen' },
  { _id: 'u-4', fullName: 'Sahas Hiru', role: 'Tourist', username: 'sahas', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sahas' },
];

const initialGroupsData = [
  {
    _id: 'g-1',
    groupName: 'gggg',
    members: [
      { user: { _id: 'u-1', fullName: 'keshan', role: 'Senior developer', username: 'keshan' }, role: 'Admin' },
      { user: { _id: 'u-2', fullName: 'dinith', role: 'Dev', username: 'dinith' }, role: 'Member' }
    ]
  }
];

const initialMessagesData = {
  'g-1': [
    {
      _id: 'm-1',
      sender: { _id: 'u-1', fullName: 'keshan', username: 'keshan' },
      text: 'Hey @dinith check the new marketplace pull request updates!',
      imageUrl: null,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      _id: 'm-2',
      sender: { _id: 'u-2', fullName: 'dinith', username: 'dinith' },
      text: 'Sure @keshan! Checking it right now.',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    }
  ]
};

const AdminGroupChatModal = ({ isOpen, onClose }) => {
  const [groups, setGroups] = useState(initialGroupsData);
  const [activeGroup, setActiveGroup] = useState(initialGroupsData[0]);
  const [messages, setMessages] = useState(initialMessagesData);
  const [availableUsers, setAvailableUsers] = useState(defaultUsersList);

  const [selectedUserToAdd, setSelectedUserToAdd] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  // Chat message state
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Mention autocomplete state
  const [mentionQuery, setMentionQuery] = useState(null);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);

  // Zoomed Image preview modal state
  const [zoomedImage, setZoomedImage] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch users from backend if available
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users');
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setAvailableUsers(data.data);
        }
      } catch (err) {
        console.error("Backend fetch error, using default users list", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeGroup]);

  if (!isOpen) return null;

  // Handle creating a new group
  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newGrp = {
      _id: `g-${Date.now()}`,
      groupName: newGroupName.trim(),
      members: [
        { user: defaultUsersList[0], role: 'Admin' }
      ]
    };

    setGroups(prev => [newGrp, ...prev]);
    setActiveGroup(newGrp);
    setMessages(prev => ({ ...prev, [newGrp._id]: [] }));
    setNewGroupName('');
    setIsCreatingGroup(false);
  };

  // Handle adding a user to active group
  const handleAddMember = () => {
    if (!selectedUserToAdd || !activeGroup) return;

    const userObj = availableUsers.find(u => u._id === selectedUserToAdd);
    if (!userObj) return;

    const isAlreadyMember = activeGroup.members.some(m => m.user._id === userObj._id);
    if (isAlreadyMember) return;

    const updatedGroup = {
      ...activeGroup,
      members: [...activeGroup.members, { user: userObj, role: 'Member' }]
    };

    setActiveGroup(updatedGroup);
    setGroups(prev => prev.map(g => g._id === updatedGroup._id ? updatedGroup : g));
    setSelectedUserToAdd('');
  };

  // Handle removing member from active group
  const handleRemoveMember = (userId) => {
    if (!activeGroup) return;

    const updatedGroup = {
      ...activeGroup,
      members: activeGroup.members.filter(m => m.user._id !== userId)
    };

    setActiveGroup(updatedGroup);
    setGroups(prev => prev.map(g => g._id === updatedGroup._id ? updatedGroup : g));
  };

  // Handle deleting active group
  const handleDeleteGroup = (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group chat?")) return;

    const remaining = groups.filter(g => g._id !== groupId);
    setGroups(remaining);
    if (remaining.length > 0) {
      setActiveGroup(remaining[0]);
    } else {
      setActiveGroup(null);
    }
  };

  // Handle image upload input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle message typing with @mention trigger
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputText(val);

    const lastWord = val.split(' ').pop();
    if (lastWord.startsWith('@')) {
      setMentionQuery(lastWord.slice(1).toLowerCase());
      setShowMentionDropdown(true);
    } else {
      setShowMentionDropdown(false);
    }
  };

  // Select mention from dropdown
  const handleSelectMention = (username) => {
    const words = inputText.split(' ');
    words.pop();
    const newText = [...words, `@${username} `].join(' ');
    setInputText(newText);
    setShowMentionDropdown(false);
  };

  // Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if ((!inputText.trim() && !imagePreview) || !activeGroup) return;

    const newMsg = {
      _id: `m-${Date.now()}`,
      sender: defaultUsersList[0], // Current Admin
      text: inputText.trim(),
      imageUrl: imagePreview,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => ({
      ...prev,
      [activeGroup._id]: [...(prev[activeGroup._id] || []), newMsg]
    }));

    setInputText('');
    setSelectedImage(null);
    setImagePreview(null);
    setShowMentionDropdown(false);
  };

  // Helper to render message text with highlighted @mentions
  const renderMessageContent = (text) => {
    if (!text) return null;
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('@')) {
        return (
          <span key={idx} className="bg-blue-600/30 text-blue-300 font-semibold px-1.5 py-0.5 rounded border border-blue-500/40">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-sans text-gray-100">
      <div className="w-full max-w-5xl bg-[#16192b] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh]">
        
        {/* SIDEBAR: Group List */}
        <div className="w-full md:w-1/3 bg-[#1e2238] border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FaUsers className="text-indigo-400" /> Admin Groups
            </h2>
            <button 
              onClick={() => setIsCreatingGroup(!isCreatingGroup)} 
              className="text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg text-white font-medium transition"
            >
              {isCreatingGroup ? 'Cancel' : '+ New Group'}
            </button>
          </div>

          {/* New Group Form */}
          {isCreatingGroup && (
            <form onSubmit={handleCreateGroup} className="p-3 bg-[#181a2e] border-b border-gray-800 space-y-2">
              <input
                type="text"
                placeholder="Enter Group Name..."
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full bg-[#252a45] text-sm text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-700"
              />
              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 rounded-lg transition"
              >
                Create Group
              </button>
            </form>
          )}

          {/* Group Items */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {groups.length === 0 ? (
              <p className="text-center text-xs text-gray-500 py-6">No groups created yet</p>
            ) : (
              groups.map(grp => (
                <div
                  key={grp._id}
                  onClick={() => setActiveGroup(grp)}
                  className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between ${
                    activeGroup?._id === grp._id 
                      ? 'bg-indigo-600/30 border border-indigo-500/50 text-white' 
                      : 'hover:bg-[#252a45]/60 text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-900/60 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold">
                      {grp.groupName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{grp.groupName}</h4>
                      <p className="text-xs text-gray-400">{grp.members.length} Members</p>
                    </div>
                  </div>
                  {activeGroup?._id === grp._id && (
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-gray-800 text-center">
            <button 
              onClick={onClose} 
              className="text-xs text-gray-400 hover:text-white transition"
            >
              Close Window
            </button>
          </div>
        </div>

        {/* MAIN CHAT AREA */}
        {activeGroup ? (
          <div className="flex-1 flex flex-col bg-[#16192b]">
            
            {/* HEADER: Group Details & Admin Controls (Matches User Image) */}
            <div className="p-4 bg-[#1e2238] border-b border-gray-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-bold text-lg">
                    <FaUsers />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-wide">{activeGroup.groupName}</h3>
                    <p className="text-xs text-gray-400">{activeGroup.members.length} Members</p>
                  </div>
                </div>

                {/* Delete Group Trash Button */}
                <button
                  onClick={() => handleDeleteGroup(activeGroup._id)}
                  title="Delete Group"
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                >
                  <FaTrash size={18} />
                </button>
              </div>

              {/* Members Admin Card (Exact Match to User Image UI) */}
              <div className="bg-[#181a2e] border border-gray-800 rounded-xl p-3 space-y-3">
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {activeGroup.members.map(m => (
                    <div key={m.user._id} className="flex items-center justify-between p-2 bg-[#212642] rounded-lg">
                      <div className="flex items-center gap-3">
                        <img 
                          src={m.user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${m.user.username || m.user.fullName}`} 
                          alt="avatar" 
                          className="w-8 h-8 rounded-full border border-gray-700 bg-gray-800"
                        />
                        <div>
                          <p className="text-xs font-bold text-white">{m.user.fullName}</p>
                          <p className="text-[10px] text-gray-400">{m.user.role || 'Developer'}</p>
                        </div>
                      </div>

                      {/* REMOVE Button */}
                      {m.role !== 'Admin' && (
                        <button
                          onClick={() => handleRemoveMember(m.user._id)}
                          className="text-[11px] font-bold text-red-400 hover:text-red-300 hover:bg-red-500/20 px-2.5 py-1 rounded transition"
                        >
                          REMOVE
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Member Dropdown Controls */}
                <div className="flex items-center gap-2 pt-1">
                  <select
                    value={selectedUserToAdd}
                    onChange={(e) => setSelectedUserToAdd(e.target.value)}
                    className="flex-1 bg-[#252a45] text-xs text-gray-200 px-3 py-2 rounded-lg border border-gray-700 outline-none focus:border-indigo-500"
                  >
                    <option value="">Select user to add...</option>
                    {availableUsers
                      .filter(u => !activeGroup.members.some(m => m.user._id === u._id))
                      .map(u => (
                        <option key={u._id} value={u._id}>
                          {u.fullName} ({u.role || u.username})
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={handleAddMember}
                    disabled={!selectedUserToAdd}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-2 rounded-lg transition"
                    title="Add User"
                  >
                    <FaUserPlus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* MESSAGES THREAD */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#141625]">
              {(messages[activeGroup._id] || []).length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500 text-xs">
                  No messages yet. Send a message or tag someone with @username
                </div>
              ) : (
                messages[activeGroup._id].map(msg => {
                  const isMe = msg.sender._id === defaultUsersList[0]._id;
                  return (
                    <div
                      key={msg._id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[11px] text-gray-400">
                        <span className="font-semibold text-gray-300">{msg.sender.fullName}</span>
                        <span>•</span>
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div
                        className={`max-w-[75%] p-3 rounded-2xl text-xs space-y-2 shadow-md ${
                          isMe 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : 'bg-[#212642] text-gray-100 border border-gray-800 rounded-bl-none'
                        }`}
                      >
                        {/* Message Text */}
                        {msg.text && (
                          <p className="leading-relaxed whitespace-pre-wrap">
                            {renderMessageContent(msg.text)}
                          </p>
                        )}

                        {/* Attached Image */}
                        {msg.imageUrl && (
                          <div className="mt-2 overflow-hidden rounded-xl border border-white/10">
                            <img
                              src={msg.imageUrl}
                              alt="Attachment"
                              onClick={() => setZoomedImage(msg.imageUrl)}
                              className="max-h-48 w-full object-cover cursor-pointer hover:scale-105 transition duration-200"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT BAR WITH @MENTION POPUP & IMAGE UPLOAD */}
            <div className="p-3 bg-[#1e2238] border-t border-gray-800 relative">
              
              {/* @Mention Autocomplete Dropdown */}
              {showMentionDropdown && (
                <div className="absolute bottom-full left-4 mb-2 bg-[#252a45] border border-gray-700 rounded-xl shadow-xl w-64 max-h-40 overflow-y-auto p-1 z-30">
                  <p className="text-[10px] text-gray-400 px-2 py-1 uppercase tracking-wider font-semibold">Mention Member</p>
                  {activeGroup.members
                    .filter(m => m.user.username.toLowerCase().includes(mentionQuery || ''))
                    .map(m => (
                      <div
                        key={m.user._id}
                        onClick={() => handleSelectMention(m.user.username)}
                        className="flex items-center gap-2 p-2 hover:bg-indigo-600/30 rounded-lg cursor-pointer transition text-xs text-white"
                      >
                        <FaAt className="text-indigo-400" />
                        <span>{m.user.fullName}</span>
                        <span className="text-[10px] text-gray-400">(@{m.user.username})</span>
                      </div>
                    ))}
                </div>
              )}

              {/* Attached Image Preview Bar */}
              {imagePreview && (
                <div className="mb-2 flex items-center gap-2 bg-[#181a2e] p-2 rounded-lg border border-gray-700 w-fit">
                  <img src={imagePreview} alt="Preview" className="w-12 h-12 object-cover rounded-md" />
                  <span className="text-xs text-gray-300 truncate max-w-[150px]">Image attached</span>
                  <button 
                    onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                {/* Image Upload Button */}
                <label className="p-2.5 text-gray-400 hover:text-indigo-400 bg-[#252a45] hover:bg-[#2c3254] rounded-xl cursor-pointer transition">
                  <FaImage size={16} />
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>

                {/* Input Field */}
                <input
                  type="text"
                  placeholder="Type a message... (use @ to mention)"
                  value={inputText}
                  onChange={handleInputChange}
                  className="flex-1 bg-[#252a45] text-xs text-white px-4 py-3 rounded-xl border border-gray-700 outline-none focus:border-indigo-500"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputText.trim() && !imagePreview}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white p-3 rounded-xl transition flex items-center justify-center"
                >
                  <FaPaperPlane size={14} />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
            Select or create a group to start chatting
          </div>
        )}
      </div>

      {/* Zoomed Image Viewer Modal */}
      {zoomedImage && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <FaTimes size={24} />
            </button>
            <img src={zoomedImage} alt="Zoomed" className="w-full max-h-[85vh] object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGroupChatModal;
