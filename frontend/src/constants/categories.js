export const GENERAL_CATEGORIES = [
  { name: 'History', icon: '📜', color: '#ff8c42', bg: '/quiz-bg/academic.png' },
  { name: 'Geography', icon: '🌍', color: '#2196f3', bg: '/quiz-bg/global.png' },
  { name: 'Constitution', icon: '⚖️', color: '#4caf50', bg: '/quiz-bg/gov.png' },
  { name: 'Science', icon: '🔬', color: '#9c27b0', bg: '/quiz-bg/science.png' },
  { name: 'Computer Operator', icon: '💻', color: '#607d8b', bg: '/quiz-bg/science.png' },
  { name: 'Banking Sector', icon: '🏦', color: '#e11d48', bg: '/quiz-bg/gov.png' },
  { name: 'Nepal Army', icon: '🪖', color: '#ea580c', bg: '/quiz-bg/global.png' },
  { name: 'Nepal Police', icon: '👮', color: '#4f46e5', bg: '/quiz-bg/global.png' },
  { name: 'Nepal Electricity', icon: '⚡', color: '#3b82f6', bg: '/quiz-bg/gov.png' },
  { name: 'नेपाल स्वास्थ्य', icon: '🏥', color: '#059669', bg: '/quiz-bg/gov.png' },
  { name: 'Current Affairs', icon: '📰', color: '#009688', bg: '/quiz-bg/gov.png' },
  { name: 'Loksewa', icon: '🏛️', color: '#795548', bg: '/quiz-bg/gov.png' },
];

export const EXAM_POSTS = [
  { name: 'Nepal Electricity', icon: 'Zap', color: '#3b82f6', desc: 'Managing electricity supply and infrastructure.' },
  { name: 'Computer Operator', icon: 'Settings', color: '#0f172a', desc: 'Knowledge of systems, software, and hardware.' },
  { name: 'Banking Sector', icon: 'Building2', color: '#e11d48', desc: 'Finance, accounts, and customer service roles.' },
  { name: 'नेपाल स्वास्थ्य', icon: 'Activity', color: '#059669', desc: 'Health sector roles including nursing & pharmacy.' },
  { name: 'Nepal Police', icon: 'ShieldCheck', color: '#4f46e5', desc: 'Law enforcement duties to maintain security.' },
  { name: 'Nepal Army', icon: 'Trophy', color: '#ea580c', desc: 'Defensive roles for national security and peace.' },
];

export const ALL_CATEGORY_NAMES = [
  ...GENERAL_CATEGORIES.map(c => c.name),
  ...EXAM_POSTS.map(p => p.name)
];
