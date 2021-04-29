import { useEffect, useRef, useState } from 'react';
import debounce from 'lodash.debounce';

function checkIfShouldDisplayTooltip(textReference) {
  return !!(
    textReference && textReference.scrollWidth > textReference.offsetWidth
  );
}

const OverflowTooltip = ({ children, textReference }) => {
  const [allowTooltip, setAllowTooltip] = useState(() =>
    checkIfShouldDisplayTooltip(textReference),
  );
  const handleResizeCallback = useRef(null);

  useEffect(() => {
    setAllowTooltip(checkIfShouldDisplayTooltip(textReference));

    if (handleResizeCallback.current) {
      window.removeEventListener('resize', handleResizeCallback.current);
    }

    handleResizeCallback.current = debounce(() => {
      setAllowTooltip(checkIfShouldDisplayTooltip(textReference));
    }, 1000);

    window.addEventListener('resize', handleResizeCallback.current);
  }, [textReference]);

  useEffect(() => {
    return () => {
      window.removeEventListener('resize', handleResizeCallback.current);
    };
  }, []);

  return allowTooltip ? children : null;
};

export default OverflowTooltip;
