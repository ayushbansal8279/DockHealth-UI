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
} from 'actions/task-actions';
import { openModal } from 'modal/actions';
import {
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
  isTargetOfStandardNode,
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
} from './styled';
import ConnectionLink from './ConnectionLink/ConnectionLink';
import TaskLinkDelayForm from './TaskLinkDelayForm/TaskLinkDelayForm';

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
};

const TaskTemplateDetailsView = () => {
  const delayPeriodOptionReference = useRef(null);
  const builderWrapperReference = useRef(null);
  const reactFlowInstance = useRef(null);
  const [elements, setElements] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
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

  const makeTaskDependent = useCallback(
    node => {
      const {
        data: { task },
      } = node;

      // eslint-disable-next-line no-unused-expressions
      tasks
        ?.filter(({ intentType }) => intentType === NodeType.STANDARD)
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
    },
    [dispatch, tasks],
  );

  const handleDelayForSubmit = delayPeriodData => {
    const {
      data: { task },
    } = selectedElement;

    // eslint-disable-next-line no-unused-expressions
    tasks
      ?.filter(({ intentType }) => intentType === NodeType.STANDARD)
      .forEach(({ taskLinks }) =>
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
          if (selectedElement?.data.task) {
            if (selectedElement?.data.task.taskLinks?.length > 0) {
              dispatch(
                openModal('Information', {
                  text:
                    'This task already has linkages to other tasks. If you want to change it to decision tree, please remove existing connections.',
                }),
              );
            } else {
              const { taskIdentifier } = selectedElement.data.task;
              dispatch(changeTaskIntentType(taskIdentifier, NodeType.DECISION));
              centerViewToElement(selectedElement.position);
            }
          } else {
            const position = calculateNewElementPosition(layout);
            dispatch(addNewDecisionTaskElement(position));
            centerViewToElement(position);
          }
        },
      },
    ];

    let actions = [...baseActions];

    if (
      selectedElement &&
      [NodeType.STANDARD, NodeType.DECISION].includes(selectedElement.type) &&
      isTargetOfStandardNode(selectedElement, tasks)
    ) {
      actions = [
        ...actions,
        {
          id: 'DEPENDENCY',
          label: 'Dependency',
          icon: () => <HardDependencyIcon size={18} />,
          onClick: () => makeTaskDependent(selectedElement),
        },
        {
          id: 'TIME_TILL_TASK',
          label: 'Add Time Till Task',
          icon: () => <CalendarIcon size={18} />,
          onClick: openDelayPopover,
          ref: delayPeriodOptionReference,
        },
      ];
    }

    return actions;
  }, [
    dispatch,
    layout,
    makeTaskDependent,
    openDelayPopover,
    selectedElement,
    tasks,
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

  const handleSelectionChange = event => {
    const element = event?.[0] ?? null;
    setSelectedElement(element);
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
    <>
      <ReactFlowProvider>
        <Box position="relative" display="flex" height="100%" width="100%">
          <ElementsSidebar>
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
                onSelectionChange={handleSelectionChange}
              >
                <Controls />
              </ReactFlow>
            )}
          </Box>
        </Box>
      </ReactFlowProvider>
      <TaskDrawer />
    </>
  );
};
export default TaskTemplateDetailsView;
