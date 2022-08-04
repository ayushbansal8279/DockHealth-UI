/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState, useRef, useEffect } from 'react';
import SortArrow from 'components/common/SortArrow/SortArrow';
import { SortOrderType } from 'helpers/sorting-helper';
import { checkIfShouldDisplayTooltip } from 'components/task/OverflowTooltip/OverflowTooltip';
import { Box, Fade, Popper } from '@material-ui/core';
import { Draggable } from 'react-beautiful-dnd';
import ThreeDotsIcon from 'img/three-dots.svg';
import { Resizable } from 'react-resizable';
import usePrevious from 'hooks/use-previous';
import {
  SortButton,
  LabelWrapper,
  DescriptionTooltipWrapper,
  ThreeDots,
  ResizeHandler,
} from './styled';

const ColumnSortHeader = ({
  id,
  label,
  width = 100,
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
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const descriptionTextReference = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const [columnWidth, setcolumnWidth] = useState(+width);
  const [isResizing, setIsResizing] = useState(false);
  const previousWidth = usePrevious(width);

  useEffect(() => {
    if (width && previousWidth !== width && width !== columnWidth)
      setcolumnWidth(width);
  }, [columnWidth, previousWidth, width]);

  const switchSort = useCallback(() => {
    if (
      isResizing ||
      disabled ||
      typeof onSortChange !== 'function' ||
      isDraggingOver
    )
      return;

    const { key, order } = sort || {};

    if (!key || key !== id) {
      onSortChange(id, SortOrderType.ASC);
    } else {
      switch (order) {
        case null:
          onSortChange(id, SortOrderType.ASC);
          break;
        case SortOrderType.ASC:
          onSortChange(id, SortOrderType.DESC);
          break;
        case SortOrderType.DESC:
          onSortChange(id, SortOrderType.DEFAULT);
          break;
        default:
          onSortChange(id, SortOrderType.DEFAULT);
          break;
      }
    }
  }, [isResizing, disabled, onSortChange, isDraggingOver, sort, id]);

  const handleResize = useCallback((_, data) => {
    setcolumnWidth(data.size.width);
  }, []);

  const handleResizeStop = useCallback(
    (event, data) => {
      if (typeof onResize === 'function') onResize(id, event, data);
      setTimeout(() => setIsResizing(false), 1000);
    },
    [id, onResize],
  );

  const randerContent = useCallback(() => {
    return (
      <div>
        <LabelWrapper
          ordered={!!(id === sort?.key && sort?.order)}
          ref={descriptionTextReference}
        >
          <Box display="flex">
            <Box p="0 5px 0 10px" position="relative">
              <Box position="absolute" left="5px" top="0px">
                {draggable && (
                  <ThreeDots
                    hideIcon={!isHovered || isDraggingOver}
                    src={ThreeDotsIcon}
                  />
                )}
              </Box>
            </Box>
            {children}
            {id === sort?.key &&
              sort?.order &&
              id &&
              label &&
              typeof onSortChange === 'function' && (
                <Box p="0 5px 0 5px">
                  <SortArrow
                    isParentHovered={false}
                    orderType={id === sort?.key && sort?.order}
                  />
                </Box>
              )}

            <Box
              textOverflow="ellipsis"
              overflow={truncateEnabled ? 'hidden' : 'initial'}
              width="100%"
              whiteSpace="nowrap"
              display="flex"
              alignItems="center"
            >
              {label}
            </Box>
          </Box>
        </LabelWrapper>
        <Popper
          anchorEl={descriptionTextReference.current}
          placement="bottom-start"
          open={
            checkIfShouldDisplayTooltip(descriptionTextReference.current) &&
            isHovered
          }
          style={{
            zIndex: 115,
            maxWidth: descriptionTextReference?.current?.offsetWidth || '650px',
          }}
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={250}>
              <DescriptionTooltipWrapper>{label}</DescriptionTooltipWrapper>
            </Fade>
          )}
        </Popper>
      </div>
    );
  }, [
    children,
    draggable,
    id,
    isDraggingOver,
    isHovered,
    label,
    onSortChange,
    sort,
    truncateEnabled,
  ]);

  if (!draggable)
    return (
      <Resizable
        onResizeStart={() => setIsResizing(true)}
        minConstraints={[20, 20]}
        maxConstraints={[1000, 35]}
        height={35}
        width={columnWidth}
        onResize={handleResize}
        onResizeStop={handleResizeStop}
        axis={typeof onResize === 'function' ? 'x' : 'none'}
        handle={
          <Box
            onClick={event => {
              event.stopPropagation();
              event.preventDefault();
            }}
          >
            <ResizeHandler enabled={typeof onResize === 'function'} />
          </Box>
        }
      >
        <SortButton
          flex={flex}
          disabled={!label || disabled}
          type="button"
          width={columnWidth}
          onClick={switchSort}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {randerContent()}
        </SortButton>
      </Resizable>
    );

  return (
    <Resizable
      onResizeStart={() => setIsResizing(true)}
      minConstraints={[20, 20]}
      maxConstraints={[1000, 35]}
      height={35}
      width={columnWidth}
      onResize={handleResize}
      onResizeStop={handleResizeStop}
      axis={typeof onResize === 'function' ? 'x' : 'none'}
      handle={
        <Box
          onClick={event => {
            event.stopPropagation();
            event.preventDefault();
          }}
        >
          <ResizeHandler enabled={typeof onResize === 'function'} />
        </Box>
      }
    >
      <SortButton
        type="button"
        width={snapshot?.draggingOverWith === id ? 0 : columnWidth}
        onClick={switchSort}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        printWidth={printWidth}
      >
        <Draggable
          isDragDisabled={!draggable}
          key={id}
          draggableId={id}
          index={index}
        >
          {provided => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={provided.draggableProps.style}
            >
              {randerContent()}
            </div>
          )}
        </Draggable>
      </SortButton>
    </Resizable>
  );
};

export default ColumnSortHeader;
