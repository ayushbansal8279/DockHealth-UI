import { useEffect, useRef, useState } from 'react';

function useCardWithTimeout() {
  const cardTimeoutReference = useRef(null);
  const [cardOpen, setCardOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (cardTimeoutReference.current) {
        clearTimeout(cardTimeoutReference.current);
      }
    };
  });

  const closeTrigger = () => {
    if (cardTimeoutReference.current) {
      clearTimeout(cardTimeoutReference.current);
      cardTimeoutReference.current = null;
    }
    setCardOpen(false);
  };

  const openTrigger = () => {
    if (cardTimeoutReference.current) {
      clearTimeout(cardTimeoutReference.current);
      cardTimeoutReference.current = null;
    }
    cardTimeoutReference.current = setTimeout(() => {
      setCardOpen(true);
    }, 500);
  };

  return {
    cardOpen,
    openTrigger,
    closeTrigger,
  };
}

export default useCardWithTimeout;
