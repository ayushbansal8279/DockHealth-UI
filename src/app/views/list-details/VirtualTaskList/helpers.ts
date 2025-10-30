type ComponentType = 'VTASK' | 'VSUBTASK';

interface WidthParams {
  origin: string;
  percentage: number;
  visibleWidth?: number;
  droppableHeaderWidth?: number;
  componentType: ComponentType;
}

/**
 * Returns all 6 calculated values for VTask or VSubtask.
 */
export const getAddTaskWidths = ({
  origin,
  percentage,
  visibleWidth = 0,
  droppableHeaderWidth = 0,
  componentType,
}: WidthParams) => {
  // define config for both components
  const config = {
    VTASK: {
      subtask: {
        high: 103,
        low: 120,
        fallback: 38,
        padding: { list: ['16px', '15px'], other: '0px' },
      },
      workflow: {
        high: 69.5,
        low: 85,
        fallback: 0,
        padding: { list: ['16px', '15px'], other: '0px' },
      },
    },
    VSUBTASK: {
      subtask: {
        high: 100,
        low: 120,
        fallback: 38,
        padding: { list: ['17px', '15px'], other: '0px' },
      },
      workflow: {
        high: 70,
        low: 85,
        fallback: 0,
        padding: { list: ['16px', '15px'], other: '0px' },
      },
    },
  }[componentType];

  const calcVisibleWidth = (high: number, low: number, fallback: number) => {
    if (origin === 'LIST') {
      if (percentage > 90)
        return visibleWidth ? `${visibleWidth - high}px` : '100%';
      return `${visibleWidth - low}px`;
    }
    return percentage > 90
      ? visibleWidth
        ? `${visibleWidth}px`
        : '100%'
      : `${visibleWidth - fallback}px`;
  };

  const calcDroppableWidth = () =>
    origin === 'LIST'
      ? percentage > 90
        ? `${droppableHeaderWidth + 70}`
        : '100%'
      : percentage > 90
      ? `${droppableHeaderWidth}`
      : '100%';

  const calcPaddingRight = (padding: {
    list: [string, string];
    other: string;
  }) =>
    origin === 'LIST'
      ? percentage > 90
        ? padding.list[0]
        : padding.list[1]
      : padding.other;

  // 🧩 build all six values
  return {
    addSubtaskVisibleWidth: calcVisibleWidth(
      config.subtask.high,
      config.subtask.low,
      config.subtask.fallback,
    ),
    addSubtaskDroppableHeaderWidth: calcDroppableWidth(),
    addSubtaskPaddingRight: calcPaddingRight(config.subtask.padding),

    addWorkflowTaskVisibleWidth: calcVisibleWidth(
      config.workflow.high,
      config.workflow.low,
      config.workflow.fallback,
    ),
    addWorkflowTaskDroppableHeaderWidth: calcDroppableWidth(),
    addWorkflowTaskPaddingRight: calcPaddingRight(config.workflow.padding),
  };
};
