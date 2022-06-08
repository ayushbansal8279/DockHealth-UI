/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState, useRef } from 'react';
import SortArrow from 'components/common/SortArrow/SortArrow';
import { SortOrderType } from 'helpers/sorting-helper';
import { checkIfShouldDisplayTooltip } from 'components/task/OverflowTooltip/OverflowTooltip';
import { Box, Fade, Popper } from '@material-ui/core';
import { Draggable } from 'react-beautiful-dnd';
import ThreeDotsIcon from 'img/three-dots.svg';
import {
  SortButton,
  LabelWrapper,
  DescriptionTooltipWrapper,
  ThreeDots,
} from './styled';

interface ColumnSortHeaderProps {
  id: string;
  disabled?: boolean;
  label?: ReactChild;
  sort: { key: string | null; order: string | null };
  width?: number;
  onSortChange?: (key: string | null, order: string | null) => void;
  truncateEnabled: boolean;
  isDraggingOver?: boolean;
  draggable?: boolean;
  index?: number;
  printWidth?: number;
  snapshot?: any;
}

const ColumnSortHeader: React.FC<ColumnSortHeaderProps> = ({
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
  printWidth,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const descriptionTextReference = useRef();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const switchSort = useCallback(() => {
    if (disabled || typeof onSortChange !== 'function' || isDraggingOver)
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
  }, [disabled, onSortChange, isDraggingOver, sort, id]);

  const randerContent = useCallback(() => {
    return (
      <>
        <LabelWrapper
          ordered={!!(id === sort?.key && sort?.order)}
          ref={descriptionTextReference}
        >
          <Box display="flex">
            {draggable && (
              <Box p="0 5px 0 5px">
                <Box>
                  <ThreeDots
                    hideIcon={!isHovered || isDraggingOver}
                    src={ThreeDotsIcon}
                  />
                </Box>
              </Box>
            )}
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
      </>
    );
  }, [draggable, id, isHovered, label, onSortChange, sort, truncateEnabled]);

  if (!draggable)
    return (
      <SortButton
        disabled={!label || disabled}
        type="button"
        width={width}
        onClick={switchSort}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {randerContent()}
      </SortButton>
    );

  return (
    <SortButton
      type="button"
      width={snapshot?.draggingOverWith === id ? 0 : width}
      onClick={switchSort}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      printWidth={printWidth}
    >
      <Draggable key={id} draggableId={id} index={index}>
        {(provided: any) => (
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
  );
};

export default ColumnSortHeader;
