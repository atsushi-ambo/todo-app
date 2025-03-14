import { useEffect } from 'react';

// Hook to enable auto-scrolling when dragging near edges
export function useDragScroll() {
  useEffect(() => {
    let interval: number | null = null;
    let direction = 0;
    
    const handleDragOver = (e: DragEvent) => {
      const container = document.querySelector('.board-list') as HTMLElement;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const scrollSpeed = 15;
      const scrollZone = 100; // px from edge
      
      if (e.clientX < containerRect.left + scrollZone) {
        // Scroll left
        direction = -1;
      } else if (e.clientX > containerRect.right - scrollZone) {
        // Scroll right
        direction = 1;
      } else {
        // No scroll needed
        direction = 0;
      }
      
      if (direction !== 0 && interval === null) {
        interval = window.setInterval(() => {
          container.scrollLeft += direction * scrollSpeed;
        }, 50);
      } else if (direction === 0 && interval !== null) {
        window.clearInterval(interval);
        interval = null;
      }
    };
    
    const handleDragEnd = () => {
      if (interval !== null) {
        window.clearInterval(interval);
        interval = null;
        direction = 0;
      }
    };
    
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('dragend', handleDragEnd);
    document.addEventListener('drop', handleDragEnd);
    
    return () => {
      if (interval !== null) {
        window.clearInterval(interval);
      }
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('dragend', handleDragEnd);
      document.removeEventListener('drop', handleDragEnd);
    };
  }, []);
}
