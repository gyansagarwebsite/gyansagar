import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import adminMessageService from '../services/adminMessageService.js';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchMessages();
  }, [search]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await adminMessageService.getMessages(search ? { q: search } : {});
      setMessages(response.messages || response);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (id) => {
    setExpanded(prev => ({...prev, [id]: !prev[id]}));
  };

  const deleteMessage = async (id) => {
    if (window.confirm('Delete this message?')) {
      try {
        await adminMessageService.deleteMessage(id);
        toast.success('✅ Message deleted successfully!', { autoClose: 2000 });
        fetchMessages();
      } catch (error) {
        toast.error('Failed to delete message', { autoClose: 3000 });
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-page">
      <main className="admin-main">
        <div className="page-header">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {messages.length === 0 ? (
          <EmptyState 
            title="No messages yet"
            description="Contact form messages will appear here"
            icon="💬"
          />
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <div key={message._id} className="message-card">
                <div className="message-header">
                  <div className="message-sender">
                    <strong>{message.name}</strong>
                    <span>{message.email}</span>
                  </div>
                  <div className="message-date">
                    {new Date(message.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className={`message-body ${expanded[message._id] ? 'expanded' : 'collapsed'}`}>
                  <p>{expanded[message._id] ? message.message : message.message.substring(0, 100) + '...'}</p>
                </div>
                <div className="message-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => toggleExpanded(message._id)}
                  >
                    {expanded[message._id] ? 'Show Less' : 'Show More'}
                  </button>
                  <button 
                    className="btn-danger"
                    onClick={() => deleteMessage(message._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminMessages;

