/* eslint-disable unicorn/prevent-abbreviations */
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { isEmpty, isNil } from 'ramda';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTasksLink } from 'actions/task-actions';
import {
  addNewDecisionTaskElement,
  addNewTaskElement,
  deleteNewTaskElement,
  linkTasks,
  saveTaskTemplateLayout,
  selectTaskTemplate,
  unselectTaskTemplate,
  updateTaskPositionInLayout,
} from 'actions/task-template-actions';
import { taskTemplateDetailsSelector } from 'selectors/task-template-selectors';
import { Box } from '@material-ui/core';
import DecisionTaskElementIcon from 'img/template/decision-task-icon';
import ReactFlow, { Controls } from 'react-flow-renderer';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import { NodeType, LinkType } from 'helpers/task-template-builder-helpers';
import NewTaskNode from './NewTaskNode/NewTaskNode';
import TaskNode from './TaskNode/TaskNode';
import TaskLink from './TaskLink/TaskLink';
import DecisionTaskLink from './DecisionTaskLink/DecisionTaskLink';
import {
  mapLayoutToElements,
  mapElementsToLayout,
  updateNodePosition,
} from './helpers';
import {
  ElementsSidebar,
  SidebarTitle,
  ElementButton,
  ElementIconBackground,
  ElementDescription,
  TaskElementIcon,
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
  const [elements, setElements] = useState(null);
  const [draggedEdgeSourceId, setDraggedEdgeSourceId] = useState(null);
  const { identifier } = useParams();
  const dispatch = useDispatch();
  const { tasks, layout, temporaryElements } =
    useSelector(taskTemplateDetailsSelector(identifier)) || {};
  const [viewPosition, setViewPosition] = useState({ x: 0, y: 0, zoom: 1 });

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
      onClick: () => dispatch(addNewTaskElement({ ...viewPosition })),
    },
    {
      id: NodeType.NEW_DECISION,
      label: 'Decision tree',
      icon: DecisionTaskElementIcon,
      onClick: () => dispatch(addNewDecisionTaskElement({ ...viewPosition })),
    },
  ];

  const handleNodeDragStop = (_, node) => {
    const isExistingTask = !!node.data.task;

    if (isExistingTask) {
      if (isEmpty(layout)) {
        const updatedElements = updateNodePosition(
          node.id,
          node.position,
          elements,
        );
        const newLayout = mapElementsToLayout(updatedElements);
        dispatch(saveTaskTemplateLayout(newLayout));
      } else {
        dispatch(updateTaskPositionInLayout(node.id, node.position));
      }
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
      <Box position="relative" display="flex" height="100%" width="100%">
        <ElementsSidebar>
          <SidebarTitle>Builders</SidebarTitle>
          {nodeElements.map(({ id, label, icon: Icon, onClick }) => (
            <ElementButton key={id} type="button" onClick={onClick}>
              <ElementIconBackground>
                <Icon />
              </ElementIconBackground>
              <ElementDescription>{label}</ElementDescription>
            </ElementButton>
          ))}
        </ElementsSidebar>
        <Box flex={1}>
          {mergedElementsWithActions && (
            <ReactFlow
              elements={mergedElementsWithActions}
              onConnect={onConnect}
              connectionLineType="step"
              nodeTypes={nodeTypes}
              edgeTypes={linkTypes}
              onElementsRemove={handleRemoveElement}
              deleteKeyCode={46}
              onConnectStart={(_, { nodeId }) => setDraggedEdgeSourceId(nodeId)}
              onConnectEnd={() => setDraggedEdgeSourceId(null)}
              onNodeDragStop={handleNodeDragStop}
              onMoveEnd={setViewPosition}
              onLoad={({ fitView }) => {
                if (tasks.length > 4) setTimeout(fitView, 100);
              }}
            >
              <Controls />
            </ReactFlow>
          )}
        </Box>
      </Box>
      <TaskDrawer />
    </>
  );
};
export default TaskTemplateDetailsView;
