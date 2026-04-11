import { useEffect, useRef, useState } from 'react';

/**
 * useQuizProtection - A hook to deter screenshots and content theft.
 * Now scoped: right-click is ONLY blocked on the element that uses the returned ref.
 * Features:
 * 1. Blocks Right-Click on the protected element only.
 * 2. Blocks Ctrl+P, Ctrl+S within the protected element.
 * 3. Hides/Blurs content when the window loses focus (snags many screenshot tools).
 * 4. Hides/Blurs content when the tab is switched.
 */
const useQuizProtection = () => {
  const [isProtected, setIsProtected] = useState(false);
  const protectedRef = useRef(null);

  useEffect(() => {
    const el = protectedRef.current;

    // 1. Prevent Right-Click — scoped to the protected element only
    const handleContextMenu = (e) => { e.preventDefault(); };

    // 2. Prevent Common Keyboard Shortcuts (only when focus is inside the element)
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
    const handleBlur = () => setIsProtected(true);
    const handleFocus = () => setIsProtected(false);
    
    // Visibility API (Tab switching)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setIsProtected(true);
      } else {
        setTimeout(() => setIsProtected(false), 100);
      }
    };

    // Attach listeners — contextmenu is scoped to element, the rest stay global
    if (el) {
      el.addEventListener('contextmenu', handleContextMenu);
      el.addEventListener('keydown', handleKeyDown);
    }
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      if (el) {
        el.removeEventListener('contextmenu', handleContextMenu);
        el.removeEventListener('keydown', handleKeyDown);
      }
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return { isProtected, protectedRef };
};

export default useQuizProtection;
