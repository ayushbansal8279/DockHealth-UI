import React, { useEffect, useRef } from 'react';
// eslint-disable-next-line import/no-named-as-default
import { useBoolean } from 'hooks/useBoolean';
import { useDispatch, useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import {
  organizationStatusesSelector,
  fetchingOrganizationStatusesSelector,
  organizationStatusesErrorSelector,
} from 'selectors/organization-selectors';
import { getOrganizationStatuses } from 'sagas/organization-saga';
import { StatusListWrapper, StatusList, Divider } from './styled';
import { RESET_STATUS } from './helpers';
import StatusEditor from './StatusEditor';
import PopoverBottomBar from '../PopoverBottomBar/PopoverBottomBar';
import WorkflowStatusItemButton from '../WorkflowStatusItem/WorkflowStatusItemButton';
import WorkflowStatusItemLoader from '../WorkflowStatusItem/WorkflowStatusItemLoader';

const TaskWorkflowStatus = ({
  selectedStatusIdentifier,
  updateWorkflowStatus,
  onClose,
  onWidthChange,
}) => {
  const wrapperReference = useRef(null);
  const [isEditing, setIsEditing, unsetIsEditing] = useBoolean(false);
  const dispatch = useDispatch();

  const userProfile = useSelector(userProfileSelector);
  const isAdmin = checkIfUserIsOrganizationAdmin(userProfile);

  const statuses = useSelector(organizationStatusesSelector);
  const isFetching = useSelector(fetchingOrganizationStatusesSelector);
  const error = useSelector(organizationStatusesErrorSelector);

  const statusesCount = statuses?.length || 0;

  useEffect(() => {
    if (typeof onWidthChange === 'function') onWidthChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, statusesCount]);

  useEffect(() => {
    if (!statuses) dispatch(getOrganizationStatuses());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const handleStatusSelect = (status) => {
    updateWorkflowStatus(status);
    onClose();
  };

  const numberOfElements = (statuses?.length || 0) + 1;

  return (
    <StatusListWrapper ref={wrapperReference}>
      {!isEditing ? (
        <>
          <StatusList elementsCount={numberOfElements}>
            {!isFetching ? (
              <>
                <WorkflowStatusItemButton
                  selected={!selectedStatusIdentifier}
                  onStatusClick={() => handleStatusSelect(null)}
                  status={RESET_STATUS}
                  colorBorder
                />
                {statuses?.map((status) => (
                  <WorkflowStatusItemButton
                    key={status.identifier}
                    selected={status.identifier === selectedStatusIdentifier}
                    onStatusClick={() => handleStatusSelect(status)}
                    status={status}
                  />
                ))}
              </>
            ) : (
              new Array(8).fill().map((_, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <WorkflowStatusItemLoader key={index} />
              ))
            )}
          </StatusList>
          {isAdmin && (
            <>
              <Divider />
              <PopoverBottomBar align="left">
                <PopoverBottomBar.PlusButton
                  type="button"
                  onClick={setIsEditing}
                >
                  Add/Edit status
                </PopoverBottomBar.PlusButton>
              </PopoverBottomBar>
            </>
          )}
        </>
      ) : (
        <StatusEditor onClose={unsetIsEditing} />
      )}
    </StatusListWrapper>
  );
};
export default TaskWorkflowStatus;
