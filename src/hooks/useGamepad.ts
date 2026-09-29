import { useEffect, useCallback, useRef } from 'react';

/**
 * useGamepad hook for controller-based navigation
 * Handles focus management and directional movement
 */
export function useGamepad(handlers: {
  onA?: (index: number) => void;
  onB?: () => void;
  onX?: () => void;
  onY?: () => void;
  onLB?: () => void;
  onRB?: () => void;
}) {
  const requestRef = useRef<number>(null);
  const lastUpdateRef = useRef<number>(0);
  const debounceRef = useRef<boolean>(false);

  const handleGamepadInput = useCallback(() => {
    const gamepads = navigator.getGamepads();
    const gp = gamepads[0]; // Primary controller
    if (!gp) return;

    // Throttle input to prevent rapid firing (approx 150ms)
    const now = Date.now();
    if (now - lastUpdateRef.current < 150) return;

    const axes = gp.axes;
    const buttons = gp.buttons;

    // Movement: Left Stick or D-Pad
    const up = axes[1] < -0.5 || buttons[12]?.pressed;
    const down = axes[1] > 0.5 || buttons[13]?.pressed;
    const left = axes[0] < -0.5 || buttons[14]?.pressed;
    const right = axes[0] > 0.5 || buttons[15]?.pressed;

    // Actions
    const btnA = buttons[0]?.pressed;
    const btnB = buttons[1]?.pressed;
    const btnX = buttons[2]?.pressed;
    const btnY = buttons[3]?.pressed;
    const btnLB = buttons[4]?.pressed;
    const btnRB = buttons[5]?.pressed;

    if (up || down || left || right || btnA || btnB || btnX || btnY || btnLB || btnRB) {
      lastUpdateRef.current = now;
      
      const activeElement = document.activeElement;
      if (!activeElement) return;

      const focusableElements = Array.from(
        document.querySelectorAll('[tabindex="0"]')
      ) as HTMLElement[];
      const currentIndex = focusableElements.indexOf(activeElement as HTMLElement);

      if (up) {
        navigate(focusableElements, currentIndex, 'up');
      } else if (down) {
        navigate(focusableElements, currentIndex, 'down');
      } else if (left) {
        navigate(focusableElements, currentIndex, 'left');
      } else if (right) {
        navigate(focusableElements, currentIndex, 'right');
      } else if (btnA && handlers.onA && currentIndex !== -1) {
        handlers.onA(currentIndex);
      } else if (btnB && handlers.onB) {
        handlers.onB();
      } else if (btnX && handlers.onX) {
        handlers.onX();
      } else if (btnY && handlers.onY) {
        handlers.onY();
      } else if (btnLB && handlers.onLB) {
        handlers.onLB();
      } else if (btnRB && handlers.onRB) {
        handlers.onRB();
      }
    }
  }, [handlers]);

  const navigate = (elements: HTMLElement[], currentIndex: number, direction: 'up' | 'down' | 'left' | 'right') => {
    if (currentIndex === -1) {
      elements[0]?.focus();
      return;
    }

    const currentRect = elements[currentIndex].getBoundingClientRect();
    let bestMatch: HTMLElement | null = null;
    let minDistance = Infinity;

    elements.forEach((el, idx) => {
      if (idx === currentIndex) return;
      const rect = el.getBoundingClientRect();
      
      let isCorrectDirection = false;
      let distance = 0;

      if (direction === 'up' && rect.bottom <= currentRect.top) {
        isCorrectDirection = true;
        distance = Math.abs(rect.bottom - currentRect.top) + Math.abs(rect.left - currentRect.left) * 0.1;
      } else if (direction === 'down' && rect.top >= currentRect.bottom) {
        isCorrectDirection = true;
        distance = Math.abs(rect.top - currentRect.bottom) + Math.abs(rect.left - currentRect.left) * 0.1;
      } else if (direction === 'left' && rect.right <= currentRect.left) {
        isCorrectDirection = true;
        distance = Math.abs(rect.right - currentRect.left) + Math.abs(rect.top - currentRect.top) * 2;
      } else if (direction === 'right' && rect.left >= currentRect.right) {
        isCorrectDirection = true;
        distance = Math.abs(rect.left - currentRect.right) + Math.abs(rect.top - currentRect.top) * 2;
      }

      if (isCorrectDirection && distance < minDistance) {
        minDistance = distance;
        bestMatch = el;
      }
    });

    bestMatch?.focus();
  };

  const animate = useCallback(() => {
    handleGamepadInput();
    requestRef.current = requestAnimationFrame(animate);
  }, [handleGamepadInput]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);
}
