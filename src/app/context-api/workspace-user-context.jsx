import { createContext, useCallback, useMemo, useState } from "react";

export const UserEditContext = createContext();

export const UserEditProvider = ({ children, optionNames = [] }) => {
  const [selectedOptions, setSelectedOptions] = useState(() =>
    Object.fromEntries(optionNames.map(name => [name, false]))
  );
  const [selectableUsers, setSelectableUsers] = useState([]);

  const toggleUser = useCallback((userId) => {
    setSelectableUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, isSelected: !user.isSelected } : user
      )
    );
  }, []);

  const toggleAllUser = useCallback(() => {
    setSelectableUsers(prevUsers => {
      const allSelected = prevUsers.every(user => user.isSelected);
      return prevUsers.map(user => ({
        ...user,
        isSelected: !allSelected
      }));
    });
  }, []);

  const unselectAllUser = useCallback(() => {
    setSelectableUsers(prevUsers => {
      return prevUsers.map(user => ({
        ...user,
        isSelected: false
      }));
    });
  }, []);

  const selectedUsers = useMemo(() => {
    return selectableUsers?.filter(user => user.isSelected);
  }, [selectableUsers]);

  const bulkEditIsActive = useMemo(() => {
    return selectedUsers?.length > 0;
  }, [selectedUsers]);

  const isListChecked = useMemo(() => {
    const selectedCount = selectableUsers?.filter(user => user.isSelected).length;
    return selectableUsers?.length > 0 && selectedCount > 0 && selectableUsers?.length === selectedCount;
  }, [selectableUsers]);

  const toggleOption = useCallback((optionName) => {
    setSelectedOptions(prev => {
      const newOptions = Object.keys(prev).reduce((acc, key) => {
        acc[key] = key === optionName ? !prev[key] : false;
        return acc;
      }, {});
      return newOptions;
    });
  }, []);

  const resetOptions = useCallback(() => {
    setSelectedOptions(prev => {
      const reset = {};
      for (const key in prev) {
        reset[key] = false;
      }
      return reset;
    });
  }, []);

  const providerValue = useMemo(() => ({
    selectableUsers,
    setSelectableUsers,
    toggleUser,
    toggleAllUser,
    unselectAllUser,
    selectedUsers,
    bulkEditIsActive,
    isListChecked,
    selectedOptions,
    selectedOptionsHandler: {
      toggleOption,
      resetOptions
    }
  }), [
    selectableUsers,
    selectedUsers,
    bulkEditIsActive,
    isListChecked,
    selectedOptions,
    toggleOption,
    resetOptions
  ]);

  return (
    <UserEditContext.Provider value={providerValue}>
      {children}
    </UserEditContext.Provider>
  );
};