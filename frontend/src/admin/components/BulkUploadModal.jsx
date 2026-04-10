import { useState, useRef } from 'react';
import { X, Upload, FileCheck, AlertCircle, CheckCircle2, Loader2, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import questionService from '../../services/questionService.js';
import { parseCSV as nativeParseCSV } from '../../utils/csvParser.js';
import '../styles/BulkUploadModal.css';

const BulkUploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [parsing, setParsing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [results, setResults] = useState(null);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv'))) {
            setFile(selectedFile);
            handleParsing(selectedFile);
        } else {
            toast.error('Please select a valid CSV file');
        }
    };

    const handleParsing = (file) => {
        setParsing(true);
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const text = e.target.result;
                const rows = nativeParseCSV(text);
                
                const questions = rows.map(row => {
                    const options = [
                        row.optionA || row.OptionA || '',
                        row.optionB || row.OptionB || '',
                        row.optionC || row.OptionC || '',
                        row.optionD || row.OptionD || ''
                    ];
                    
                    return {
                        questionText: row.questionText || row.Question || row.question || '',
                        options: options,
                        correctAnswer: parseInt(row.correctAnswer || row.CorrectAnswer) || 0,
                        category: row.category || row.Category || 'GK',
                        difficulty: row.difficulty || row.Difficulty || 'Medium',
                        explanation: row.explanation || row.Explanation || ''
                    };
                });

                // Simple validation
                const validQuestions = questions.filter(q => 
                    q.questionText && 
                    q.options.every(opt => opt) && 
                    !isNaN(q.correctAnswer) && 
                    q.category
                );

                setPreview({
                    total: questions.length,
                    valid: validQuestions.length,
                    invalid: questions.length - validQuestions.length,
                    data: validQuestions
                });
                setParsing(false);
            } catch (err) {
                toast.error('Error processing data: ' + err.message);
                setParsing(false);
            }
        };

        reader.onerror = () => {
            toast.error('Error reading CSV file');
            setParsing(false);
        };
        
        reader.readAsText(file);
    };

    const handleUpload = async () => {
        if (!preview || preview.data.length === 0) return;

        setUploading(true);
        try {
            const data = await questionService.bulkCreateQuestions(preview.data);
            setResults({
                success: true,
                insertedCount: data.insertedCount || data.count,
                errorCount: data.errorCount || 0,
                message: data.message
            });
            onUploadSuccess();
        } catch (error) {
            setResults({
                success: false,
                message: error.response?.data?.message || 'Error uploading questions'
            });
        } finally {
            setUploading(false);
        }
    };

    const reset = () => {
        setFile(null);
        setPreview(null);
        setResults(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="bulk-modal-overlay">
            <div className="bulk-modal-card fade-in-up">
                <div className="bulk-modal-header">
                    <h2>Bulk Upload MCQ's</h2>
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                </div>

                <div className="bulk-modal-body">
                    {!file && (
                        <div className="upload-dropzone" onClick={() => fileInputRef.current.click()}>
                            <Upload size={48} className="upload-icon" />
                            <h3>Choose CSV File</h3>
                            <p>Drag and drop or click to browse</p>
                            <div className="csv-format-info">
                                <Info size={16} />
                                <span>Format: questionText, optionA, optionB, optionC, optionD, correctAnswer (0-3), category</span>
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                accept=".csv" 
                                style={{ display: 'none' }} 
                            />
                        </div>
                    )}

                    {file && parsing && (
                        <div className="parsing-loader">
                            <Loader2 size={32} className="spin" />
                            <p>Parsing your data...</p>
                        </div>
                    )}

                    {file && !parsing && !results && (
                        <div className="upload-preview">
                            <div className="preview-file-info">
                                <FileCheck size={24} color="#10b981" />
                                <span>{file.name}</span>
                                <button className="change-link" onClick={reset}>Change</button>
                            </div>

                            <div className="preview-stats">
                                <div className="stat-box valid">
                                    <span className="stat-val">{preview.valid}</span>
                                    <span className="stat-label">Valid Questions</span>
                                </div>
                                <div className="stat-box invalid">
                                    <span className="stat-val">{preview.invalid}</span>
                                    <span className="stat-label">Invalid Rows</span>
                                </div>
                            </div>

                            {preview.invalid > 0 && (
                                <div className="validation-warning">
                                    <AlertCircle size={18} />
                                    <span>{preview.invalid} rows are missing required fields and will be skipped.</span>
                                </div>
                            )}

                            <div className="bulk-action-footer">
                                <button className="bulk-cancel-btn" onClick={reset}>Cancel</button>
                                <button 
                                    className="bulk-upload-btn" 
                                    onClick={handleUpload}
                                    disabled={uploading || preview.valid === 0}
                                >
                                    {uploading ? <Loader2 size={18} className="spin" /> : <Upload size={18} />}
                                    {uploading ? 'Uploading...' : `Upload ${preview.valid} QuestionsArray`}
                                </button>
                            </div>
                        </div>
                    )}

                    {results && (
                        <div className="upload-results">
                            <div className={`result-header ${results.success ? 'success' : 'error'}`}>
                                {results.success ? <CheckCircle2 size={48} /> : <AlertCircle size={48} />}
                                <h3>{results.success ? 'Upload Completed' : 'Upload Failed'}</h3>
                                <p>{results.message}</p>
                            </div>

                            <div className="result-details">
                                <div className="res-item">
                                    <span>Successfully Added:</span>
                                    <span className="res-val success">{results.insertedCount || 0}</span>
                                </div>
                                <div className="res-item">
                                    <span>Failed/Duplicates:</span>
                                    <span className="res-val error">{results.errorCount || 0}</span>
                                </div>
                            </div>

                            <button className="done-btn" onClick={onClose}>Done</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BulkUploadModal;
