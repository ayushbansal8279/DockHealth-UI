/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { openModal } from 'modal/actions';
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
import {
  BULK_EDIT_COMPLETE_OPTION,
  BULK_EDIT_DUE_DATE_OPTION,
  BULK_EDIT_MOVE_OPTION,
} from 'components/tasklist/BulkEditSection/helpers';
import localStorageHelper from 'helpers/local-storage-helper';
import TasksTemplatesHeader from 'components/tasklist/TasksTemplatesHeader/TasksTemplatesHeader';
import {
  goToTaskTemplateFolder,
  getTemplates,
  cleanAndPushToBreadcrumbs,
  cleanBreadcrumbs,
} from 'actions/task-template-actions';
import {
  TEMPLATE_TASK_ITEM_SORT_METHODS,
  TEMPLATE_TASK_ITEM_SORT_DESC_METHODS,
} from 'helpers/template-helpers';
import { compose, identity, differenceWith, eqBy, prop } from 'ramda';
import { SortOrderType } from 'helpers/sorting-helper';
import moment from 'moment';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import Search from 'components/task-view/Search/Search';
import debounce from 'lodash.debounce';
import usePrevious from 'hooks/use-previous';
import UpgradePlanPopup from 'components/common/UpgradePlanPopup/UpgradePlanPopup';
import {
  TaskTemplateViewContainer,
  SearchWrapper,
  SearchAndFilterContainer,
  UpgradePlanPopupHeader,
  PremiumBadgeContainer,
} from './styled';
import TaskTemplate from './TaskTemplate/TaskTemplate';
import TaskTemplatesLoader from './TaskTemplatesLoader/TaskTemplatesLoader';
import TaskTemplateBanner from './TaskTemplateBanner/TaskTemplateBanner';
import TaskTemplateBulkEditContainer from './TaskTemplateBulkEditContainer/TaskTemplateBulkEditContainer';
import TaskTemplateHeader from './TaskTemplateHeader/TaskTemplateHeader';
import TaskTemplateFolder from './TaskTemplateFolder/TaskTemplateFolder';
import TemplateBreadcrumbs from './TaskTemplateBreadcrumbs';

const BULK_EDIT_OPTIONS_CONFIG = {
  [BULK_EDIT_MOVE_OPTION]: false,
  [BULK_EDIT_COMPLETE_OPTION]: false,
  [BULK_EDIT_DUE_DATE_OPTION]: false,
};

const TASK_TEMPLATES_BANNER_CLOSED_STORAGE_KEY =
  'TASK_TEMPLATES_BANNER_CLOSED_STORAGE_KEY';

const TaskTemplateView = () => {
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
    () => taskTemplates.filter(template => template.type === 'FOLDER'),
    [taskTemplates],
  );
  const templates = useMemo(
    () => taskTemplates.filter(template => template.type !== 'FOLDER'),
    [taskTemplates],
  );

  const previousFolders = usePrevious(folders);
  const previousTemplates = usePrevious(templates);

  const newlyCreatedTemplateId = useMemo(() => {
    const current = [...folders, ...templates];
    const previous = [...(previousFolders || []), ...(previousTemplates || [])];
    if (Math.abs(previous.length - current.length) > 1) return false;
    return differenceWith(
      eqBy(prop('taskTemplateIdentifier')),
      current,
      previous,
    )?.[0]?.taskTemplateIdentifier;
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

  function resetSort() {
    setSort({
      key: null,
      order: null,
    });
  }

  const handleBreadcrumbsRootClick = useCallback(() => {
    resetSort();
    dispatch(getTemplates())();
  }, [dispatch]);

  const handleBreadcrumbsChildClick = useCallback(
    (listBeforeClicked, clickedBreadcrumb) => {
      resetSort();
      dispatch(cleanAndPushToBreadcrumbs(listBeforeClicked));
      dispatch(
        goToTaskTemplateFolder(clickedBreadcrumb.taskTemplateFolderIdentifier),
      );
    },
    [dispatch],
  );

  const handleGoToFolder = useCallback(
    (taskTemplateIdentifier, name) => {
      dispatch(goToTaskTemplateFolder(taskTemplateIdentifier));
      dispatch(
        TaskTemplateActions.pushToBreadcrumbs(name, taskTemplateIdentifier),
      );
      resetSort();
    },
    [dispatch],
  );

  const debouncedGetTemplate = useCallback(
    debounce(compose(dispatch, getTemplates), 500),
    [],
  );

  const onSearchHandle = event => {
    const searchPhraseValue = event.target.value;
    setSearchPhrase(searchPhraseValue);
    if (searchPhraseValue.length !== 1) {
      debouncedGetTemplate(searchPhraseValue);
      dispatch(cleanBreadcrumbs());
    }
  };

  return (
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
          <TemplateBreadcrumbs
            onRootClick={handleBreadcrumbsRootClick}
            onChildClick={handleBreadcrumbsChildClick}
          />
          <Spacing vertical={4} />
          <SearchAndFilterContainer>
            <SearchWrapper fullWidth={isSearchFocused}>
              <Search
                fullWidth
                noBackground
                value={searchPhrase}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                onChange={onSearchHandle}
                placeholder={
                  isSearchFocused ? 'Search Workflows and Folders' : 'Search'
                }
              />
            </SearchWrapper>
            <Grid container justify="flex-end" alignItems="center">
              <AddButton onClick={handleCreateTemplate}>Add Workflow</AddButton>
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
                  highlighted={
                    newlyCreatedTemplateId === template.taskTemplateIdentifier
                  }
                  key={template.taskTemplateIdentifier}
                  template={template}
                  onClick={() =>
                    handleGoToFolder(
                      template.taskTemplateIdentifier,
                      template.name,
                    )
                  }
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
                  highlighted={
                    newlyCreatedTemplateId === template.taskTemplateIdentifier
                  }
                  key={template.taskTemplateIdentifier}
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
            Smartflows
            <Spacing horizontal={4} />
            <PremiumBadgeContainer>Premium Feature</PremiumBadgeContainer>
          </UpgradePlanPopupHeader>
        }
        anchorEl={addSmartflowButtonReference.current}
        open={openUpgradePopup}
        onClose={() => setOpenUpgradePopup(false)}
        title="Add smartflows"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
    </ViewLayout>
  );
};

export default TaskTemplateView;
