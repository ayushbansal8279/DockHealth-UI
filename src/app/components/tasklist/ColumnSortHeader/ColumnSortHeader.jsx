/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState, useRef, useEffect } from 'react';
import SortArrow from 'components/common/SortArrow/SortArrow';
import { SortOrderType } from 'helpers/sorting-helper';
// import { checkIfShouldDisplayTooltip } from 'components/task/OverflowTooltip/OverflowTooltip';
import { Box, Fade, Popper } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import ThreeDotsIcon from 'img/three-dots.svg';
import { Resizable } from 'react-resizable';
import usePrevious from 'hooks/use-previous';
import {
  SortButton,
  LabelWrapper,
  // DescriptionTooltipWrapper,
  ThreeDots,
  ResizeHandler,
  DragPreviewWrapper,
  DragPreviewText,
} from './styled';
import SortDoubleArrow from 'img/SortDoubleArrow';
import { useDraggable, useDroppable } from '@dnd-kit/core';

const ColumnSortHeader = ({
  id,
  label,
  width,
  sort,
  onSortChange,
  truncateEnabled,
  disabled,
  isDraggingOver,
  draggable = false,
  index,
  snapshot,
  onResize,
  printWidth,
  children,
  flex,
  tasksHeaderTextTransform,
  tasksHeaderTextColor,
  isDragPreview,
  dragDropDisabled,
  setDragDropDisabled,
  dropDirectionRef,
  hoveredIndex,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const descriptionTextReference = useRef();
  const [columnWidth, setcolumnWidth] = useState(+width);
  const [isResizing, setIsResizing] = useState(false);
  const [hoverBorder, setHoverBorder] = useState(null);
  const previousWidth = usePrevious(width);

  const {
    setNodeRef: dropRef,
    isOver,
    active,
    over,
  } = useDroppable({
    id,
    data: { index, label, width, tasksHeaderTextTransform },
    disabled: dragDropDisabled,
  });

  const {
    attributes,
    listeners,
    setNodeRef: dragRef,
  } = useDraggable({
    id,
    data: { index, label, width, tasksHeaderTextTransform },
    disabled: dragDropDisabled,
  });

  useEffect(() => {
    const isFirstColumnHeader = index === 0;

    if (!isFirstColumnHeader || !active || !isOver) {
      setHoverBorder(null);
      if (dropDirectionRef) {
        dropDirectionRef.current = null;
      }
      return;
    }

    const handlePointerMove = (e) => {
      const rect = descriptionTextReference?.current?.getBoundingClientRect();
      if (!rect) return;

      const isLeft = e?.clientX < rect?.left + rect?.width / 2;
      const direction = isLeft ? 'left' : 'right';

      if (dropDirectionRef) {
        dropDirectionRef.current = direction;
      }
      setHoverBorder(direction);
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [active?.id, over?.id, index]);

  useEffect(() => {
    if (width && previousWidth !== width && width !== columnWidth)
      setcolumnWidth(width);
  }, [columnWidth, previousWidth, width]);

  const switchSort = useCallback(() => {
    if (
      isResizing ||
      disabled ||
      typeof onSortChange !== 'function' ||
      isOver // isDraggingOver
    )
      return;

    const { key, order } = sort || {};

    if (!key || key !== id) {
      onSortChange(id, SortOrderType.ASC);
    } else {
      switch (order) {
        case null: {
          onSortChange(id, SortOrderType.ASC);
          break;
        }
        case SortOrderType.ASC: {
          onSortChange(id, SortOrderType.DESC);
          break;
        }
        case SortOrderType.DESC: {
          onSortChange(id, SortOrderType.DEFAULT);
          break;
        }
        default: {
          onSortChange(id, SortOrderType.DEFAULT);
          break;
        }
      }
    }
  }, [isResizing, disabled, onSortChange, isOver, sort, id]);

  const handleResize = useCallback((_, data) => {
    setcolumnWidth(data.size.width);
  }, []);

  const handleResizeStop = useCallback(
    (event, data) => {
      setDragDropDisabled(false);
      if (typeof onResize === 'function') onResize(id, event, data);
      setTimeout(() => setIsResizing(false), 1000);
    },
    [id, onResize],
  );

  const randerContent = useCallback(
    // eslint-disable-next-line no-shadow
    (tasksHeaderTextColor) => {
      return (
        <div>
          <LabelWrapper
            ordered={!!(id === sort?.key && sort?.order)}
            tasksHeaderTextColor={tasksHeaderTextColor}
            ref={descriptionTextReference}
          >
            <Box display="flex">
              <Box p="0 5px 0 5px" position="relative">
                <Box position="absolute" left="5px" top="0px">
                  {draggable && (
                    <ThreeDots hideIcon={isOver} src={ThreeDotsIcon} />
                  )}
                </Box>
              </Box>
              {children}
              {id === sort?.key &&
                sort?.order &&
                id &&
                label &&
                typeof onSortChange === 'function' && (
                  <Box p="0 5px 0 5px" mr="4px">
                    <SortArrow orderType={id === sort?.key && sort?.order} />
                  </Box>
                )}
              <Box
                textOverflow="ellipsis"
                overflow={truncateEnabled ? 'hidden' : 'initial'}
                width="100%"
                whiteSpace="nowrap"
                display="flex"
                alignItems="center"
                fontFamily="Outfit"
                fontWeight="600"
                pl="5px"
              >
                {label}
                <Box ml="5px" visibility="hidden">
                  {!disabled && <SortDoubleArrow />}
                </Box>
              </Box>
            </Box>
          </LabelWrapper>
          {/* <Popper
            anchorEl={descriptionTextReference.current}
            placement="bottom-start"
            open={checkIfShouldDisplayTooltip(descriptionTextReference.current)}
            style={{
              zIndex: 115,
              maxWidth:
                descriptionTextReference?.current?.offsetWidth || '650px',
            }}
            transition
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={250}>
                <DescriptionTooltipWrapper>{label}</DescriptionTooltipWrapper>
              </Fade>
            )}
          </Popper> */}
        </div>
      );
    },
    [
      children,
      draggable,
      id,
      isOver,
      disabled,
      label,
      onSortChange,
      sort,
      truncateEnabled,
    ],
  );

  if (isDragPreview && !dragDropDisabled) {
    return (
      <>
        <DragPreviewWrapper
          width={width}
          tasksHeaderTextTransform={tasksHeaderTextTransform}
        >
          <DragPreviewText>{label}</DragPreviewText>
        </DragPreviewWrapper>
      </>
    );
  }

  return (
    <Resizable
      {...attributes}
      {...listeners}
      onResizeStart={() => {
        setDragDropDisabled(true);
        setIsResizing(true);
      }}
      minConstraints={[20, 20]}
      maxConstraints={[1000, 35]}
      height={35}
      width={columnWidth}
      onResize={handleResize}
      onResizeStop={handleResizeStop}
      axis={typeof onResize === 'function' ? 'x' : 'none'}
      handle={
        <Box
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
          }}
        >
          {typeof handleResize === 'function' && (
            <ResizeHandler enabled={typeof onResize === 'function'} />
          )}
        </Box>
      }
    >
      <SortButton
        ref={(node) => {
          dropRef(node);
          dragRef(node);
          descriptionTextReference.current = node;
        }}
        type="button"
        width={snapshot?.draggingOverWith === id ? 0 : columnWidth}
        onClick={switchSort}
        printWidth={printWidth}
        tasksHeaderTextTransform={tasksHeaderTextTransform}
        isOver={isOver}
        isDragActive={!!active && active?.id === id && !dragDropDisabled}
        isDraggedOver={isOver && active?.id !== id && !dragDropDisabled}
        hoverBorder={hoverBorder}
        hoveredIndex={hoveredIndex}
      >
        <div>{randerContent(tasksHeaderTextColor)}</div>
      </SortButton>
    </Resizable>
  );
};

export default ColumnSortHeader;
