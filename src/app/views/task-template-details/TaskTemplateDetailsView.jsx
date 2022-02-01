/* eslint-disable unicorn/prevent-abbreviations */
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { isNil } from 'ramda';
import { useDispatch, useSelector } from 'react-redux';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import HardDependencyIcon from 'img/template/hard-dependency';
import CalendarIcon from 'img/template/calendar-icon';
import { TASK_TEMPLATES_PATH } from 'routing/helpers/paths';
import {
  deleteTasksLink,
  changeTaskIntentType,
  updateTasksLink,
  deleteTask,
} from 'actions/task-actions';
import { openModal } from 'modal/actions';
import {
  addDecisionBranch,
  addNewDecisionTaskElement,
  addNewTaskElement,
  deleteTemporaryElement,
  linkTasks,
  saveTaskTemplateLayout,
  selectTaskTemplate,
  unselectTaskTemplate,
} from 'actions/task-template-actions';
import {
  taskTemplateDetailsSelector,
  currentTaskTemplateSelector,
} from 'selectors/task-template-selectors';
import { userHasSmartFlowsSelector } from 'selectors/user-selectors';
import { Box, ClickAwayListener, Paper, Popper } from '@material-ui/core';
import DecisionTaskElementIcon from 'img/template/decision-task-icon';
import ReactFlow, {
  Controls,
  Position,
  ReactFlowProvider,
} from 'react-flow-renderer';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import {
  NodeType,
  LinkType,
  TASK_NODE_WIDTH,
} from 'helpers/task-template-builder-helpers';
import { useBoolean } from 'hooks/useBoolean';
import palette from 'styles/palette';
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
  HotkeysElements,
  Hotkey,
  HotkeyDescription,
} from './styled';
import ConnectionLink from './ConnectionLink/ConnectionLink';
import TaskLinkDelayForm from './TaskLinkDelayForm/TaskLinkDelayForm';
import TemporaryDecisionTaskLink from './TemporaryDecisionTaskLink/TemporaryDecisionTaskLink';

const nodeTypes = {
  [NodeType.NEW_STANDARD]: NewTaskNode,
  [NodeType.NEW_DECISION]: NewTaskNode,
  [NodeType.STANDARD]: TaskNode,
  [NodeType.DECISION]: TaskNode,
};

const linkTypes = {
  [LinkType.STANDARD]: TaskLink,
  [LinkType.DECISION]: DecisionTaskLink,
  [LinkType.TEMPORARY]: TemporaryTaskLink,
  [LinkType.TEMPORARY_DECISION]: TemporaryDecisionTaskLink,
};

