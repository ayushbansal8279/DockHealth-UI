import React, { useCallback, useState, useRef } from 'react';
import SortArrow from 'components/common/SortArrow/SortArrow';
import { SortOrderType } from 'helpers/sorting-helper';
import { checkIfShouldDisplayTooltip } from 'components/task/OverflowTooltip/OverflowTooltip';
import { Fade, Popper, Tooltip } from '@material-ui/core';
import {
  SortArrowWrapper,
  SortButton,
  LabelWrapper,
  DescriptionTooltipWrapper,
} from './styled';

interface ColumnSortHeaderProps {
  id: string;
  label?: ReactChild;
  sort: { key: string | null; order: string | null };
  width?: number;
  onSortChange?: (key: string | null, order: string | null) => void;
  truncateEnabled: boolean;
}

const ColumnSortHeader: React.FC<ColumnSortHeaderProps> = ({
  id,
  label,
  width,
  sort,
  onSortChange,
  truncateEnabled,
}) => {
  const descriptionTextReference = useRef();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const switchSort = useCallback(() => {
    if (typeof onSortChange !== 'function') return;

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
  }, [id, sort, onSortChange]);

  return (
    <SortButton
      truncateEnabled={truncateEnabled}
      disabled={!label}
      type="button"
      width={width}
      onClick={switchSort}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {id && label && typeof onSortChange === 'function' && (
        <SortArrowWrapper>
          <SortArrow
            isParentHovered={isHovered}
            orderType={id === sort?.key && sort?.order}
          />
        </SortArrowWrapper>
      )}
      <LabelWrapper
        ordered={!!(id === sort?.key && sort?.order)}
        ref={descriptionTextReference}
      >
        {label}
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
    </SortButton>
  );
};

export default ColumnSortHeader;
