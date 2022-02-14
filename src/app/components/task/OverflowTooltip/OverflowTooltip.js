import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';

export function checkIfShouldDisplayTooltip(textReference) {
  return !!(
    textReference && textReference.scrollWidth > textReference.offsetWidth
  );
}

const OverflowTooltip = ({ children, textReference }) => {
  const [allowTooltip, setAllowTooltip] = useState(() =>
    checkIfShouldDisplayTooltip(textReference),
  );

  useEffect(() => {
    setAllowTooltip(checkIfShouldDisplayTooltip(textReference));

    const handleResizeCallback = debounce(() => {
      setAllowTooltip(checkIfShouldDisplayTooltip(textReference));
    }, 1000);

    window.addEventListener('resize', handleResizeCallback);

    return () => {
      window.removeEventListener('resize', handleResizeCallback);
    };
  }, [textReference]);

  return allowTooltip ? children : null;
};

export default OverflowTooltip;
