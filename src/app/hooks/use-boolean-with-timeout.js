import { useEffect, useRef, useState } from 'react';

function useBooleanWithTimeout(initialValue = false) {
  const timeoutReference = useRef(null);
  const [isTrue, setIsTrue] = useState(initialValue);

  useEffect(() => {
    return () => {
      if (timeoutReference.current) {
        clearTimeout(timeoutReference.current);
      }
    };
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
