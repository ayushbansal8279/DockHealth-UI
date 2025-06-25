import { createContext, useCallback, useMemo, useState } from "react";

export const BulkEditContext = createContext();

export const BulkEditProvider = ({ children, bulkOptions = [], viewType = "" }) => {
  const [selectableItems, setSelectableItems] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState(() =>
    Object.fromEntries(bulkOptions.map(({ key }) => [key, false]))
  );

  const toggleItem = useCallback((itemId) => {
    setSelectableItems(prev =>
      prev.map(item =>
        item.identifier === itemId
          ? { ...item, isSelected: !item.isSelected }
          : item
      )
    );
  }, []);

  const toggleAllItems = useCallback(() => {
    setSelectableItems(prevItems => {
      const allSelected = prevItems.every(item => item.isSelected);
      return prevItems.map(item => ({
        ...item,
        isSelected: !allSelected
      }));
    });
  }, []);

  const unselectAllItems = useCallback(() => {
    setSelectableItems(prevItems =>
      prevItems.map(item => ({ ...item, isSelected: false }))
    );
  }, []);

  const selectedItems = useMemo(() => {
    return selectableItems?.filter(item => item.isSelected);
  }, [selectableItems]);

  const bulkEditIsActive = useMemo(() => selectedItems?.length > 0, [selectedItems]);

  const isListChecked = useMemo(() => {
    const selectedCount = selectableItems?.filter(item => item.isSelected).length;
    return (
      selectableItems?.length > 0 &&
      selectedCount > 0 &&
      selectableItems.length === selectedCount
    );
  }, [selectableItems]);

  const toggleOption = useCallback((optionName) => {
    setSelectedOptions(prev =>
      Object.keys(prev).reduce((acc, key) => {
        acc[key] = key === optionName ? !prev[key] : false;
        return acc;
      }, {})
    );
  }, []);

  const resetOptions = useCallback(() => {
    setSelectedOptions(prev =>
      Object.fromEntries(Object.keys(prev).map(key => [key, false]))
    );
  }, []);

  const isOptionActive = useCallback(
    (optionName) => !!selectedOptions[optionName],
    [selectedOptions]
  );

  const providerValue = useMemo(() => ({
    selectableItems,
    setSelectableItems,
    toggleItem,
    toggleAllItems,
    unselectAllItems,
    selectedItems,
    bulkEditIsActive,
    isListChecked,
    selectedOptions,
    bulkOptions,
    viewType,
    selectedOptionsHandler: {
      toggleOption,
      resetOptions,
      isOptionActive
    }
  }), [
    selectableItems,
    selectedItems,
    bulkEditIsActive,
    isListChecked,
    selectedOptions,
    bulkOptions,
    viewType,
    toggleOption,
    resetOptions,
    isOptionActive
  ]);

  return (
    <BulkEditContext.Provider value={providerValue}>
      {children}
    </BulkEditContext.Provider>
  );
};