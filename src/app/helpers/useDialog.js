import { useState, useCallback } from 'react';

const useDialog = (callback) => {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => { setOpen(true); }, [setOpen]);
  const close = useCallback(() => { setOpen(false); }, [setOpen]);
  const confirm = useCallback(() => {
    callback();
    close();
  }, [callback, close]);

  return {
    isOpen, open, close, confirm,
  };
};

export default useDialog;
