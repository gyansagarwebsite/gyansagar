import { useEffect } from 'react';

/**
 * useQuizProtection - A hook to deter screenshots and content theft.
 * Prevents right-click, text selection, and common keyboard shortcuts.
 */
const useQuizProtection = () => {
  useEffect(() => {
    // 1. Prevent Right-Click
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // 2. Prevent Common Keyboard Shortcuts
    const handleKeyDown = (e) => {
      // 2a. Block Ctrl+P (Print)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
      }
      // 2b. Block Ctrl+S (Save)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
      }
      // 2c. Block Ctrl+Shift+I or F12 (Inspect - though F12 is hard to block reliably)
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') || e.key === 'F12') {
        // e.preventDefault(); // Un-comment if you want to be extra strict, but can be annoying for devs
      }
      // 2d. Prevent PrintScreen (limited success across browsers, but worth a try)
      if (e.key === 'PrintScreen') {
        // Can't reliably prevent PrtSc at OS level, but can clear clipboard in some environments
        // Or detect it and alert. 
        navigator?.clipboard?.writeText(''); 
      }
    };

    // Attach listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};

export default useQuizProtection;
