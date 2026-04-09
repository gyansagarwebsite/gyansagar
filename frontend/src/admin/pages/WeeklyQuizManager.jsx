import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Trophy, Trash2, Save, Plus,
  RefreshCw, Users, CheckCircle, Clock, AlertTriangle,
  CalendarDays, X, BarChart2, BookOpen, Zap, CheckCheck,
  Medal, Crown, Timer, XCircle, MinusCircle,
  ListChecks, Star, Megaphone, EyeOff, Sparkles, Info
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import QuizQuestionPicker from '../components/QuizQuestionPicker.jsx';
import adminQuestionService from '../services/adminQuestionService.js';
import adminQuizService from '../services/adminQuizService.js';
import '../styles/WeeklyQuizManager.css';

/* ── helpers ──────────────────────────────────────────────── */
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const fmtTime = (d) =>
  d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

const secToMin = (s) => {
  if (!s && s !== 0) return '—';
  const m = Math.floor(s / 60), sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
};

const RANK_STYLES = {
  1: { bg: 'linear-gradient(135deg,#FFD700,#FFA500)', color: '#7a4800', icon: Crown },
  2: { bg: 'linear-gradient(135deg,#C0C0C0,#9e9e9e)', color: '#333',    icon: Medal },
  3: { bg: 'linear-gradient(135deg,#CD7F32,#a0522d)', color: '#fff',    icon: Medal },
};

const STATUS_META = {
  no_quiz:   { label: 'No Quiz Set',  color: '#8b949e', icon: BookOpen,     bg: '#f6f8fa' },
  scheduled: { label: 'Ready – Sat',  color: '#2D3F8F', icon: CalendarDays, bg: '#eef2ff' },
  active:    { label: '🔴 Live Now',  color: '#27a84a', icon: Zap,          bg: '#f0fff4' },
  ended:     { label: 'Ended',        color: '#FF8C42', icon: CheckCheck,   bg: '#fff8f0' },
  inactive:  { label: 'Inactive',     color: '#888',    icon: Clock,        bg: '#f8f8f8' },
};

