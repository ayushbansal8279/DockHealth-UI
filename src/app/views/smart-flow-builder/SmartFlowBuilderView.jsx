/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { useParams, Link, useHistory, useLocation } from 'react-router-dom';
import compose from 'ramda/src/compose';
import isNil from 'ramda/src/isNil';
import not from 'ramda/src/not';
import path from 'ramda/src/path';
import { useDispatch, useSelector } from 'react-redux';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HardDependencyIcon from 'img/template/hard-dependency';
import CalendarIcon from 'img/template/calendar-icon';
import WorkflowLinkIcon from 'img/template/workflow-icon';
import * as ModalActions from 'modal/actions';
import {
  createWorkflowFolderPath,
  WORKFLOW_LIBRARY_PATH,
} from 'routing/helpers/paths';
import { changeTaskIntentType, updateTasksLink } from 'actions/task-actions';
import { openModal } from 'modal/actions';
import {
  addDecisionBranch,
  addNewDecisionTaskElement,
  addNewNestedFlowElement,
  addNewTaskElement,
  editTemporaryElement,
  linkTasks,
  saveTaskTemplateLayout,
  saveTaskTemplateLayoutToHistory,
  undoTaskTemplateLayout,
  selectTaskTemplate,
  unselectTaskTemplate,
  addNewAutomationTaskElement,
} from 'actions/task-template-actions';
import {
  taskTemplateDetailsSelector,
  currentTaskTemplateSelector,
} from 'selectors/task-template-selectors';
import {
  userHasSmartFlowsSelector,
  userProfileSelector,
} from 'selectors/user-selectors';
import { openDrawer } from 'actions/workflow-drawer-actions';
import { Box, ClickAwayListener, Paper, Popper } from '@mui/material';
import DecisionTaskElementIcon from 'img/template/decision-task-icon';
import Tooltip from 'components/common/Tooltip/Tooltip';
import {
  Controls,
  Position,
  ReactFlowProvider,
  MarkerType,
  useNodesInitialized,
  useReactFlow,
} from 'reactflow';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import {
  NodeType,
  LinkType,
  TASK_NODE_WIDTH,
  getAutoLayout,
} from 'helpers/smart-flow-builder-helpers';
import { TaskOrigin } from 'helpers/task-helpers';
import { useBoolean } from 'hooks/useBoolean';
import palette from 'styles/palette';
import * as AlertActions from 'alert/actions';
import EditIcon from '@mui/icons-material/Edit';
import ReactFlowAdapter from 'views/smart-flow-builder/ReactFlowAdapter';
import NewTaskNode from './NewTaskNode/NewTaskNode';
import TaskNode from './TaskNode/TaskNode';
import TaskLink from './TaskLink/TaskLink';
import DecisionTaskLink from './DecisionTaskLink/DecisionTaskLink';
import TemporaryTaskLink from './TemporaryTaskLink/TemporaryTaskLink';
import {
  mapLayoutToElements,
  mapElementsToLayout,
  updateNodePosition,
  calculateNewElementPosition,
  countEndIndicatorInitialPosition,
  countStartIndicatorInitialPosition,
} from './helpers';
import {
  ElementsSidebar,
  SidebarTitle,
  ElementButton,
  ElementIconBackground,
  ElementDescription,
  TaskElementIcon,
  BuilderHeader,
  BuilderHeaderText,
  SidebarDivider,
  AutoAlignButton,
  EditIconWrapper,
  AutomationTaskIcon,
} from './styled';
import TaskLinkDelayForm from './TaskLinkDelayForm/TaskLinkDelayForm';
import TemporaryDecisionTaskLink from './TemporaryDecisionTaskLink/TemporaryDecisionTaskLink';
import BulkEditContainer from './BulkEditContainer/BulkEditContainer';
import Hotkeys from './Hotkeys/Hotkeys';
import NestedFlowNode from './NestedFlow/NestedFlowNode/NestedFlowNode';
import NewNestedFlowNode from './NestedFlow/NewNestedFlowNode/NewNestedFlowNode';
import { isUserDockPro } from '@/app/helpers/user-helper';
import IndicatorNode from './IndicatorNode/IndicatorNode';
import ConnectionLineComponent from './ConnectionLineComponent/ConnectionLineComponent';

