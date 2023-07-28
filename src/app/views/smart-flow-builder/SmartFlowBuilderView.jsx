/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { bulkEditTasks } from 'api/task-api';
import { useParams, Link, useHistory } from 'react-router-dom';
import compose from 'ramda/src/compose';
import isNil from 'ramda/src/isNil';
import not from 'ramda/src/not';
import path from 'ramda/src/path';
import pluck from 'ramda/src/pluck';
import { useDispatch, useSelector } from 'react-redux';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HardDependencyIcon from 'img/template/hard-dependency';
import CalendarIcon from 'img/template/calendar-icon';
import WorkflowLinkIcon from 'img/template/workflow-icon';
import {
  createWorkflowFolderPath,
  WORKFLOW_LIBRARY_PATH,
} from 'routing/helpers/paths';
import {
  deleteTasksLink,
  changeTaskIntentType,
  updateTasksLink,
  bulkEditDelete,
} from 'actions/task-actions';
import { openModal, closeModal } from 'modal/actions';
import {
  addDecisionBranch,
  addNewDecisionTaskElement,
  addNewNestedFlowElement,
  addNewTaskElement,
  deleteTemporaryElement,
  linkTasks,
  saveTaskTemplateLayout,
  saveTaskTemplateLayoutToHistory,
  undoTaskTemplateLayout,
  selectTaskTemplate,
  unselectTaskTemplate,
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
import { Controls, Position, ReactFlowProvider, MarkerType } from 'reactflow';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import {
  NodeType,
  LinkType,
  TASK_NODE_WIDTH,
  getAutoLayout,
} from 'helpers/smart-flow-builder-helpers';
import { showGlobalAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
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
} from './styled';
import TaskLinkDelayForm from './TaskLinkDelayForm/TaskLinkDelayForm';
import TemporaryDecisionTaskLink from './TemporaryDecisionTaskLink/TemporaryDecisionTaskLink';
import BulkEditContainer from './BulkEditContainer/BulkEditContainer';
import Hotkeys from './Hotkeys/Hotkeys';
import NestedFlowNode from './NestedFlow/NestedFlowNode/NestedFlowNode';
import NewNestedFlowNode from './NestedFlow/NewNestedFlowNode/NewNestedFlowNode';

const nodeTypes = {
  [NodeType.NEW_STANDARD]: NewTaskNode,
  [NodeType.NEW_DECISION]: NewTaskNode,
  [NodeType.STANDARD]: TaskNode,
  [NodeType.DECISION]: TaskNode,
  [NodeType.NEW_WORKFLOW_LINK]: NewNestedFlowNode,
  [NodeType.WORKFLOW_LINK]: NestedFlowNode,
};

const linkTypes = {
  [LinkType.STANDARD]: TaskLink,
  [LinkType.DECISION]: DecisionTaskLink,
  [LinkType.TEMPORARY]: TemporaryTaskLink,
  [LinkType.TEMPORARY_DECISION]: TemporaryDecisionTaskLink,
};

const DEFAULT_EDGE = {
  type: 'REGULAR',
  style: {
    strokeWidth: 1,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 8,
    height: 8,
    strokeWidth: 1,
  },
};

const SmartFlowBuilderView = () => {
  const delayPeriodOptionReference = useRef(null);
  const builderWrapperReference = useRef(null);
  const reactFlowInstance = useRef(null);
  const [elements, setElements] = useState(null);
  const [isSelection, setIsSelection] = useState(false);
  const selectedElements = reactFlowInstance.current
    ? [
        ...reactFlowInstance.current.getNodes(),
        ...reactFlowInstance.current.getEdges(),
      ].filter((element) => element.selected)
    : [];
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

  const numberOfTasks = tasks?.length || 0;
  const previousNumberOfTasks = useRef(null);

  const currentUser = useSelector(userProfileSelector);
  const isCurrentUserEditor =
    members?.find(({ user }) => user.identifier === currentUser.identifier)
      ?.memberPermission === 'EDITOR';

  useEffect(() => {
    if (
      reactFlowInstance.current &&
      previousNumberOfTasks.current > 0 &&
      numberOfTasks - previousNumberOfTasks.current > 1
    ) {
      setTimeout(reactFlowInstance.current.fitView, 0);
    }

    previousNumberOfTasks.current = numberOfTasks;
  }, [numberOfTasks]);

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
      const selectedElementsMap = selectedElements
        ? Object.fromEntries(
            selectedElements.map((element) => [element.id, element]),
          )
        : [];
      setElements(
        mapLayoutToElements(layout, tasks).map((element) => ({
          ...selectedElementsMap[element.id],
          ...element,
        })),
      );
    }
  }, [layout, tasks]);

  const centerViewToElement = (elementPosition) => {
    const { x, y } = elementPosition;
    const { offsetWidth, offsetHeight } = builderWrapperReference.current;

    reactFlowInstance.current.setTransform({
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
        id: NodeType.NEW_DECISION,
        label: 'Decision tree',
        icon: DecisionTaskElementIcon,
        onClick: () => {
          if (
            selectedElements?.length > 0 &&
            selectedElements.some((se) => !!se.data?.task)
          ) {
            for (const selectedElement of selectedElements) {
              if (selectedElement?.data.task.taskLinks?.length > 0) {
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
    ];

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

  const [extraNodes, setExtraNodes] = useState([]);

  const updateSelectedElementsPosition = (selectedNodes) => {
    let updatedElements = elements;
    let shouldUpdate = false;

    for (const node of selectedNodes) {
      const isExistingTask = !!node.data.task;
      if (isExistingTask) {
        if (!shouldUpdate) shouldUpdate = true;
        updatedElements = updateNodePosition(
          node.id,
          node.position,
          updatedElements,
        );
      } else {
        setExtraNodes([node]);
      }
    }

    if (shouldUpdate) {
      const newLayout = mapElementsToLayout(updatedElements);
      dispatch(saveTaskTemplateLayout(newLayout));
    }
  };

  const handleNodeDragStop = () => {
    updateSelectedElementsPosition(
      reactFlowInstance?.current.getNodes().filter((node) => node.selected),
    );
  };

  const handleSelectionDragStop = (_, nodes) => {
    updateSelectedElementsPosition(nodes);
  };

  const mergedElementsWithActions = useMemo(
    () =>
      elements || temporaryElements
        ? [...(elements || []), ...(temporaryElements || [])]?.map(
            (element) => {
              return {
                ...element,
                isConnectable: draggedEdgeSourceId !== element.id,
                data: {
                  ...element.data,
                  draggedEdgeSourceId,
                  taskTemplateIdentifier: identifier,
                  onTargetHandleHover: setHoveredTargetHandle,
                },
              };
            },
          )
        : null,
    [elements, temporaryElements, draggedEdgeSourceId, identifier],
  );

  const handleRemoveElement = (elementsToDelete) => {
    const tasksToDelete = elementsToDelete
      .filter(path(['data', 'task']))
      .map(path(['data', 'task']));
    const temporaryElementsToDelete = elementsToDelete.filter(({ type }) =>
      [
        NodeType.NEW_DECISION,
        NodeType.NEW_STANDARD,
        LinkType.TEMPORARY,
        LinkType.TEMPORARY_DECISION,
      ].includes(type),
    );
    const linksToDelete = elementsToDelete.filter((element) => {
      const { source, target, type } = element;

      if (![LinkType.DECISION, LinkType.STANDARD].includes(type)) {
        return false;
      }

      return !tasksToDelete.some(
        ({ identifier: taskId }) => taskId === source || taskId === target,
      );
    });

    if (
      tasksToDelete.length > 0 ||
      temporaryElementsToDelete.length > 0 ||
      linksToDelete.length > 0
    ) {
      dispatch(
        openModal('DeleteConfirmation', {
          title: 'Delete elements',
          description:
            'Are you sure you want to delete these elements? This action cannot be undone.',
          confirm: () => {
            dispatch(closeModal());

            if (tasksToDelete.length > 0) {
              const taskIdentifiersToDelete = pluck(
                'identifier',
                tasksToDelete,
              );

              bulkEditTasks({
                bulkEditType: 'DELETE',
                taskIdentifiers: taskIdentifiersToDelete,
              }).then(() => {
                dispatch(bulkEditDelete(taskIdentifiersToDelete));
                dispatch(showGlobalAlert(AlertMessages.DELETED));
              });
            }

            if (temporaryElementsToDelete.length > 0) {
              for (const element of temporaryElementsToDelete) {
                dispatch(deleteTemporaryElement(element.id));
              }
            }

            if (linksToDelete.length > 0) {
              for (const link of linksToDelete) {
                const {
                  source: sourceTaskIdentifier,
                  target: targetTaskIdentifier,
                } = link;
                dispatch(
                  deleteTasksLink(sourceTaskIdentifier, targetTaskIdentifier),
                );
              }
            }
          },
        }),
      );
    }
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
    const position = reactFlowInstance.current.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    switch (type) {
      case NodeType.NEW_STANDARD: {
        dispatch(addNewTaskElement(position));
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

  const handleLoad = (_reactFlowInstance) => {
    reactFlowInstance.current = _reactFlowInstance;
    setTimeout(_reactFlowInstance.fitView, 0);
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
    setTimeout(reactFlowInstance.current.fitView, 0);
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
      <ReactFlowProvider>
        <Box position="relative" display="flex" height="100%" width="100%">
          <ElementsSidebar>
            <Box>
              <SidebarTitle>SmartFlow Toolkit</SidebarTitle>
              {isCurrentUserEditor &&
                toolkitActions.map(
                  ({ id, label, icon: Icon, ref, onClick }) => (
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
                  ),
                )}
              <SidebarDivider />
              {isCurrentUserEditor && (
                <Tooltip title="Auto Align will organize  your layout ">
                  <AutoAlignButton type="button" onClick={handleAutoAlignClick}>
                    Auto Align Layout
                  </AutoAlignButton>
                </Tooltip>
              )}
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
                to={
                  parentTaskWorkflowIdentifier
                    ? createWorkflowFolderPath(parentTaskWorkflowIdentifier)
                    : WORKFLOW_LIBRARY_PATH
                }
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
            {mergedElementsWithActions && (
              <ReactFlowAdapter
                // connectionLineComponent={ConnectionLineComponent}
                elements={mergedElementsWithActions}
                extraNodes={extraNodes}
                onConnect={onConnect}
                connectionLineType="step"
                nodeTypes={nodeTypes}
                edgeTypes={linkTypes}
                minZoom={0.1}
                maxZoom={1}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onElementsRemove={handleRemoveElement}
                deleteKeyCode={46}
                onConnectStart={(_, { nodeId }) =>
                  setDraggedEdgeSourceId(nodeId)
                }
                onConnectEnd={() => {
                  setDraggedEdgeSourceId(null);
                  setHoveredTargetHandle(Position.Top);
                }}
                onSelectionDragStop={handleSelectionDragStop}
                onNodeDragStop={handleNodeDragStop}
                onLoad={handleLoad}
                onSelectionChange={(isSelected) => setIsSelection(isSelected)}
                multiSelectionKeyCode={91}
                nodesDraggable={isCurrentUserEditor}
                nodesConnectable={isCurrentUserEditor}
                elementsSelectable={isCurrentUserEditor}
                defaultEdgeOptions={DEFAULT_EDGE}
              >
                <Controls showInteractive={isCurrentUserEditor} />
              </ReactFlowAdapter>
            )}

            <BulkEditContainer
              selectedTasks={selectedTasks}
              onClose={resetSelection}
            />
          </Box>
        </Box>
      </ReactFlowProvider>
      <TaskDrawer />
    </div>
  );
};
export default SmartFlowBuilderView;