/* ── ConfirmModal ─────────────────────────────────────────── */
const ConfirmModal = ({ title, body, onConfirm, onCancel }) => (
  <motion.div className="wqm-overlay"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <motion.div className="wqm-modal"
      initial={{ scale: 0.88, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.88, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}>
      <div className="wqm-modal-icon danger"><AlertTriangle size={32} /></div>
      <h3 className="wqm-modal-title">{title}</h3>
      <p className="wqm-modal-body">{body}</p>
      <div className="wqm-modal-actions">
        <button className="wqm-btn wqm-btn-ghost" onClick={onCancel}><X size={16} /> Cancel</button>
        <button className="wqm-btn wqm-btn-danger" onClick={onConfirm}>
          <Trash2 size={16} /> Yes, Reset
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/* ── Leaderboard ──────────────────────────────────────────── */
const Leaderboard = ({
  quizMeta, participants, total, topScore,
  winnerAnnounced, announcedWinner,
  onRefresh, onUnannounce, saving, loading,
}) => {
  if (loading) return <div className="wqm-loading"><LoadingSpinner /></div>;

  const topParticipant = participants[0] || null;

  return (
    <div className="lb-wrap">
      {/* Header */}
      <div className="lb-header">
        <div className="lb-header-left">
          <div className="lb-trophy"><Trophy size={24} /></div>
          <div>
            <h3>Participants Leaderboard</h3>
            {quizMeta ? (
              <p className="lb-week">
                <CalendarDays size={13} />
                {fmt(quizMeta.weekStart)} — {fmt(quizMeta.weekEnd)}
                &nbsp;·&nbsp; {total} participants &nbsp;·&nbsp;
                Top score: {topScore}/{quizMeta.totalQuestions || 15}
              </p>
            ) : <p className="lb-week">No quiz data yet.</p>}
          </div>
        </div>
        <div className="lb-header-right">
          <button className="wqm-btn wqm-btn-ghost" onClick={onRefresh} disabled={loading}>
            <RefreshCw size={15} className={loading ? 'spinning' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* ── Winner Announcement Panel ── */}
      {quizMeta && (
        <div className={`winner-panel ${winnerAnnounced ? 'announced' : ''}`}>
          {winnerAnnounced && announcedWinner ? (
            <>
              <div className="wp-announced-badge"><Sparkles size={14} /> Winner Auto-Announced Publicly</div>
              <div className="wp-winner-row">
                <div className="wp-crown-wrap"><Crown size={28} /></div>
                <div className="wp-winner-info">
                  <span className="wp-winner-name">{announcedWinner.userName}</span>
                  <span className="wp-winner-meta">
                    🏆 {announcedWinner.score}/{announcedWinner.totalQuestions || 15} correct
                    &nbsp;·&nbsp; ⏱ {secToMin(announcedWinner.timeTakenSeconds)}
                    &nbsp;·&nbsp; Announced {fmtTime(announcedWinner.announcedAt)}
                  </span>
                  {announcedWinner.message && (
                    <span className="wp-winner-msg">"{announcedWinner.message}"</span>
                  )}
                </div>
                <button className="wqm-btn wqm-btn-ghost wp-unannounce"
                  onClick={onUnannounce} disabled={saving} title="Remove public announcement">
                  <EyeOff size={15} /> Remove
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="wp-title"><Megaphone size={18} /><span>Winner Announcement</span></div>
              <p className="wp-desc">
                {participants.length === 0
                  ? 'No participants yet. The winner will be auto-announced at 11:00 PM NPT on Saturday.'
                  : `Current top: ${topParticipant?.userName} — ${topParticipant?.score}/${quizMeta?.totalQuestions || 15} in ${secToMin(topParticipant?.timeTakenSeconds)}.\n\nThe winner will be auto-announced at 11:00 PM NPT on Saturday when the quiz closes.`}
              </p>
              <div className="wp-auto-note">
                <Info size={14} />
                <span>Winner is announced <strong>automatically</strong> at 11:00 PM every Saturday. No action needed.</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Podium */}
      {participants.length >= 1 && (
        <div className="lb-podium">
          {[participants[1] || null, participants[0], participants[2] || null].map((p, pos) => {
            if (!p) return <div key={pos} className="lb-podium-slot empty" />;
            const displayRank = pos === 0 ? 2 : pos === 1 ? 1 : 3;
            const rs = RANK_STYLES[displayRank];
            const RankIcon = rs.icon;
            return (
              <motion.div key={p.userName} className={`lb-podium-slot rank-${displayRank}`}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: pos * 0.1 }}>
                <div className="lb-podium-avatar" style={{ background: rs.bg, color: rs.color }}>
                  <RankIcon size={22} />
                </div>
                <div className="lb-podium-name">{p.userName}</div>
                <div className="lb-podium-score">{p.score}<span>/{quizMeta?.totalQuestions || 15}</span></div>
                <div className="lb-podium-time"><Timer size={12} /> {secToMin(p.timeTakenSeconds)}</div>
                <div className="lb-podium-rank" style={{ background: rs.bg, color: rs.color }}>#{displayRank}</div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full table */}
      {participants.length > 0 ? (
        <div className="lb-table-wrap">
          <table className="lb-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Participant</th>
                <th>Score</th>
                <th><CheckCircle size={13} /> Correct</th>
                <th><XCircle size={13} /> Wrong</th>
                <th><MinusCircle size={13} /> Skipped</th>
                <th><Timer size={13} /> Time</th>
                <th>Submitted</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p, i) => {
                const rs = RANK_STYLES[p.rank];
                return (
                  <motion.tr key={`${p.userName}-${i}`}
                    className={`lb-row ${p.rank <= 3 ? `lb-row-top${p.rank}` : ''}`}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.025 }}>
                    <td className="lb-rank-cell">
                      {rs
                        ? <span className="lb-rank-badge" style={{ background: rs.bg, color: rs.color }}>#{p.rank}</span>
                        : <span className="lb-rank-plain">#{p.rank}</span>}
                    </td>
                    <td className="lb-name-cell">
                      {p.rank === 1 && <Star size={13} className="lb-star" />}
                      {p.userName}
                    </td>
                    <td className="lb-score-cell">
                      <span className="lb-score-val">{p.score}</span>
                      <span className="lb-score-total">/{quizMeta?.totalQuestions || 15}</span>
                    </td>
                    <td className="lb-correct">{p.correctCount}</td>
                    <td className="lb-wrong">{p.wrongCount}</td>
                    <td className="lb-skipped">{p.unansweredCount}</td>
                    <td className="lb-time">{secToMin(p.timeTakenSeconds)}</td>
                    <td className="lb-submitted">{fmtTime(p.submittedAt)}</td>
                    <td>
                      <span className={`lb-badge ${p.timedOut ? 'timed-out' : 'completed'}`}>
                        {p.timedOut ? '⏱ Timed Out' : '✓ Completed'}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="lb-empty">
          <Users size={48} />
          <p>No participants yet.</p>
          <p className="wqm-empty-sub">Quiz runs every Saturday 6:00 AM – 11:00 PM NPT.</p>
        </div>
      )}
    </div>
  );
};

/* ── Main Component ──────────────────────────────────────── */
const WeeklyQuizManager = () => {
  const [tab, setTab]             = useState('setup');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [lbLoading, setLbLoading] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState(null);
  const [statusCard, setStatusCard] = useState({
    isActive: false, status: 'no_quiz', weekStart: null, weekEnd: null,
    attemptCount: 0, totalParticipants: 0, canReset: false, quiz: null,
    winnerAnnounced: false, winner: null,
    nextQuizStart: null, nextQuizEnd: null,
  });
  const [leaderboard, setLeaderboard] = useState({
    quiz: null, participants: [], total: 0, topScore: 0,
  });
  const [showPicker, setShowPicker]         = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4500);
  };

  const fetchCurrentQuiz = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminQuizService.getWeeklyQuizAdmin();
      setSelectedQuestions(data.quiz?.questions ?? []);
      setStatusCard({
        isActive:          data.isActive          ?? false,
        status:            data.status            ?? 'no_quiz',
        weekStart:         data.weekStart         ?? null,
        weekEnd:           data.weekEnd           ?? null,
        attemptCount:      data.attemptCount      ?? 0,
        totalParticipants: data.totalParticipants ?? 0,
        canReset:          data.canReset          ?? false,
        quiz:              data.quiz              ?? null,
        winnerAnnounced:   data.winnerAnnounced   ?? false,
        winner:            data.winner            ?? null,
        nextQuizStart:     data.nextQuizStart     ?? null,
        nextQuizEnd:       data.nextQuizEnd       ?? null,
      });
    } catch {
      showToast('error', 'Unable to load weekly quiz data.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    setLbLoading(true);
    try {
      const data = await adminQuizService.getParticipants();
      setLeaderboard({
        quiz:         data.quiz         ?? null,
        participants: data.participants ?? [],
        total:        data.total        ?? 0,
        topScore:     data.topScore     ?? 0,
      });
    } catch {
      showToast('error', 'Unable to load participant data.');
    } finally {
      setLbLoading(false);
    }
  }, []);

  useEffect(() => { fetchCurrentQuiz(); }, [fetchCurrentQuiz]);
  useEffect(() => { if (tab === 'leaderboard') fetchLeaderboard(); }, [tab, fetchLeaderboard]);

  const handleSaveFromPicker = async (questionIds) => {
    try {
      const full = await Promise.all(questionIds.map(id => adminQuestionService.getQuestion(id)));
      setSelectedQuestions(full);
      setShowPicker(false);
    } catch { showToast('error', 'Failed to fetch selected questions.'); }
  };

  const handleSaveQuiz = async () => {
    if (selectedQuestions.length !== 15) { showToast('error', 'Please select exactly 15 questions.'); return; }
    setSaving(true);
    try {
      const res = await adminQuizService.createWeeklyQuiz({
        title: 'Weekly Loksewa & GK Quiz',
        description: 'A set of 15 questions for this week.',
        questions: selectedQuestions.map(q => q._id),
      });
      showToast('success', res.message || '✅ Quiz saved successfully!');
      await fetchCurrentQuiz();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to save quiz.');
    } finally { setSaving(false); }
  };

  const handleConfirmReset = async () => {
    setShowResetModal(false);
    setSaving(true);
    try {
      await adminQuizService.resetWeeklyQuiz(true);
      showToast('success', '🗑️ Quiz reset! Ready to set up next Saturday\'s quiz.');
      setSelectedQuestions([]);
      setLeaderboard({ quiz: null, participants: [], total: 0, topScore: 0 });
      await fetchCurrentQuiz();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Unable to reset quiz.');
    } finally { setSaving(false); }
  };

  const handleUnannounce = async () => {
    setSaving(true);
    try {
      await adminQuizService.unannounceWinner();
      showToast('success', 'Winner announcement removed from public site.');
      await fetchCurrentQuiz();
    } catch {
      showToast('error', 'Failed to remove announcement.');
    } finally { setSaving(false); }
  };

  const meta       = STATUS_META[statusCard.status] || STATUS_META.no_quiz;
  const StatusIcon = meta.icon;
  const canSave    = selectedQuestions.length === 15 && !saving;

  // Format next quiz window for display
  const nextSatFmt = statusCard.nextQuizStart
    ? new Date(statusCard.nextQuizStart).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })
    : null;

  return (
    <div className="wqm-page">
      <AnimatePresence>
        {showPicker && (
          <QuizQuestionPicker
            currentQuestionIds={selectedQuestions.map(q => q._id)}
            onSave={handleSaveFromPicker}
            onCancel={() => setShowPicker(false)}
          />
        )}
        {showResetModal && (
          <ConfirmModal
            title="Reset This Week's Quiz?"
            body={`This permanently deletes the current quiz and ALL ${statusCard.attemptCount} attempt(s). You can then set up questions for next Saturday.`}
            onConfirm={handleConfirmReset}
            onCancel={() => setShowResetModal(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div key="toast" className={`wqm-toast wqm-toast-${toast.type}`}
            initial={{ opacity: 0, y: -24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12 }}>
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="wqm-inner">
        {/* Header */}
        <div className="wqm-header">
          <div className="wqm-header-left">
            <div className="wqm-header-icon"><Trophy size={28} /></div>
            <div>
              <h2>Weekly Quiz Manager</h2>
              <p>Quiz runs <strong>every Saturday 6:00 AM – 11:00 PM NPT</strong>. Winner is announced automatically at 11 PM.</p>
            </div>
          </div>
          <button className="wqm-btn wqm-btn-ghost" onClick={fetchCurrentQuiz} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spinning' : ''} /> Refresh
          </button>
        </div>

        {/* Schedule info banner */}
        <div className="wqm-schedule-info">
          <div className="wsi-item"><Clock size={14} /><span>Sun–Fri: Admin sets questions</span></div>
          <div className="wsi-divider">→</div>
          <div className="wsi-item"><Zap size={14} /><span>Saturday 6:00 AM NPT: Quiz auto-opens</span></div>
          <div className="wsi-divider">→</div>
          <div className="wsi-item"><Crown size={14} /><span>Saturday 11:00 PM NPT: Auto-closes & winner announced</span></div>
        </div>

        {/* Tabs */}
        <div className="wqm-tabs">
          <button className={`wqm-tab ${tab === 'setup' ? 'active' : ''}`} onClick={() => setTab('setup')}>
            <ListChecks size={16} /> Quiz Setup
          </button>
          <button className={`wqm-tab ${tab === 'leaderboard' ? 'active' : ''}`} onClick={() => setTab('leaderboard')}>
            <Users size={16} />
            Participants &amp; Leaderboard
            {statusCard.totalParticipants > 0 && (
              <span className="wqm-tab-badge">{statusCard.totalParticipants}</span>
            )}
          </button>
        </div>

        {loading ? <div className="wqm-loading"><LoadingSpinner /></div> : (
          <>
            {/* Status Banner */}
            <div className="wqm-status-banner" style={{ background: meta.bg, borderColor: meta.color }}>
              <div className="wqm-status-left">
                <span className="wqm-status-pill" style={{ background: meta.color }}>
                  <StatusIcon size={14} /> {meta.label}
                </span>
                {statusCard.winnerAnnounced && statusCard.winner && (
                  <span className="wqm-winner-chip">
                    <Crown size={13} /> Winner: {statusCard.winner.userName}
                  </span>
                )}
                <div className="wqm-status-dates">
                  {nextSatFmt
                    ? <span><CalendarDays size={14} /> Next Saturday: {nextSatFmt} · 6:00 AM – 11:00 PM NPT</span>
                    : <span className="wqm-no-quiz-hint">No quiz configured yet.</span>}
                </div>
              </div>
              <div className="wqm-status-stats">
                <div className="wqm-stat-chip"><Users size={14} /><span>{statusCard.totalParticipants} participants</span></div>
                <div className="wqm-stat-chip"><BarChart2 size={14} /><span>{statusCard.attemptCount} attempts</span></div>
              </div>
              <div className="wqm-status-actions">
                {statusCard.quiz && (
                  <button className="wqm-btn wqm-btn-danger-outline"
                    onClick={() => setShowResetModal(true)} disabled={saving}>
                    <Trash2 size={16} /> Reset Quiz
                  </button>
                )}
              </div>
            </div>

            {/* ═══ SETUP TAB ═══ */}
            {tab === 'setup' && (
              <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Lifecycle */}
                <div className="wqm-lifecycle">
                  {[
                    { step: 1, label: 'Pick 15 Questions (Sun–Fri)', done: selectedQuestions.length === 15, active: selectedQuestions.length < 15 },
                    { step: 2, label: 'Save for Saturday',           done: !!statusCard.quiz,              active: selectedQuestions.length === 15 && !statusCard.quiz },
                    { step: 3, label: 'Quiz Auto-Opens 6 AM NPT',   done: statusCard.status === 'active' || statusCard.status === 'ended', active: false },
                    { step: 4, label: 'Winner Auto-Announced 11 PM', done: statusCard.winnerAnnounced,     active: statusCard.status === 'ended' && !statusCard.winnerAnnounced },
                    { step: 5, label: 'Reset → Next Week',           done: false,                          active: statusCard.winnerAnnounced },
                  ].map((s) => (
                    <div key={s.step} className={`wqm-step ${s.done ? 'done' : s.active ? 'active-step' : ''}`}>
                      <div className="wqm-step-num">{s.done ? <CheckCircle size={15} /> : s.step}</div>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Questions */}
                <div className="wqm-questions-card">
                  <div className="wqm-questions-header">
                    <div>
                      <h3>Selected Questions</h3>
                      <span className={`wqm-count-badge ${selectedQuestions.length === 15 ? 'complete' : selectedQuestions.length > 0 ? 'partial' : ''}`}>
                        {selectedQuestions.length} / 15
                      </span>
                    </div>
                    <button className="wqm-btn wqm-btn-primary" onClick={() => setShowPicker(true)} disabled={saving}>
                      <Plus size={16} /> {selectedQuestions.length > 0 ? 'Change Questions' : 'Choose Questions'}
                    </button>
                  </div>
                  {selectedQuestions.length > 0 ? (
                    <ol className="wqm-question-list">
                      {selectedQuestions.map((q, i) => (
                        <li key={q._id || i} className="wqm-question-item">
                          <span className="wqm-q-num">{i + 1}</span>
                          <span className="wqm-q-text">
                            {q.questionText
                              ? q.questionText.length > 100 ? q.questionText.substring(0, 100) + '…' : q.questionText
                              : 'Loading…'}
                          </span>
                          {q.category && <span className="wqm-q-cat">{q.category}</span>}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <div className="wqm-empty">
                      <BookOpen size={40} />
                      <p>No questions selected yet.</p>
                      <p className="wqm-empty-sub">Pick 15 questions any time before Saturday 6:00 AM NPT.</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="wqm-footer">
                  <div className="wqm-footer-hint">
                    {selectedQuestions.length === 15
                      ? `✅ Ready! Click "Save for Saturday" to schedule the quiz.`
                      : selectedQuestions.length > 0
                      ? `⚠️ Need ${15 - selectedQuestions.length} more question(s).`
                      : '📋 Select 15 questions — quiz will auto-start Saturday 6:00 AM NPT.'}
                  </div>
                  <button className="wqm-btn wqm-btn-primary wqm-save-btn" onClick={handleSaveQuiz} disabled={!canSave}>
                    {saving
                      ? <><RefreshCw size={16} className="spinning" /> Saving…</>
                      : <><Save size={16} /> Save for Saturday</>}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ═══ LEADERBOARD TAB ═══ */}
            {tab === 'leaderboard' && (
              <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Leaderboard
                  quizMeta={leaderboard.quiz}
                  participants={leaderboard.participants}
                  total={leaderboard.total}
                  topScore={leaderboard.topScore}
                  winnerAnnounced={statusCard.winnerAnnounced}
                  announcedWinner={statusCard.winner}
                  loading={lbLoading}
                  saving={saving}
                  onRefresh={fetchLeaderboard}
                  onUnannounce={handleUnannounce}
                />
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WeeklyQuizManager;
