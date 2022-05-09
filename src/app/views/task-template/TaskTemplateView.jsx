/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { openModal } from 'modal/actions';
import { ColumnsConfigProvider } from 'context-api/columns-config-context';
import { TaskItemColumn } from 'helpers/task-helpers';
import * as TaskTemplateActions from 'actions/task-template-actions';
import {
  taskTemplatesSelector,
  isFetchingTaskTemplatesSelector,
} from 'selectors/task-template-selectors';
import {
  userProfileSelector,
  userHasSmartFlowsSelector,
} from 'selectors/user-selectors';
import AddButton from 'components/common/AddButton/AddButton';
import Spacing from 'components/common/Spacing';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import ViewTypeSwitch, {
  ViewType,
} from 'components/tasklist/ViewTypeSwitch/ViewTypeSwitch';
import { BulkEditOptionsConfig } from 'helpers/bulk-edit-helpers';
import localStorageHelper from 'helpers/local-storage-helper';
import TasksTemplatesHeader from 'components/tasklist/TasksTemplatesHeader/TasksTemplatesHeader';
import {
  TEMPLATE_TASK_ITEM_SORT_METHODS,
  TEMPLATE_TASK_ITEM_SORT_DESC_METHODS,
} from 'helpers/workflow-helpers';
import { compose, identity, differenceWith, eqBy, prop } from 'ramda';
import { SortOrderType } from 'helpers/sorting-helper';
import moment from 'moment';
import { createWorkflowFolderPath } from 'routing/helpers/paths';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import Search from 'components/task-view/Search/Search';
import debounce from 'lodash.debounce';
import usePrevious from 'hooks/use-previous';
import UpgradePlanPopup from 'components/common/UpgradePlanPopup/UpgradePlanPopup';
import SmartFlowsIcon from 'img/premium/smartflows';
import {
  TaskTemplateViewContainer,
  SearchWrapper,
  SearchAndFilterContainer,
  UpgradePlanPopupHeader,
  // PremiumBadgeContainer,
} from './styled';
import TaskTemplate from './TaskTemplate/TaskTemplate';
import TaskTemplatesLoader from './TaskTemplatesLoader/TaskTemplatesLoader';
import TaskTemplateBanner from './TaskTemplateBanner/TaskTemplateBanner';
import TaskTemplateBulkEditContainer from './TaskTemplateBulkEditContainer/TaskTemplateBulkEditContainer';
import TaskTemplateHeader from './TaskTemplateHeader/TaskTemplateHeader';
import TaskTemplateFolder from './TaskTemplateFolder/TaskTemplateFolder';
import TemplateBreadcrumbs from './TaskTemplateBreadcrumb/TaskTemplateBreadcrumbs';

const BULK_EDIT_OPTIONS_CONFIG = {
  [BulkEditOptionsConfig.MOVE_OPTION]: false,
  [BulkEditOptionsConfig.COMPLETE_OPTION]: false,
  [BulkEditOptionsConfig.DUE_DATE_OPTION]: false,
};

const TASK_TEMPLATES_BANNER_CLOSED_STORAGE_KEY =
  'TASK_TEMPLATES_BANNER_CLOSED_STORAGE_KEY';

