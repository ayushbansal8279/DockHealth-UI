import { useEffect, useRef, useState } from 'react';

function useBooleanWithTimeout(
  initialValue = false,
): [boolean, () => void, () => void] {
  const timeoutReference = useRef<NodeJS.Timeout | null>(null);
  const [isTrue, setIsTrue] = useState(initialValue);

  useEffect(() => () => {
    if (timeoutReference.current) {
      clearTimeout(timeoutReference.current);
    }
  });

  const closeTrigger = () => {
    if (timeoutReference.current) {
      clearTimeout(timeoutReference.current);
      timeoutReference.current = null;
    }
    setIsTrue(false);
  };

  const openTrigger = () => {
    if (timeoutReference.current) {
      clearTimeout(timeoutReference.current);
      timeoutReference.current = null;
    }
    timeoutReference.current = setTimeout(() => {
      setIsTrue(true);
    }, 500);
  };

  return [isTrue, openTrigger, closeTrigger];
}

export default useBooleanWithTimeout;
