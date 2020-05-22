/* eslint-disable unicorn/filename-case */
import { useState, useCallback } from 'react';

/**
 * Store and manipulate a boolean state value.
 * @param initialValue
 * @returns {[Boolean, Function, Function, Function]}
 */
const useBoolean = initialValue => {
  const [flag, setFlag] = useState(initialValue);
  const enable = useCallback(() => {
    setFlag(true);
  }, []);
  const disable = useCallback(() => {
    setFlag(false);
  }, []);
  const toggle = useCallback(() => {
    setFlag(!flag);
  }, [flag]);

  return [flag, enable, disable, toggle];
};

export default useBoolean;
