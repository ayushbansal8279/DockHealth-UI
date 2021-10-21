import React, { useRef, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Popover } from '@material-ui/core';
import ColumnDisplayIcon from 'img/settings-icon';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { TaskItemColumn, MAX_COLUMNS_TO_SHOW } from 'helpers/task-helpers';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { userProfileSelector } from 'selectors/user-selectors';
import { capitalize } from 'helpers/capitalize';
import Tooltip from 'components/common/Tooltip/Tooltip';
import {
  ColumnDisplayContainer,
  ColumnDisplayHeader,
  ColumnDisplayOption,
  ColumnDisplayLabel,
  ColumnDisplayIcon as StyledColumnDisplayIcon,
} from './styled';

const ColumnDisplaySettings = ({ columnsConfig, onClickCheckbox }) => {
  const userProfile = useSelector(userProfileSelector);
  const iconReference = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const ColumnOptionNames = {
    [TaskItemColumn.ACTIVITY]: 'Comments, labels and attachments',
    [TaskItemColumn.ASSIGNED]: 'Assigned',
    [TaskItemColumn.WORKFLOW_STATUS]: 'Status',
    [TaskItemColumn.DUE_DATE]: 'Date',
    [TaskItemColumn.PATIENT]: capitalize(getCustomerTypeLabel(userProfile)),
  };

  const disableUnchecked = useMemo(() => {
    const checkedCount = Object.keys(columnsConfig).reduce(
      (accumulator, key) =>
        columnsConfig[key] ? accumulator + 1 : accumulator,
      0,
    );
    return checkedCount >= MAX_COLUMNS_TO_SHOW;
  }, [columnsConfig]);

  return (
    <>
      <Popover
        style={{ zIndex: 2001 }}
        anchorEl={iconReference?.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <ColumnDisplayContainer>
          <ColumnDisplayHeader>
            Which column would you like to see?
          </ColumnDisplayHeader>
          {Object.keys(columnsConfig).map(columnKey => {
            const optionName = ColumnOptionNames[columnKey];
            const isChecked = columnsConfig[columnKey];
            const isDisabled = disableUnchecked && !isChecked;
            return (
              optionName && (
                <Tooltip
                  key={columnKey}
                  title="Max 3 selected columns"
                  hideTooltip={!isDisabled}
                >
                  <div>
                    <ColumnDisplayOption
                      isDisabled={isDisabled}
                      onClick={() => {
                        return isDisabled ? null : onClickCheckbox(columnKey);
                      }}
                    >
                      <Checkbox isDisabled={isDisabled} isChecked={isChecked} />
                      <ColumnDisplayLabel>{optionName}</ColumnDisplayLabel>
                    </ColumnDisplayOption>
                  </div>
                </Tooltip>
              )
            );
          })}
        </ColumnDisplayContainer>
      </Popover>
      <StyledColumnDisplayIcon
        ref={iconReference}
        src={ColumnDisplayIcon}
        alt="settings"
        onClick={() => setIsOpen(!isOpen)}
      />
    </>
  );
};

export default ColumnDisplaySettings;
