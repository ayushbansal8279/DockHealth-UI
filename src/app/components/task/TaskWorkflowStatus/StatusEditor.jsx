import React, { useCallback, useEffect, useState } from 'react';
import pluck from 'ramda/src/pluck';
import PopoverBottomBar from 'components/task/PopoverBottomBar/PopoverBottomBar';
import { useDispatch, useSelector } from 'react-redux';
import { organizationStatusesSelector } from 'selectors/organization-selectors';
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import {
  deleteOrganizationStatus,
  createOrganizationStatus,
  updateOrganizationStatus,
  reorderOrganizationStatuses,
} from 'sagas/organization-saga';
import EditableWorkflowStatusItem from 'components/task/WorkflowStatusItem/EditableWorkflowStatusItem';
import SortableItem from 'components/common/SortableItem/SortableItem';
import { RESET_STATUS, StatusColor } from './helpers';
import {
  StatusList,
  StatusListWrapper,
  NewStatusButtonWrapper,
  NewStatusButton,
  Divider,
  ColorPickerWrapper,
  ColorButton,
} from './styled';

const DEFAULT_SELECTED_COLOR = StatusColor.YELLOW;

// eslint-disable-next-line sonarjs/cognitive-complexity
const StatusEditor = ({ onClose }) => {
  const [defaultColor, setDefaultColor] = useState(DEFAULT_SELECTED_COLOR);
  const [currentlyEditedStatus, setCurrentlyEditedStatus] = useState(null);
  const statuses = useSelector(organizationStatusesSelector);
  const dispatch = useDispatch();

  const isAddingNewStatus =
    currentlyEditedStatus && !currentlyEditedStatus.identifier;
  const newStatusButtonVisible = !isAddingNewStatus && statuses?.length < 29;

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    if (currentlyEditedStatus?.identifier) {
      const editedStatus = statuses.find(
        ({ identifier }) => identifier === currentlyEditedStatus.identifier,
      );
      setCurrentlyEditedStatus(editedStatus || null);
    } else if (isAddingNewStatus) {
      setCurrentlyEditedStatus(statuses[statuses.length - 1]);
    } else {
      setCurrentlyEditedStatus(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statuses]);

  const handleInputChange = event => {
    const newValue = event.target?.value;
    setCurrentlyEditedStatus(previousState => ({
      ...previousState,
      name: newValue,
    }));
  };

  const updateStatus = (identifier, dataToUpdate) => {
    const previousStatusData = statuses.find(
      status => status.identifier === identifier,
    );

    if (
      (dataToUpdate.name && dataToUpdate.name !== previousStatusData.name) ||
      (dataToUpdate.color && dataToUpdate.color !== previousStatusData.color)
    ) {
      dispatch(
        updateOrganizationStatus(currentlyEditedStatus.identifier, {
          ...previousStatusData,
          ...dataToUpdate,
        }),
      );
    }
  };

  const handleSaveStatus = () => {
    if (!currentlyEditedStatus.name) {
      setCurrentlyEditedStatus(null);
      return;
    }

    if (currentlyEditedStatus.identifier) {
      updateStatus(currentlyEditedStatus.identifier, {
        name: currentlyEditedStatus.name,
      });
    } else {
      dispatch(createOrganizationStatus(currentlyEditedStatus));
    }
  };

  const handlePickColor = color => {
    if (isAddingNewStatus) return;

    if (!currentlyEditedStatus) {
      setDefaultColor(color);
    } else {
      setCurrentlyEditedStatus(previousState => ({
        ...previousState,
        color,
      }));

      if (currentlyEditedStatus.identifier)
        updateStatus(currentlyEditedStatus.identifier, { color });
    }
  };

  const handleNewLabelClick = () => {
    setCurrentlyEditedStatus({
      name: '',
      color: defaultColor,
    });
  };

  const handleDragAndDropEnd = useCallback(
    ({ active, over }) => {
      if (active?.id && over?.id)
        dispatch(reorderOrganizationStatuses(active.id, over.id));
    },
    [dispatch],
  );

  const numberOfElements =
    (statuses?.length || 0) +
    1 +
    (isAddingNewStatus || newStatusButtonVisible ? 1 : 0);

  return (
    <StatusListWrapper>
      <DndContext sensors={sensors} onDragEnd={handleDragAndDropEnd}>
        <SortableContext
          items={pluck('identifier', statuses)}
          strategy={rectSortingStrategy}
        >
          <StatusList elementsCount={numberOfElements}>
            <EditableWorkflowStatusItem
              disabled
              status={RESET_STATUS}
              colorBorder
            />
            {statuses?.map(status => {
              const displayedStatus =
                status.identifier === currentlyEditedStatus?.identifier
                  ? currentlyEditedStatus
                  : status;

              return (
                <SortableItem
                  key={status.identifier}
                  itemId={status.identifier}
                  overflowHidden
                >
                  {({ dragHandleProps }) => (
                    <EditableWorkflowStatusItem
                      isEditing={
                        currentlyEditedStatus &&
                        status.identifier === currentlyEditedStatus.identifier
                      }
                      status={displayedStatus}
                      dragHandleProps={dragHandleProps}
                      disabled={!statuses || statuses.length === 0}
                      onEditStart={() =>
                        setCurrentlyEditedStatus({ ...status })
                      }
                      onInputChange={handleInputChange}
                      onSave={handleSaveStatus}
                      onDelete={() =>
                        dispatch(deleteOrganizationStatus(status.identifier))
                      }
                    />
                  )}
                </SortableItem>
              );
            })}
            {isAddingNewStatus && (
              <EditableWorkflowStatusItem
                isEditing={
                  currentlyEditedStatus && !currentlyEditedStatus.identifier
                }
                status={currentlyEditedStatus}
                deleteDisabled
                onInputChange={handleInputChange}
                onSave={handleSaveStatus}
              />
            )}
            {newStatusButtonVisible && (
              <NewStatusButtonWrapper>
                <NewStatusButton type="button" onClick={handleNewLabelClick}>
                  New Label
                </NewStatusButton>
              </NewStatusButtonWrapper>
            )}
          </StatusList>
        </SortableContext>
      </DndContext>
      <Divider />
      <ColorPickerWrapper>
        {Object.values(StatusColor).map(color => (
          <ColorButton
            key={color}
            color={color}
            onClick={() => handlePickColor(color)}
            selected={
              currentlyEditedStatus
                ? currentlyEditedStatus.color === color
                : color === defaultColor
            }
          />
        ))}
      </ColorPickerWrapper>
      <Divider />
      <PopoverBottomBar>
        <PopoverBottomBar.Button onClick={onClose}>
          Close
        </PopoverBottomBar.Button>
      </PopoverBottomBar>
    </StatusListWrapper>
  );
};

export default StatusEditor;
