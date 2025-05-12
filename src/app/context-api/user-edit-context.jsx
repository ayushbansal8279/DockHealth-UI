import { createContext, useCallback, useMemo, useState } from "react";

export const UserEditContext = createContext();

export const UserEditProvider = ({ children }) => {
  const [selectableUsers, setSelectableUsers] = useState([]);
  const [createTaskOption, setCreateTaskOption] = useState(false);
  const [createWorkflowOption, setCreateWorkflowOption] = useState(false);

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
    return selectableUsers.filter(user => user.isSelected);
  }, [selectableUsers]);

  const bulkEditIsActive = useMemo(() => {
    return selectedUsers.length > 0;
  }, [selectedUsers]);

  const turnOffAllOptions = useCallback(() => {
    setCreateTaskOption(false);
    setCreateWorkflowOption(false);
  }, []);

  const toggleCreateTaskOption = useCallback(() => {
    setCreateTaskOption(prev => !prev);
    setCreateWorkflowOption(false);
  }, []);

  const toggleCreateWorkflowOption = useCallback(() => {
    setCreateWorkflowOption(prev => !prev);
    setCreateTaskOption(false);
  }, []);

  const isListChecked = useMemo(() => {
    const selectedCount = selectableUsers.filter(user => user.isSelected).length;
    return selectableUsers.length > 0 && selectedCount > 0 && selectableUsers.length === selectedCount;
  }, [selectableUsers]);
  
  const providerValue = useMemo(() => ({
    selectableUsers,
    setSelectableUsers,
    toggleUser,
    toggleAllUser,
    unselectAllUser,
    selectedUsers,
    bulkEditIsActive,
    isListChecked,
    selectedOptions: {
      createTaskOption,
      createWorkflowOption
    },
    selectedOptionsHandler: {
      toggleCreateTaskOption,
      toggleCreateWorkflowOption,
      turnOffAllOptions
    }
  }), [
    selectableUsers,
    selectedUsers,
    bulkEditIsActive,
    createTaskOption,
    createWorkflowOption,
    isListChecked,
    toggleCreateTaskOption,
    toggleCreateWorkflowOption,
    turnOffAllOptions
  ]);

  return (
    <UserEditContext.Provider value={providerValue}>
      {children}
    </UserEditContext.Provider>
  );
};