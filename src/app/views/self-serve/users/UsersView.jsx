import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import { selectedUserOrganizationSelector, userProfileSelector } from 'selectors/user-selectors';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import UsersTable from './UsersTable/UsersTable';
import { BulkEditSectionContainer, TaskTemplateApplicatorContainer, UsersViewContainer, UsersViewOuterContainer } from './styled';
import LayoutHeader from '@/app/components/template/LayoutHeader/LayoutHeader';
import OptionsMenu from '@/app/components/common/OptionsMenu/OptionsMenu';
import { Box, Dialog } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import ImportDataModal from '@/app/modal/components/ImportDataModal/ImportDataModal';
import { bulkInviteUser, downloadUserInviteTemplate } from '@/app/api/organization-api';
import BulkEditSection from './BulkEditSection/BulkEditSection';
import { UserEditContext } from '@/app/context-api/user-edit-context';
import BulkEditCreateTask from './BulkEditSection/BulkEditCreateTask';
import TaskTemplateApplicator from '@/app/components/task-template/TaskTemplateApplicator/TaskTemplateApplicator';
import * as UsersActions from 'actions/user-actions';
import { openModal } from '@/app/modal/actions';
import { getTaskListForUser } from '@/app/api/task-list-api';

const UsersView = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const currentUser = useSelector(userProfileSelector);

  const isOwnerOrAdmin = checkIfUserIsOrganizationAdmin(currentUser);

  const [importPopupOpen, setImportPopupOpen] = useState(false);

  const {
    selectedOptions,
    unselectAllUser,
    selectableUsers,
    selectedOptionsHandler,
  } = useContext(UserEditContext);
  
  const { createTaskOption, createWorkflowOption } = selectedOptions;
  const { turnOffAllOptions } = selectedOptionsHandler;  

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const iconColorActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.color',
    ) || {};

  useEffect(() => {
    if (!checkIfUserIsOrganizationAdmin(currentUser)) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleTemplateSelect = useCallback(
    (template) => {
      const assignedEntities = selectableUsers?.filter(item => item.isSelected).map(item => item.identifier);
      dispatch(
        openModal('ListPicker', {
          enableSelectingGroupStep: true,
          fetchMethod: getTaskListForUser,
          confirm: (listId, taskGroupIdentifier) =>
            dispatch(
              UsersActions.userBulkCreateWorkflow({
                workflowIdentifier: template.identifier,
                taskListIdentifier: listId,
                assignedToUsers: assignedEntities,
                taskGroupIdentifier,
              }),
            ),
        }),
      );

      unselectAllUser();
      turnOffAllOptions();
    },
    [dispatch, selectableUsers],
  );

  return (
    <>
      <ViewLayout
        header={
          <LayoutHeader>
            <Box
              position="absolute"
              top={27}
              left={10}
            >
              <OptionsMenu
                disablePortal
                options={[
                  isOwnerOrAdmin &&
                    {
                      name: 'Bulk Invite Users',
                      onClick: () => {
                        setImportPopupOpen(true);
                      },
                    }
                ]}
              >
                <MoreVert color="primary" />
              </OptionsMenu>
            </Box>
            <LayoutHeader.Title title="Users" />
          </LayoutHeader>
        }
      >
        <UsersViewOuterContainer>
          <UsersViewContainer>
            <UsersTable />
          </UsersViewContainer>
        </UsersViewOuterContainer>
      </ViewLayout>
      <BulkEditSection>
        <BulkEditSectionContainer>
          {createTaskOption && (
            <BulkEditCreateTask
              iconColorActive={iconColorActiveItem?.value}
              context={UserEditContext}
              createTaskAction={UsersActions.userBulkCreateTask}
            />
          )}
          {createWorkflowOption && (
            <TaskTemplateApplicatorContainer>
              <TaskTemplateApplicator
                onTemplateSelect={handleTemplateSelect}
                bulkApply
                iconColorActive={iconColorActiveItem?.value}
              />
            </TaskTemplateApplicatorContainer>
          )}
        </BulkEditSectionContainer>
      </BulkEditSection>
      <Dialog
        open={importPopupOpen}
        onClose={() => setImportPopupOpen(false)}
        PaperProps={{
          elevation: 0,
          square: true,
          style: {},
        }}
      >
        <ImportDataModal
          closeModal={() => {
            setImportPopupOpen(false);
          }}
          downloadTemplate={downloadUserInviteTemplate}
          step={1}
          label="user"
          uploadFunction={bulkInviteUser}
        />
      </Dialog>
  </>
  );
};

export default UsersView;
