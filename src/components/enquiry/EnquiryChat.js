import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiMessageSquare } from 'react-icons/fi';
import enquiryService from '../../services/enquiryService';
import toast from 'react-hot-toast';

const EnquiryChat = ({ enquiryId, initialMessages = [] }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const response = await enquiryService.addMessage(enquiryId, newMessage);
      
      setMessages(prev => [...prev, response]);
      setNewMessage('');
    } catch (err) {
      toast.error('Failed to send message');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="enquiry-chat-panel">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="no-messages-container">
            <div className="no-messages-icon">
              <FiMessageSquare size={48} />
            </div>
            <h3>No messages yet</h3>
            <p>Start the conversation by typing a message below.</p>
          </div>
        )}
        
        {messages.map((msg) => {
          // In Admin Panel: Admin is "me" (Right/User style), User is "them" (Left/Admin style)
          const isAdmin = msg.sender?.role?.toUpperCase() === 'ADMIN' || !msg.sender;
          const bubbleClass = isAdmin ? 'sent' : 'received';

          return (
            <div key={msg.id} className={`message-bubble-wrapper ${bubbleClass}`}>
              <div className="message-bubble">
                <div className="message-content">{msg.message}</div>
                <div className="message-footer">
                   <span className="sender-name">{isAdmin ? 'Admin' : (msg.sender?.name || 'Customer')}</span>
                   <span className="message-time">{formatTime(msg.createdAt)}</span>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <form className="chat-input-area" onSubmit={handleSend}>
          <input
            type="text"
            className="chat-input"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
          />
          <button type="submit" className="send-btn" disabled={sending || !newMessage.trim()}>
            <FiSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnquiryChat;
