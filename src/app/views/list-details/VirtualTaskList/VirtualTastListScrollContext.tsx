import React, {
  ComponentType,
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface IVirtalTaskListScrollContext {
  visibleWidth: number | null;
  droppableHeaderWidth: number | null;
}

const VirtalTaskListScrollContext = createContext(
  {} as IVirtalTaskListScrollContext,
);

export const VirtaulTaskListScrollProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [droppableHeaderWidth, setDroppableHeaderWidth] = useState<
    number | null
  >(null); // width of task list header
  const [visibleWidth, setVisibleWidth] = useState<number | null>(null);

  useEffect(() => {
    const visibleHeaderResizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        console.warn('visibleWidthElement entry not found');
        return;
      }
      console.log('visibleWidth', entry.contentRect.width);
      setVisibleWidth(entry.contentRect.width);
    });

    const droppableHeaderResizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        console.warn('droppableHeaderWidthElement entry not found');
        return;
      }
      console.log('droppableHeaderWidth', entry.contentRect.width);
      setDroppableHeaderWidth(entry.contentRect.width);
    });

    const intervalId = setInterval((): void => {
      const visibleHeader = document.querySelector(
        '[data-test-id="v-task-header"]',
      );
      const droppableHeader = visibleHeader?.querySelector(
        '[data-rbd-droppable-id="droppableHeader"]',
      );

      if (!visibleHeader || !droppableHeader) return;

      clearInterval(intervalId);

      visibleHeaderResizeObserver.observe(visibleHeader);
      droppableHeaderResizeObserver.observe(droppableHeader);
    }, 700);

    return () => {
      console.log('observe unsubscribed');
      const visibleHeader = document.querySelector(
        '[data-test-id="v-task-header"]',
      );
      const droppableHeader = visibleHeader?.querySelector(
        '[data-rbd-droppable-id="droppableHeader"]',
      );

      if (visibleHeader) {
        visibleHeaderResizeObserver.unobserve(visibleHeader);
      }
      if (droppableHeader) {
        droppableHeaderResizeObserver.unobserve(droppableHeader);
      }
    };
  }, []);

  // todo: QuickAddTask-container.width = droppableHeaderWidth
  // todo: QuickAddTask.width = visibleWidth - something

  return (
    <VirtalTaskListScrollContext.Provider
      value={{ visibleWidth, droppableHeaderWidth }}
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