const TaskTemplateView = () => {
  const { identifier: folderIdentifier } = useParams();
  const [openUpgradePopup, setOpenUpgradePopup] = useState(false);
  const dispatch = useDispatch();
  const addSmartflowButtonReference = useRef(null);
  const history = useHistory();
  const [viewType, setViewType] = useState(ViewType.SLIM_VIEW);
  const [sort, setSort] = useState({});
  const [searchPhrase, setSearchPhrase] = useState('');
  const [isSearchFocused, setSearchFocused] = useState(false);
  const [isBannerOpen, setIsBannerOpen] = useState(
    !localStorageHelper.getItem(TASK_TEMPLATES_BANNER_CLOSED_STORAGE_KEY),
  );
  const smartFlowAvailable = useSelector(userHasSmartFlowsSelector);
  const isFetchingTaskTemplates = useSelector(isFetchingTaskTemplatesSelector);
  const taskTemplates = useSelector(taskTemplatesSelector);
  const userProfile = useSelector(userProfileSelector);
  const folders = useMemo(
    () =>
      taskTemplates?.filter(template => template.templateType === 'FOLDER') ||
      [],
    [taskTemplates],
  );
  const templates = useMemo(
    () =>
      taskTemplates?.filter(template => template.templateType !== 'FOLDER') ||
      [],
    [taskTemplates],
  );
  const previousFolders = usePrevious(folders);
  const previousTemplates = usePrevious(templates);

  const newlyCreatedTemplateId = useMemo(() => {
    const current = [...folders, ...templates];
    const previous = [...(previousFolders || []), ...(previousTemplates || [])];
    if (Math.abs(previous.length - current.length) > 1) return false;
    return differenceWith(eqBy(prop('identifier')), current, previous)?.[0]
      ?.identifier;
  }, [folders, previousFolders, previousTemplates, templates]);

  useEffect(() => {
    if (userProfile?.orgUserRole === 'GUEST') {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  const handleCreateTemplate = useCallback(() => {
    dispatch(openModal('CreateTemplate'));
  }, [dispatch]);

  const handleCreateTemplateFolder = useCallback(() => {
    dispatch(openModal('CreateTemplateFolder'));
  }, [dispatch]);

  const handleCreateSmartFlow = useCallback(() => {
    if (smartFlowAvailable) {
      dispatch(openModal('CreateSmartFlow'));
    } else {
      setOpenUpgradePopup(true);
    }
  }, [dispatch, smartFlowAvailable]);

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

  const handleSortChange = (key, order) => {
    setSort({
      key: order ? key : null,
      order,
    });
  };

  const currentSortMethod = useMemo(() => {
    if (!sort.key) return identity;
    return TEMPLATE_TASK_ITEM_SORT_METHODS[sort.key];
  }, [sort.key]);

  const currentSortDescMethod = useMemo(() => {
    if (!sort.key) return identity;
    return TEMPLATE_TASK_ITEM_SORT_DESC_METHODS[sort.key];
  }, [sort.key]);

  const currentSortMethodWithOrder = useMemo(() => {
    if (sort.order === SortOrderType.DESC) {
      return currentSortDescMethod;
    }
    return currentSortMethod;
  }, [sort.order, currentSortMethod, currentSortDescMethod]);

  const handleGoToFolder = useCallback(
    id => {
      history.push(createWorkflowFolderPath(id));
    },
    [history],
  );

  const debouncedGetTemplate = useCallback(
    debounce(compose(dispatch, TaskTemplateActions.getWorkflowFolder), 500),
    [],
  );

  const onSearchHandle = event => {
    const searchPhraseValue = event.target.value;
    setSearchPhrase(searchPhraseValue);
    if (searchPhraseValue.length !== 1) {
      debouncedGetTemplate(searchPhraseValue);
    }
  };

  return (
    <ColumnsConfigProvider
      initialColumns={{
        [TaskItemColumn.DESCRIPTION]: true,
        [TaskItemColumn.SUBTASKS_COUNT]: true,
        [TaskItemColumn.WORKFLOW_STATUS]: true,
        [TaskItemColumn.ACTIVITY]: true,
        [TaskItemColumn.ASSIGNED]: true,
      }}
      hideCustomColumns
    >
      <ViewLayout header={<BasicLayoutHeader title="Workflow Library" />}>
        <TaskTemplateBulkEditContainer
          optionsConfig={BULK_EDIT_OPTIONS_CONFIG}
          refreshTasks={() =>
            dispatch(TaskTemplateActions.reloadOpenedTemplateTasks())
          }
        >
          <TaskTemplateViewContainer>
            {isBannerOpen && (
              <>
                <TaskTemplateBanner
                  firstTemplate={taskTemplates?.length <= 2}
                  onCreateTemplate={handleCreateTemplate}
                  onClose={() => {
                    setIsBannerOpen(false);
                    localStorageHelper.setItem(
                      TASK_TEMPLATES_BANNER_CLOSED_STORAGE_KEY,
                      true,
                    );
                  }}
                />
                <Spacing vertical={4} />
              </>
            )}
            <TemplateBreadcrumbs />
            <Spacing vertical={4} />
            <SearchAndFilterContainer>
              <SearchWrapper fullWidth={isSearchFocused}>
                {!folderIdentifier && (
                  <Search
                    fullWidth
                    noBackground
                    value={searchPhrase}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    onChange={onSearchHandle}
                    placeholder={
                      isSearchFocused
                        ? 'Search Workflows and Folders'
                        : 'Search'
                    }
                  />
                )}
              </SearchWrapper>
              <Grid container justify="flex-end" alignItems="center">
                <AddButton onClick={handleCreateTemplate}>
                  Add Workflow
                </AddButton>
                <AddButton
                  onClick={handleCreateSmartFlow}
                  buttonRef={addSmartflowButtonReference}
                >
                  Add SmartFlow
                </AddButton>
                <AddButton onClick={handleCreateTemplateFolder}>
                  Add Folder
                </AddButton>
                <ViewTypeSwitch value={viewType} onChange={setViewType} />
              </Grid>
            </SearchAndFilterContainer>
            <Spacing vertical={4} />
            <TasksTemplatesHeader sort={sort} onSortChange={handleSortChange} />
            {!isFetchingTaskTemplates ? (
              <>
                {currentSortMethodWithOrder(folders).map(template => (
                  <TaskTemplateFolder
                    highlighted={newlyCreatedTemplateId === template.identifier}
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
                    />
                  </TaskTemplateFolder>
                ))}
                {currentSortMethodWithOrder(templates).map(template => (
                  <TaskTemplate
                    highlighted={newlyCreatedTemplateId === template.identifier}
                    key={template.identifier}
                    template={template}
                    isFullView={viewType === ViewType.FULL_VIEW}
                  >
                    <TaskTemplateHeader
                      createdBy={template.creator.userName}
                      createdDate={moment(template.createdDateTime).format(
                        'MM/DD/YYYY',
                      )}
                      taskTemplate={template}
                    />
                  </TaskTemplate>
                ))}
              </>
            ) : (
              <TaskTemplatesLoader />
            )}
            <TaskDrawer />
          </TaskTemplateViewContainer>
        </TaskTemplateBulkEditContainer>
        <UpgradePlanPopup
          header={
            <UpgradePlanPopupHeader>
              SmartFlows
              {/* <Spacing horizontal={4} /> */}
              {/* <PremiumBadgeContainer>Premium Feature</PremiumBadgeContainer> */}
            </UpgradePlanPopupHeader>
          }
          anchorEl={addSmartflowButtonReference.current}
          open={openUpgradePopup}
          onClose={() => setOpenUpgradePopup(false)}
          title="Add SmartFlows"
          description="Automate your tedious, recurring tasks with Dock Premium SmartFlows."
          iconImage={<img src={SmartFlowsIcon} alt="SmartFlows" />}
        />
      </ViewLayout>
    </ColumnsConfigProvider>
  );
};

export default TaskTemplateView;
