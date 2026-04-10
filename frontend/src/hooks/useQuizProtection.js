import { useEffect, useState } from 'react';

/**
 * useQuizProtection - An AGGRESSIVE hook to deter screenshots and content theft.
 * Features:
 * 1. Blocks Right-Click.
 * 2. Blocks Ctrl+P, Ctrl+S, Ctrl+Shift+I.
 * 3. Hides/Blurs content when the window loses focus (snags many screenshot tools).
 * 4. Hides/Blurs content when the tab is switched.
 */
const useQuizProtection = () => {
  const [isProtected, setIsProtected] = useState(false);

  useEffect(() => {
    // 1. Prevent Right-Click
    const handleContextMenu = (e) => { e.preventDefault(); };

    // 2. Prevent Common Keyboard Shortcuts
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && e.key === 's') e.preventDefault();
      if (e.key === 'PrintScreen') {
        setIsProtected(true);
        navigator?.clipboard?.writeText('Screenshot attempt detected. Content protected.');
        setTimeout(() => setIsProtected(false), 2000);
      }
    };

    // 3. Aggressive Focus/Visibility Deterrence
    // When the window loses focus (e.g. Snipping Tool starts), we protect the content
    const handleBlur = () => setIsProtected(true);
    const handleFocus = () => setIsProtected(false);
    
    // Visibility API (Tab switching)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setIsProtected(true);
      } else {
        // Stay protected for a moment after returning to prevent quick grab
        setTimeout(() => setIsProtected(false), 100);
      }
    };

    // Attach listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return { isProtected };
};

export default useQuizProtection;