const nodeTypes = {
  [NodeType.NEW_AUTOMATION]: NewTaskNode,
  [NodeType.NEW_STANDARD]: NewTaskNode,
  [NodeType.NEW_DECISION]: NewTaskNode,
  [NodeType.STANDARD]: TaskNode,
  [NodeType.DECISION]: TaskNode,
  [NodeType.NEW_WORKFLOW_LINK]: NewNestedFlowNode,
  [NodeType.WORKFLOW_LINK]: NestedFlowNode,
  [NodeType.START_INDICATOR]: IndicatorNode,
  [NodeType.END_INDICATOR]: IndicatorNode,
};

const linkTypes = {
  [LinkType.STANDARD]: TaskLink,
  [LinkType.DECISION]: DecisionTaskLink,
  [LinkType.TEMPORARY]: TemporaryTaskLink,
  [LinkType.TEMPORARY_DECISION]: TemporaryDecisionTaskLink,
  [LinkType.INDICATOR]: TaskLink,
};

const DEFAULT_EDGE = {
  type: 'REGULAR',
  style: {
    strokeWidth: 1,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: palette.newBrightBlue,
    width: 24,
    height: 24,
    strokeWidth: 1,
  },
};

const SmartFlowBuilderView = () => {
  const delayPeriodOptionReference = useRef(null);
  const builderWrapperReference = useRef(null);
  const reactFlowInstance = useReactFlow();
  const nodesInitialized = useNodesInitialized({ includeHiddenNodes: false });
  const [reactFlowInitialized, setReactFlowInitialized] = useState(false);
  const [elements, setElements] = useState([]);
  const [draggedEdgeSourceId, setDraggedEdgeSourceId] = useState(null);
  const [, setHoveredTargetHandle] = useState(Position.Top);
  const [isDelayPopoverOpen, openDelayPopover, closeDelayPopover] =
    useBoolean(false);
  const { identifier } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const { tasks, layout, temporaryElements } =
    useSelector(taskTemplateDetailsSelector(identifier)) || {};
  const workflow = useSelector(currentTaskTemplateSelector);
  const { name, templateType, parentTaskWorkflowIdentifier, members } =
    workflow || {};
  const smartFlowsAvailable = useSelector(userHasSmartFlowsSelector);

  const currentUser = useSelector(userProfileSelector);
  const isDockProUser = isUserDockPro(currentUser);
  const isCurrentUserEditor =
    members?.find(({ user }) => user.identifier === currentUser.identifier)
      ?.memberPermission === 'EDITOR' && !workflow?.sharedByOrganization;

  const selectedElements = useMemo(
    () => elements.filter((element) => element.selected),
    [elements],
  );
  const location = useLocation();

  const [modalUsed, setModalUsed] = useState(false);
  const [initialTasksLength, setInitialTasksLength] = useState(null);

  const constantVisibleElements = useMemo(
    () => [
      {
        id: 'START_INDICATOR',
        position:
          layout?.find(({ id }) => id === 'START_INDICATOR')?.position ||
          countStartIndicatorInitialPosition(layout),
        type: 'INDICATOR',
      },
      {
        id: 'END_INDICATOR',
        position:
          layout?.find(({ id }) => id === 'END_INDICATOR')?.position ||
          countEndIndicatorInitialPosition(layout),
        type: 'INDICATOR',
      },
    ],
    [layout],
  );

  useEffect(() => {
    if (initialTasksLength === null && Array.isArray(tasks)) {
      setInitialTasksLength(tasks.length);
    }
  }, [tasks, initialTasksLength]);

  useEffect(() => {
    if (isCurrentUserEditor && initialTasksLength > 0 && !modalUsed) {
      dispatch(
        ModalActions.openModal('Alert', {
          title: 'Changes May Not Be Applied to Deployed Items',
          description:
            'These changes will not be reflected on deployed workflow tasks. If a task has yet to deploy, the changes will be applied. All changes will be saved and applied to future workflows.',
          confirm: () => {
            dispatch(ModalActions.closeModal());
          },
        }),
      );
      setModalUsed(true);
    }
  }, [dispatch, isCurrentUserEditor, modalUsed, initialTasksLength]);

  useEffect(() => {
    if (smartFlowsAvailable === false && templateType === 'SMARTFLOW') {
      history.push('/');
    }
  }, [smartFlowsAvailable, templateType, history]);

  useEffect(() => {
    dispatch(selectTaskTemplate(identifier));

    return () => {
      dispatch(unselectTaskTemplate());
    };
  }, [dispatch, identifier]);

  useEffect(() => {
    if (tasks && !isNil(layout)) {
      setElements((previousElements) =>
        [
          ...constantVisibleElements,
          ...mapLayoutToElements(layout, tasks),
          ...(temporaryElements || []),
        ].map((element) => ({
          ...Object.fromEntries(
            previousElements.map((previousElement) => [
              previousElement.id,
              previousElement,
            ]),
          )[element.id],
          ...element,
          isConnectable: draggedEdgeSourceId !== element.id,
          data: {
            ...element.data,
            draggedEdgeSourceId,
            taskTemplateIdentifier: identifier,
            onTargetHandleHover: setHoveredTargetHandle,
          },
        })),
      );
    }
  }, [
    draggedEdgeSourceId,
    identifier,
    layout,
    tasks,
    temporaryElements,
    constantVisibleElements,
  ]);

  useEffect(() => {
    if (reactFlowInstance && nodesInitialized && !reactFlowInitialized) {
      reactFlowInstance.fitView();
      setReactFlowInitialized(true);
    }
  }, [reactFlowInstance, nodesInitialized, reactFlowInitialized]);

  const centerViewToElement = (elementPosition) => {
    const { x, y } = elementPosition;
    const { offsetWidth, offsetHeight } = builderWrapperReference.current;

    reactFlowInstance.setTransform({
      x: -x + offsetWidth / 2 - TASK_NODE_WIDTH / 2,
      y: -y + offsetHeight / 2,
      zoom: 1,
    });
  };

  const onConnect = ({ source, sourceHandle, target, targetHandle }) => {
    dispatch(
      linkTasks(
        { id: source, handle: sourceHandle },
        { id: target, handle: targetHandle },
      ),
    );
  };

  const handleMakeSelectionDependent = useCallback(() => {
    if (!selectedElements) return;

    for (const selectedElement of selectedElements.filter((se) =>
      [NodeType.STANDARD, NodeType.DECISION].includes(se.type),
    )) {
      const {
        data: { task },
      } = selectedElement;

      // eslint-disable-next-line no-unused-expressions
      for (const { taskLinks } of tasks?.filter(
        (se) => se.intentType === NodeType.STANDARD,
      )) {
        for (const link of taskLinks) {
          if (link.targetTaskIdentifier === task.identifier) {
            dispatch(
              updateTasksLink({
                ...link,
                isDependent: true,
              }),
            );
          }
        }
      }
    }
  }, [dispatch, selectedElements, tasks]);

  const handleDelayForSubmit = (delayPeriodData) => {
    if (!selectedElements) return;

    for (const selectedElement of selectedElements.filter((se) =>
      [NodeType.STANDARD, NodeType.DECISION].includes(se.type),
    )) {
      const {
        data: { task },
      } = selectedElement;

      // eslint-disable-next-line no-unused-expressions
      for (const { taskLinks } of tasks)
        for (const link of taskLinks) {
          if (link.targetTaskIdentifier === task.identifier) {
            dispatch(
              updateTasksLink({
                ...link,
                isDependent: true,
                ...delayPeriodData,
              }),
            );
          }
        }
    }
    closeDelayPopover();
  };

  const toolkitActions = useMemo(() => {
    const baseActions = [
      {
        id: NodeType.NEW_STANDARD,
        label: 'Task',
        icon: TaskElementIcon,
        onClick: () => {
          const position = calculateNewElementPosition(layout);
          dispatch(addNewTaskElement(position));
          centerViewToElement(position);
        },
      },
      {
        id: NodeType.NEW_AUTOMATION,
        label: 'Automation Task',
        icon: AutomationTaskIcon,
        onClick: () => {
          const position = calculateNewElementPosition(layout);
          dispatch(addNewAutomationTaskElement(position));
          centerViewToElement(position);
        },
      },
      {
        id: NodeType.NEW_DECISION,
        label: 'Decision tree',
        icon: DecisionTaskElementIcon,
        onClick: () => {
          if (
            selectedElements?.length > 0 &&
            selectedElements.some((se) => !!se.data?.task)
          ) {
            for (const selectedElement of selectedElements) {
              const taskLinks = selectedElement?.data.task.taskLinks;
              if (
                taskLinks?.length > 0 &&
                taskLinks.some((link) => link.linkType !== 'START')
              ) {
                dispatch(
                  openModal('Information', {
                    text: 'This task already has linkages to other tasks. If you want to change it to decision tree, please remove existing connections.',
                  }),
                );
              } else {
                const { taskIdentifier } = selectedElement.data.task;
                dispatch(
                  changeTaskIntentType(taskIdentifier, NodeType.DECISION),
                );
                centerViewToElement(selectedElement.position);
              }
            }
          } else {
            const position = calculateNewElementPosition(layout);
            dispatch(addNewDecisionTaskElement(position));
            centerViewToElement(position);
          }
        },
      },
      {
        id: NodeType.NEW_WORKFLOW_LINK,
        label: 'Workflow',
        icon: WorkflowLinkIcon,
        onClick: () => {
          const position = calculateNewElementPosition(layout);
          dispatch(addNewNestedFlowElement(position));
          centerViewToElement(position);
        },
      },
    ].filter(
      (action) => isDockProUser || action.id !== NodeType.NEW_AUTOMATION,
    );

    let actions = [...baseActions];

    const selectedTasks = selectedElements?.filter((se) =>
      [NodeType.STANDARD, NodeType.DECISION].includes(se.type),
    );

    if (selectedTasks?.length > 0) {
      actions = [
        ...actions,
        {
          id: 'DEPENDENCY',
          label: 'Dependency',
          icon: () => <HardDependencyIcon size={18} />,
          onClick: handleMakeSelectionDependent,
        },
        {
          id: 'TIME_TILL_TASK',
          label: 'Add Time Until Task',
          icon: () => <CalendarIcon size={18} />,
          onClick: openDelayPopover,
          ref: delayPeriodOptionReference,
        },
      ];
    }

    if (
      selectedTasks?.length === 1 &&
      selectedTasks[0].data.task &&
      selectedTasks[0].type === NodeType.DECISION
    ) {
      actions = [
        ...actions,
        {
          id: 'ADD_BRANCH',
          label: 'Add branch',
          icon: DecisionTaskElementIcon,
          onClick: () => {
            dispatch(
              addDecisionBranch(selectedTasks[0].data.task.taskIdentifier),
            );
          },
        },
      ];
    }

    return actions;
  }, [
    selectedElements,
    layout,
    dispatch,
    handleMakeSelectionDependent,
    openDelayPopover,
  ]);
  const updateSelectedElementsPosition = (selectedNodes) => {
    let updatedElements = elements;
    let shouldUpdate = false;

    for (const node of selectedNodes) {
      const isIndicator = node?.type === 'INDICATOR';
      const isExistingTask = !!node.data.task;
      if (isExistingTask || isIndicator) {
        if (!shouldUpdate) shouldUpdate = true;
        updatedElements = updateNodePosition(
          node.id,
          node.position,
          updatedElements,
        );
      } else {
        dispatch(
          editTemporaryElement(node.id, {
            position: node.position,
          }),
        );
      }
    }

    if (shouldUpdate) {
      const newLayout = mapElementsToLayout(updatedElements);
      dispatch(saveTaskTemplateLayout(newLayout));
    }
  };

  const handleNodeDragStop = (_, node) => {
    updateSelectedElementsPosition([node]);
  };

  const handleSelectionDragStop = (_, nodes) => {
    updateSelectedElementsPosition(nodes);
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleDragOver = (event) => {
    event.preventDefault();
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds =
      builderWrapperReference.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    switch (type) {
      case NodeType.NEW_STANDARD: {
        dispatch(addNewTaskElement(position));
        break;
      }
      case NodeType.NEW_AUTOMATION: {
        dispatch(addNewAutomationTaskElement(position));
        break;
      }
      case NodeType.NEW_DECISION: {
        dispatch(addNewDecisionTaskElement(position));
        break;
      }
      case NodeType.NEW_WORKFLOW_LINK: {
        dispatch(addNewNestedFlowElement(position));
        break;
      }
      default: {
        // eslint-disable-next-line no-console
        console.error('UNHANDLED NODE TYPE');
        break;
      }
    }
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const resetSelection = () => {
    // resetting selection by creating click event on react flow panel
    const element = document.querySelector('.react-flow__pane');
    // eslint-disable-next-line no-unused-expressions
    element?.click();
  };

  const handleAutoAlignClick = async () => {
    const autoLayout = await getAutoLayout(tasks);
    dispatch(saveTaskTemplateLayoutToHistory());
    dispatch(saveTaskTemplateLayout(autoLayout));
    setTimeout(reactFlowInstance.fitView, 0);
    dispatch(
      AlertActions.showGlobalAlertWithUndo(
        'AUTO ALIGNMENT',
        'UNDO_AUTO_ALIGN',
        () => dispatch(undoTaskTemplateLayout()),
        { preventRequest: true },
      ),
    );
  };

  const selectedTasks = useMemo(
    () =>
      selectedElements
        ?.filter(compose(not, isNil, path(['data', 'task'])))
        ?.map(path(['data', 'task'])),
    [selectedElements],
  );

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <Box position="relative" display="flex" height="100%" width="100%">
        <ElementsSidebar>
          <Box>
            <SidebarTitle>SmartFlow Toolkit</SidebarTitle>
            {isCurrentUserEditor &&
              toolkitActions.map(({ id, label, icon: Icon, ref, onClick }) => (
                <ElementButton
                  key={id}
                  type="button"
                  ref={ref}
                  onClick={onClick}
                  onDragStart={(event) => {
                    event.dataTransfer.setData('application/reactflow', id);
                    // eslint-disable-next-line no-param-reassign
                    event.dataTransfer.effectAllowed = 'move';
                  }}
                  draggable
                >
                  <ElementIconBackground>
                    <Icon />
                  </ElementIconBackground>
                  <ElementDescription>{label}</ElementDescription>
                </ElementButton>
              ))}
            <SidebarDivider />
            {/* {isCurrentUserEditor && (
              <Tooltip title="Auto Align will organize  your layout ">
                <AutoAlignButton type="button" onClick={handleAutoAlignClick}>
                  Auto Align Layout
                </AutoAlignButton>
              </Tooltip>
            )} */}
            {isDelayPopoverOpen && (
              <Popper
                anchorEl={delayPeriodOptionReference.current}
                placement="right"
                open
                style={{ zIndex: 10 }}
              >
                <ClickAwayListener onClickAway={closeDelayPopover}>
                  <Paper>
                    <TaskLinkDelayForm
                      onSubmit={handleDelayForSubmit}
                      onClose={closeDelayPopover}
                    />
                  </Paper>
                </ClickAwayListener>
              </Popper>
            )}
          </Box>
          <Box>
            <Hotkeys />
          </Box>
        </ElementsSidebar>
        <Box ref={builderWrapperReference} position="relative" flex={1}>
          <BuilderHeader>
            <Link
              to={(() => {
                const urlParams = new URLSearchParams(location.search);
                const returnToParam = urlParams.get('returnTo');

                if (returnToParam) {
                  return decodeURIComponent(returnToParam);
                }

                return parentTaskWorkflowIdentifier
                  ? createWorkflowFolderPath(parentTaskWorkflowIdentifier)
                  : WORKFLOW_LIBRARY_PATH;
              })()}
            >
              <BuilderHeaderText color={palette.brightBlue}>
                Workflows
              </BuilderHeaderText>
            </Link>
            <Box px={1}>
              <NavigateNextIcon fontSize="small" />
            </Box>
            <button
              type="button"
              onClick={() => dispatch(openDrawer(workflow.identifier, null))}
            >
              <BuilderHeaderText>
                {name}
                <EditIconWrapper>
                  <EditIcon fontSize="small" color="inherit" />
                </EditIconWrapper>
              </BuilderHeaderText>
            </button>
          </BuilderHeader>
          {elements && (
            <ReactFlowAdapter
              connectionLineComponent={ConnectionLineComponent}
              connectionRadius={0}
              elements={elements}
              onConnect={onConnect}
              connectionLineType="default"
              nodeTypes={nodeTypes}
              edgeTypes={linkTypes}
              minZoom={0.1}
              maxZoom={1}
              onElementsChange={setElements}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              deleteKeyCode={46}
              onConnectStart={(_, { nodeId }) => setDraggedEdgeSourceId(nodeId)}
              onConnectEnd={() => {
                setDraggedEdgeSourceId(null);
                setHoveredTargetHandle(Position.Top);
              }}
              onSelectionDragStop={handleSelectionDragStop}
              onNodeDragStop={handleNodeDragStop}
              selectionKeyCode={['Meta', 'Shift']}
              multiSelectionKeyCode={['Meta', 'Shift']}
              nodesDraggable={isCurrentUserEditor}
              nodesConnectable={isCurrentUserEditor}
              elementsSelectable={isCurrentUserEditor}
              defaultEdgeOptions={DEFAULT_EDGE}
              selectionMode="partial"
              selectNodesOnDrag={false}
              isCurrentUserEditor={isCurrentUserEditor}
            />
          )}

          <BulkEditContainer
            selectedTasks={selectedTasks}
            onClose={resetSelection}
          />
        </Box>
      </Box>
      <TaskDrawer origin={TaskOrigin.TEMPLATE} />
    </div>
  );
};

const SmartFlowBuilderViewWithReactFlow = () => (
  <ReactFlowProvider>
    <SmartFlowBuilderView />
  </ReactFlowProvider>
);

export default SmartFlowBuilderViewWithReactFlow;
