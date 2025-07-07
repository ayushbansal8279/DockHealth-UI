import React, { useRef } from 'react';

const LONG_PRESS_DURATION = 100;

const LongPressWrapper = ({
  onLongPress,
  children,
}: {
  children: React.ReactNode;
  onLongPress: (e: React.PointerEvent) => void;
}) => {
  const timeoutRef = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    timeoutRef.current = window.setTimeout(() => {
      onLongPress?.(e);
    }, LONG_PRESS_DURATION);
  };

  const cancelLongPress = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={cancelLongPress}
      onPointerLeave={cancelLongPress}
    >
      {children}
    </div>
  );
};

export default LongPressWrapper;