const TaskTemplateDetailsView = () => {
  const delayPeriodOptionReference = useRef(null);
  const builderWrapperReference = useRef(null);
  const reactFlowInstance = useRef(null);
  const [elements, setElements] = useState(null);
  const [selectedElements, setSelectedElements] = useState(null);
  const [draggedEdgeSourceId, setDraggedEdgeSourceId] = useState(null);
  const [hoveredTargetHandle, setHoveredTargetHandle] = useState(Position.Top);
  const [isDelayPopoverOpen, openDelayPopover, closeDelayPopover] = useBoolean(
    false,
  );
  const { identifier } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const { tasks, layout, temporaryElements } =
    useSelector(taskTemplateDetailsSelector(identifier)) || {};
  const { name, type: templateType } =
    useSelector(currentTaskTemplateSelector) || {};
  const smartFlowsAvailable = useSelector(userHasSmartFlowsSelector);

  useEffect(() => {
    if (smartFlowsAvailable === false && templateType === 'SMARTFLOW') {
      history.push('/');
    }
  }, [smartFlowsAvailable, templateType, history]);

  useEffect(() => {
    dispatch(selectTaskTemplate(identifier));

    return () => {
      dispatch(unselectTaskTemplate);
    };
  }, [dispatch, identifier]);

  useEffect(() => {
    if (tasks && !isNil(layout)) {
      setElements(mapLayoutToElements(layout, tasks));
    }
  }, [layout, tasks]);

  const centerViewToElement = elementPosition => {
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

    selectedElements
      .filter(se => [NodeType.STANDARD, NodeType.DECISION].includes(se.type))
      .forEach(selectedElement => {
        const {
          data: { task },
        } = selectedElement;

        // eslint-disable-next-line no-unused-expressions
        tasks
          ?.filter(se => se.intentType === NodeType.STANDARD)
          .forEach(({ taskLinks }) =>
            taskLinks.forEach(link => {
              if (link.targetTaskIdentifier === task.identifier) {
                dispatch(
                  updateTasksLink({
                    ...link,
                    isDependent: true,
                  }),
                );
              }
            }),
          );
      });
  }, [dispatch, selectedElements, tasks]);

  const handleDelayForSubmit = delayPeriodData => {
    if (!selectedElements) return;

    selectedElements
      .filter(se => [NodeType.STANDARD, NodeType.DECISION].includes(se.type))
      .forEach(selectedElement => {
        const {
          data: { task },
        } = selectedElement;

        // eslint-disable-next-line no-unused-expressions
        tasks.forEach(({ taskLinks }) =>
          taskLinks.forEach(link => {
            if (link.targetTaskIdentifier === task.identifier) {
              dispatch(
                updateTasksLink({
                  ...link,
                  isDependent: true,
                  ...delayPeriodData,
                }),
              );
            }
          }),
        );
      });
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
            selectedElements.some(se => !!se.data?.task)
          ) {
            selectedElements.forEach(selectedElement => {
              if (selectedElement?.data.task.taskLinks?.length > 0) {
                dispatch(
                  openModal('Information', {
                    text:
                      'This task already has linkages to other tasks. If you want to change it to decision tree, please remove existing connections.',
                  }),
                );
              } else {
                const { taskIdentifier } = selectedElement.data.task;
                dispatch(
                  changeTaskIntentType(taskIdentifier, NodeType.DECISION),
                );
                centerViewToElement(selectedElement.position);
              }
            });
          } else {
            const position = calculateNewElementPosition(layout);
            dispatch(addNewDecisionTaskElement(position));
            centerViewToElement(position);
          }
        },
      },
    ];

    let actions = [...baseActions];

    const selectedTasks = selectedElements?.filter(se =>
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
    dispatch,
    layout,
    handleMakeSelectionDependent,
    openDelayPopover,
    selectedElements,
  ]);

  const handleNodeDragStop = (_, node) => {
    const isExistingTask = !!node.data.task;

    if (isExistingTask) {
      const updatedElements = updateNodePosition(
        node.id,
        node.position,
        elements,
      );
      const newLayout = mapElementsToLayout(updatedElements);
      dispatch(saveTaskTemplateLayout(newLayout));
    }
  };

  const mergedElementsWithActions = useMemo(
    () =>
      elements || temporaryElements
        ? [...(elements || []), ...(temporaryElements || [])]?.map(e => {
            return {
              ...e,
              isConnectable: draggedEdgeSourceId !== e.id,
              data: {
                ...e.data,
                draggedEdgeSourceId,
                taskTemplateIdentifier: identifier,
                onTargetHandleHover: setHoveredTargetHandle,
              },
            };
          })
        : null,
    [elements, temporaryElements, draggedEdgeSourceId, identifier],
  );

  const handleRemoveElement = elementsToDelete => {
    elementsToDelete.forEach(element => {
      if ([LinkType.DECISION, LinkType.STANDARD].includes(element.type)) {
        const {
          source: sourceTaskIdentifier,
          target: targetTaskIdentifier,
        } = element;
        dispatch(deleteTasksLink(sourceTaskIdentifier, targetTaskIdentifier));
      } else if (
        [
          NodeType.NEW_DECISION,
          NodeType.NEW_STANDARD,
          LinkType.TEMPORARY,
        ].includes(element.type)
      ) {
        dispatch(deleteTemporaryElement(element.id));
      } else if (
        [NodeType.DECISION, NodeType.STANDARD].includes(element.type)
      ) {
        dispatch(deleteTask(element.data.task));
      }
    });
  };

  const ConnectionLineComponent = useCallback(
    props => <ConnectionLink {...props} targetPosition={hoveredTargetHandle} />,
    [hoveredTargetHandle],
  );

  const handleDragOver = event => {
    event.preventDefault();
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = event => {
    event.preventDefault();

    const reactFlowBounds = builderWrapperReference.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');
    const position = reactFlowInstance.current.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    if (type === NodeType.NEW_STANDARD) dispatch(addNewTaskElement(position));
    else if (type === NodeType.NEW_DECISION)
      dispatch(addNewDecisionTaskElement(position));
  };

  const handleLoad = _reactFlowInstance => {
    reactFlowInstance.current = _reactFlowInstance;
    setTimeout(_reactFlowInstance.fitView, 0);
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <Box position="relative" display="flex" height="100%" width="100%">
          <ElementsSidebar>
            <Box>
              <SidebarTitle>SmartFlow Toolkit</SidebarTitle>
              {toolkitActions.map(({ id, label, icon: Icon, ref, onClick }) => (
                <ElementButton
                  key={id}
                  type="button"
                  ref={ref}
                  onClick={onClick}
                  onDragStart={event => {
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
              <SidebarTitle>Hotkeys</SidebarTitle>
              <Box p={0.5} />
              <HotkeysElements>
                <div>
                  <HotkeyDescription>
                    Remove Task
                    <br />
                    Or Link
                  </HotkeyDescription>
                </div>
                <div>
                  <Hotkey>Delete</Hotkey>
                </div>
                <div>
                  <HotkeyDescription>Multi-Select</HotkeyDescription>
                </div>
                <div>
                  <Hotkey>Shift</Hotkey>
                  <HotkeyDescription>then Drag</HotkeyDescription>
                </div>
              </HotkeysElements>
            </Box>
          </ElementsSidebar>
          <Box ref={builderWrapperReference} position="relative" flex={1}>
            <BuilderHeader>
              <Link to={TASK_TEMPLATES_PATH}>
                <BuilderHeaderText color={palette.brightBlue}>
                  Workflows
                </BuilderHeaderText>
              </Link>
              <Box px={1}>
                <NavigateNextIcon fontSize="small" />
              </Box>
              <BuilderHeaderText>{name}</BuilderHeaderText>
            </BuilderHeader>
            {mergedElementsWithActions && (
              <ReactFlow
                connectionLineComponent={ConnectionLineComponent}
                elements={mergedElementsWithActions}
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
                onNodeDragStop={handleNodeDragStop}
                onLoad={handleLoad}
                onSelectionChange={setSelectedElements}
              >
                <Controls />
              </ReactFlow>
            )}
          </Box>
        </Box>
      </ReactFlowProvider>
      <TaskDrawer />
    </div>
  );
};
export default TaskTemplateDetailsView;
