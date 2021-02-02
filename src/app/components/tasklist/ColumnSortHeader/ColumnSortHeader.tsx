import React, { useCallback, useState } from 'react';
import SortArrow, {
  SortOrderType,
} from 'components/common/SortArrow/SortArrow';
import { SortArrowWrapper, SortButton } from './styled';

interface ColumnSortHeaderProps {
  id: string;
  label?: string;
  sort: { key: string | null; order: string | null };
  width?: number;
  onSortChange?: (key: string | null, order: string | null) => void;
}

const ColumnSortHeader: React.FC<ColumnSortHeaderProps> = ({
  id,
  label,
  width,
  sort,
  onSortChange,
}) => {
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
      {label}
    </SortButton>
  );
};

export default ColumnSortHeader;
