import { useState, useEffect, useCallback } from 'react';
import { Search, Copy, Trash2, ChevronLeft, ChevronRight, Check, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import questionService from '../../services/questionService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import BulkUploadModal from '../components/BulkUploadModal.jsx';
import '../styles/ManageQuestions.css';

const ManageQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [copiedId, setCopiedId] = useState(null);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

    const fetchQuestions = useCallback(async () => {
        try {
            setLoading(true);
            const data = await questionService.getQuestions({
                page,
                limit: 10,
                search: searchQuery
            });
            setQuestions(data.questions);
            setTotalPages(data.totalPages);
        } catch (error) {
            toast.error('Failed to load questions');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [page, searchQuery]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchQuestions();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await questionService.deleteQuestion(id);
                toast.success('Question deleted successfully');
                fetchQuestions();
            } catch (error) {
                toast.error('Failed to delete question');
            }
        }
    };

    const handleCopyLink = (slug, id) => {
        const url = `${window.location.origin}/question/${slug}`;
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        toast.info('Link copied to clipboard!');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (page > 3) pages.push('...');
            
            let start = Math.max(2, page - 1);
            let end = Math.min(totalPages - 1, page + 1);
            
            if (page <= 3) end = 4;
            if (page >= totalPages - 2) start = totalPages - 3;
            
            for (let i = start; i <= end; i++) pages.push(i);
            
            if (page < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="manage-questions-page fade-in">
            <div className="admin-page-header">
                <div className="header-info">
                    <h1>Manage MCQ's</h1>
                    <p>View, search, and manage all quiz questions</p>
                </div>
                <button 
                    className="admin-btn-primary bulk-trigger"
                    onClick={() => setIsBulkModalOpen(true)}
                >
                    <Upload size={18} />
                    <span>Bulk Upload</span>
                </button>
            </div>

            <div className="admin-card">
                <div className="card-controls">
                    <form className="admin-search-bar" onSubmit={handleSearch}>
                        <Search size={20} />
                        <input 
                            type="text" 
                            placeholder="Search by question text..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="admin-btn-primary">Search</button>
                    </form>
                </div>

                {loading ? (
                    <div className="admin-loading-wrap">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <div className="questions-table-wrap">
                        <table className="questions-table">
                            <thead>
                                <tr>
                                    <th>Question</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questions.length > 0 ? questions.map((q) => (
                                    <tr key={q._id}>
                                        <td className="question-col">
                                            <div className="q-text-wrap">
                                                {q.questionText}
                                            </div>
                                        </td>
                                        <td className="actions-col">
                                            <div className="actions-group">
                                                <button 
                                                    className={`mcq-action-btn copy ${copiedId === q._id ? 'success' : ''}`}
                                                    onClick={() => handleCopyLink(q.slug, q._id)}
                                                    title="Copy Public Link"
                                                >
                                                    {copiedId === q._id ? <Check size={18} /> : <Copy size={18} />}
                                                </button>
                                                <button 
                                                    className="mcq-action-btn delete"
                                                    onClick={() => handleDelete(q._id)}
                                                    title="Delete Question"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="2" className="no-data">No questions found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && totalPages > 1 && (
                    <div className="admin-pagination">
                        <button 
                            disabled={page === 1} 
                            onClick={() => setPage(p => p - 1)}
                            className="pagination-btn"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        
                        {getPageNumbers().map((p, i) => (
                            p === '...' ? (
                                <span key={`dots-${i}`} className="pagination-ellipsis">...</span>
                            ) : (
                                <button 
                                    key={p} 
                                    className={`pagination-btn ${page === p ? 'active' : ''}`}
                                    onClick={() => setPage(p)}
                                >
                                    {p}
                                </button>
                            )
                        ))}

                        <button 
                            disabled={page === totalPages} 
                            onClick={() => setPage(p => p + 1)}
                            className="pagination-btn"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>

            <BulkUploadModal 
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                onUploadSuccess={fetchQuestions}
            />
        </div>
    );
};

export default ManageQuestions;
