import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TaskTemplate from '../../task-template/TaskTemplate/TaskTemplate';
import moment from 'moment';
import TaskTemplateHeader from '../../task-template/TaskTemplateHeader/TaskTemplateHeader';
import {
  isFetchingTaskTemplatesSelector,
  taskTemplatesSelector,
} from '@/app/selectors/task-template-selectors';
import { useDispatch, useSelector } from 'react-redux';
import TaskTemplateFolder from '../../task-template/TaskTemplateFolder/TaskTemplateFolder';
import { useHistory } from 'react-router-dom';
import * as TaskTemplateActions from 'actions/task-template-actions';
import {
  WorkspaceWorkflowLibraryContainer,
  WorkspaceWorkflowLibraryContent,
  WorkspaceEntityWrapper,
} from './styled';
import TaskTemplatesLoader from '../../task-template/TaskTemplatesLoader/TaskTemplatesLoader';
import AddButton, {
  AddEntitiesContainer,
} from '@/app/components/common/AddButton/AddButton';
import { Spacing } from '@/app/components/navigation/NavigationSidebar/SubMenuComponents/styled';
import TasksTemplatesHeader from '@/app/components/tasklist/TasksTemplatesHeader/TasksTemplatesHeader';
import {
  selectedUserOrganizationSelector,
  userHasShareTaskWorkflowFeatureSelector,
} from '@/app/selectors/user-selectors';
import { workspaceSelector } from '@/app/selectors/workspace-selectors';
import { extractFolderIdentifier } from '../helper';
import WorkspaceTemplateBreadcrumbs from '../WorkspaceTemplateBreadcrumbs/WorkspaceTemplateBreadcrumbs';
import { WorkspaceTemplate } from '@/app/types/workspace';

const WorkspaceWorkflowLibrary = () => {
  const workspace = useSelector(workspaceSelector);
  const workspaceIdentifier = workspace.workspaceIdentifier;
  const url = window.location.href;

  const folderIdentifier = useMemo(() => {
    return extractFolderIdentifier(url);
  }, [url]);

  const history = useHistory();
  const dispatch = useDispatch();
  const isFetchingTaskTemplates = useSelector(isFetchingTaskTemplatesSelector);
  const taskTemplates = useSelector(taskTemplatesSelector);
  const templates = useMemo(
    () =>
      taskTemplates?.filter((template: WorkspaceTemplate) => template.templateType !== 'FOLDER') ||
      [],
    [taskTemplates],
  );
  const folders = useMemo(
    () =>
      taskTemplates?.filter((template: WorkspaceTemplate) => template.templateType === 'FOLDER') ||
      [],
    [taskTemplates],
  );

  console.log(templates);

  useEffect(() => {
    dispatch(
      TaskTemplateActions.initializeWorkflowLibraryState(folderIdentifier),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderIdentifier]);

  useEffect(() => {
    return () => {
      dispatch(TaskTemplateActions.clearWorkflowLibraryState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoToFolder = useCallback(
    (id: string) => {
      const url = `/core/workspace/${workspaceIdentifier}/workflowLibrary/${id}`;
      console.log(url);
      history.push(url);
    },
    [history],
  );

  const handleCreateTemplate = useCallback(() => {
    console.log('create template');
  }, []);

  const handleCreateSmartFlow = useCallback(() => {
    console.log('create smartflow');
  }, []);

  const handleCreateTemplateFolder = useCallback(() => {
    console.log('create template folder');
  }, []);

  const [sort, setSort] = useState({
    key: null as any,
    order: null as any,
  });

  const handleSortChange = (key: null, order: any) => {
    setSort({
      key: order ? key : null,
      order,
    });
  };

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const shareTaskWorkflowAvailable = useSelector(
    userHasShareTaskWorkflowFeatureSelector,
  );
  const iconColorActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }: { name: string }) => name === 'icon.active.color',
    ) || {};

  const tasksHeaderTextTransformItem =
    currentOrganization?.themeSettings?.find(
      ({ name }: { name: string }) => name === 'tasks.header.textTransform',
    ) || {};

  const tasksHeaderTextColorItem =
    currentOrganization?.themeSettings?.find(
      ({ name }: { name: string }) => name === 'tasks.header.textColor',
    ) || {};

  return (
    <>
      <WorkspaceWorkflowLibraryContainer>
        <WorkspaceWorkflowLibraryContent>
          <WorkspaceEntityWrapper>
            <WorkspaceTemplateBreadcrumbs />
            <AddEntitiesContainer style={{ flex: 1 }}>
              <AddButton onClick={handleCreateTemplate} buttonRef={null}>
                Add Workflow
              </AddButton>
              <AddButton onClick={handleCreateSmartFlow} buttonRef={null}>
                Add SmartFlow
              </AddButton>
              <AddButton onClick={handleCreateTemplateFolder} buttonRef={null}>
                Add Folder
              </AddButton>
            </AddEntitiesContainer>
          </WorkspaceEntityWrapper>
          {/* @ts-ignore */}
          <Spacing vertical={4} />
          <TasksTemplatesHeader
            sort={sort}
            onSortChange={handleSortChange}
            tasksHeaderTextTransform={tasksHeaderTextTransformItem?.value}
            tasksHeaderTextColor={tasksHeaderTextColorItem?.value}
            shareTaskWorkflowAvailable={shareTaskWorkflowAvailable}
          />
          {isFetchingTaskTemplates ? (
            <TaskTemplatesLoader />
          ) : (
            <>
              {folders.map((template: WorkspaceTemplate) => (
                <TaskTemplateFolder
                  highlighted={false}
                  key={template.identifier}
                  template={template}
                  onClick={() => handleGoToFolder(template.identifier)}
                >
                  <TaskTemplateHeader
                    createdBy={template.creator.userName}
                    createdDate={moment(template.createdDateTime).format(
                      'MM/DD/YYYY',
                    )}
                    taskTemplate={template}
                    shareTaskWorkflowAvailable={shareTaskWorkflowAvailable}
                  />
                </TaskTemplateFolder>
              ))}
              {templates.map((template: WorkspaceTemplate) => (
                <TaskTemplate
                  highlighted={false}
                  key={template.identifier}
                  template={template}
                  isFullView={true}
                  iconColorActive={iconColorActiveItem?.value}
                >
                  <TaskTemplateHeader
                    createdBy={template.creator.userName}
                    createdDate={moment(template.createdDateTime).format(
                      'MM/DD/YYYY',
                    )}
                    taskTemplate={template}
                    shareTaskWorkflowAvailable={shareTaskWorkflowAvailable}
                  />
                </TaskTemplate>
              ))}
            </>
          )}
        </WorkspaceWorkflowLibraryContent>
      </WorkspaceWorkflowLibraryContainer>
    </>
  );
};

export default WorkspaceWorkflowLibrary;
