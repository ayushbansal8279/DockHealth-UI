/* eslint-disable unicorn/prevent-abbreviations */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { isNil } from 'ramda';
import { useDispatch, useSelector } from 'react-redux';
import ArrowLeftIcon from 'img/arrow-left.svg';
import { TASK_TEMPLATES_PATH } from 'routing/helpers/paths';
import { deleteTasksLink } from 'actions/task-actions';
import {
  addNewDecisionTaskElement,
  addNewTaskElement,
  deleteNewTaskElement,
  linkTasks,
  saveTaskTemplateLayout,
  selectTaskTemplate,
  unselectTaskTemplate,
} from 'actions/task-template-actions';
import { taskTemplateDetailsSelector } from 'selectors/task-template-selectors';
import { Box } from '@material-ui/core';
import DecisionTaskElementIcon from 'img/template/decision-task-icon';
import ReactFlow, { Controls, ReactFlowProvider } from 'react-flow-renderer';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import {
  NodeType,
  LinkType,
  TASK_NODE_WIDTH,
} from 'helpers/task-template-builder-helpers';
import NewTaskNode from './NewTaskNode/NewTaskNode';
import TaskNode from './TaskNode/TaskNode';
import TaskLink from './TaskLink/TaskLink';
import DecisionTaskLink from './DecisionTaskLink/DecisionTaskLink';
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
} from './styled';

const nodeTypes = {
  [NodeType.NEW_STANDARD]: NewTaskNode,
  [NodeType.NEW_DECISION]: NewTaskNode,
  [NodeType.STANDARD]: TaskNode,
  [NodeType.DECISION]: TaskNode,
};

const linkTypes = {
  [LinkType.STANDARD]: TaskLink,
  [LinkType.DECISION]: DecisionTaskLink,
};

const TaskTemplateDetailsView = () => {
  const builderWrapperReference = useRef(null);
  const setViewPositionReference = useRef(null);
  const [elements, setElements] = useState(null);
  const [draggedEdgeSourceId, setDraggedEdgeSourceId] = useState(null);
  const { identifier } = useParams();
  const dispatch = useDispatch();
  const { tasks, layout, temporaryElements } =
    useSelector(taskTemplateDetailsSelector(identifier)) || {};
  const history = useHistory();

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

    setViewPositionReference.current({
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

  const nodeElements = [
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
        const position = calculateNewElementPosition(layout);
        dispatch(addNewDecisionTaskElement(position));
        centerViewToElement(position);
      },
    },
  ];

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
              },
            };
          })
        : null,
    [elements, temporaryElements, draggedEdgeSourceId, identifier],
  );

  const handleRemoveElement = elementsToDelete => {
    elementsToDelete.forEach(element => {
      if (Object.values(LinkType).includes(element.type)) {
        const {
          source: sourceTaskIdentifier,
          target: targetTaskIdentifier,
        } = element;
        dispatch(deleteTasksLink(sourceTaskIdentifier, targetTaskIdentifier));
      } else if (
        [NodeType.NEW_DECISION, NodeType.NEW_STANDARD].includes(element.type)
      ) {
        dispatch(deleteNewTaskElement(element.id));
      }
    });
  };

  return (
    <>
      <ReactFlowProvider>
        <Box position="relative" display="flex" height="100%" width="100%">
          <ElementsSidebar>
            <SidebarTitle>Workflow Toolkit</SidebarTitle>
            {nodeElements.map(({ id, label, icon: Icon, onClick }) => (
              <ElementButton key={id} type="button" onClick={onClick}>
                <ElementIconBackground>
                  <Icon />
                </ElementIconBackground>
                <ElementDescription>{label}</ElementDescription>
              </ElementButton>
            ))}
          </ElementsSidebar>
          <Box ref={builderWrapperReference} position="relative" flex={1}>
            <BuilderHeader>
              <button
                type="button"
                onClick={() => history.push(TASK_TEMPLATES_PATH)}
              >
                <img src={ArrowLeftIcon} alt="back" style={{ width: 16 }} />
              </button>
              <Box m={0.5} />
              <BuilderHeaderText>Workflows</BuilderHeaderText>
            </BuilderHeader>
            {mergedElementsWithActions && (
              <ReactFlow
                elements={mergedElementsWithActions}
                onConnect={onConnect}
                connectionLineType="step"
                nodeTypes={nodeTypes}
                edgeTypes={linkTypes}
                minZoom={0.1}
                maxZoom={1}
                onElementsRemove={handleRemoveElement}
                deleteKeyCode={46}
                onConnectStart={(_, { nodeId }) =>
                  setDraggedEdgeSourceId(nodeId)
                }
                onConnectEnd={() => setDraggedEdgeSourceId(null)}
                onNodeDragStop={handleNodeDragStop}
                onLoad={({ fitView, setTransform }) => {
                  setViewPositionReference.current = setTransform;
                  if (tasks.length > 4) setTimeout(fitView, 100);
                }}
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
