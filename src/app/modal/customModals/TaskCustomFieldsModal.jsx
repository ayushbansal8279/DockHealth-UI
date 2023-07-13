import React, { useCallback, useState } from 'react';
import TaskCustomFieldsView from 'views/custom-fields/TaskCustomFieldsView';
import { Box, Tabs, Tab } from '@mui/material';
import {
  ListModalWrapper,
  Header,
  Title,
  CloseIconButton,
  CloseIcon,
  CustomModal,
  Body,
} from './styled';

const TaskCustomFieldsModal = ({
  taskListIdentifier,
  opened,
  handleClose,
  isListAdmin,
  isOrganizationAdmin,
}) => {
  const hasMainListEditPermission = isOrganizationAdmin;
  const hasSpecificListEditPermission = isOrganizationAdmin || isListAdmin;
  const [selectedTab, setSelectedTab] = useState(1);
  const applyProps = useCallback((index) => {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }, []);
  return (
    <CustomModal disableEnforceFocus open={opened} onClose={handleClose}>
      <ListModalWrapper>
        <CloseIconButton onClick={handleClose} size="small" color="secondary">
          <CloseIcon />
        </CloseIconButton>
        <Header>
          <Title>Task Settings</Title>
        </Header>
        <Body>
          <Tabs
            value={selectedTab}
            onChange={(event, index) => setSelectedTab(index)}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
          >
            <Tab label="Org-level Fields" {...applyProps(0)} />
            <Tab label="List-level Fields" {...applyProps(1)} />
          </Tabs>
          <Box p={1} />
          {selectedTab === 0 && (
            <TaskCustomFieldsView editable={hasMainListEditPermission} />
          )}
          {selectedTab === 1 && (
            <TaskCustomFieldsView
              taskListIdentifier={taskListIdentifier}
              editable={hasSpecificListEditPermission}
            />
          )}
        </Body>
      </ListModalWrapper>
    </CustomModal>
  );
};

export default TaskCustomFieldsModal;
