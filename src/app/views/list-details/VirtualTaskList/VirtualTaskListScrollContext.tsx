import React, {
  ComponentType,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { TaskItemColumnWidth } from 'helpers/task-helpers';
import { useTaskListColumnsConfig } from '@/app/context-api/columns-config-context';
import { TaskColumn } from '@/app/types/Task';

interface IVirtalTaskListScrollContext {
  visibleWidth: number | null;
  droppableHeaderWidth: number | null;
  updateVisibleWidth: (w: number) => void;
}

const VirtalTaskListScrollContext = createContext(
  {} as IVirtalTaskListScrollContext,
);

export const VirtaulTaskListScrollProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [visibleWidth, setVisibleWidth] = useState<number | null>(null);
  const { columns } = useTaskListColumnsConfig() as { columns: TaskColumn[] };

  const droppableHeaderWidth = useMemo(() => {
    const columnsWidthSum: number | null = !window.disabledVirtualTaskList
      ? columns
          .filter((f) => f.isChecked)
          .reduce(
            (accumulator: number, column) =>
              accumulator +
              Math.max(
                TaskItemColumnWidth[column.identifier]?.MINIMUM || 0,
                column.columnWidth,
              ),
            0,
          )
      : null;

    return columnsWidthSum ? columnsWidthSum + 80 : null;
  }, [columns]);

  const updateVisibleWidth = useCallback((w: number) => {
    setVisibleWidth(w);
  }, []);

  return (
    <VirtalTaskListScrollContext.Provider
      value={{
        visibleWidth,
        droppableHeaderWidth,
        updateVisibleWidth,
      }}
    >
      {children}
    </VirtalTaskListScrollContext.Provider>
  );
};

export function withVirtualTaskListScrollContext<
  T extends JSX.IntrinsicAttributes,
>(WrappedComponent: ComponentType<T>) {
  const ComponentWithContext = (props: T) => (
    <VirtaulTaskListScrollProvider>
      <WrappedComponent {...props} />
    </VirtaulTaskListScrollProvider>
  );

  return ComponentWithContext;
}

export const useVirtualTaskListScrollContext = () =>
  useContext(VirtalTaskListScrollContext);
