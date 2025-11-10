import React, { useCallback, useMemo, useRef } from 'react';
import {
  ReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
  Controls,
  MiniMap,
} from '@xyflow/react';
import {
  getMiniMapNodeColor,
  NodeType,
} from 'helpers/smart-flow-builder-helpers';
import { deleteTasksLinkWithoutAlert } from '@/app/actions/task-actions';
import { useDispatch } from 'react-redux';
import { linkTasks } from '@/app/actions/task-template-actions';

const ReactFlowAdapter = ({
  elements,
  onElementsChange,
  onLoad,
  onPanelClick,
  isCurrentUserEditor,
  ...props
}) => {
  const dispatch = useDispatch();
  const isNode = useCallback(
    (element) => Object.values(NodeType).includes(element.type),
    [],
  );
  const reconnectRef = useRef(false);

  const [nodes, edges] = useMemo(() => {
    const nodesArray = [];
    const edgesArray = [];
    for (const element of elements) {
      if (isNode(element)) {
        nodesArray.push(element);
      } else {
        const reconnectable = element.selected ? 'target' : false;
        edgesArray.push({ ...element, reconnectable });
      }
    }
    return [nodesArray, edgesArray];
  }, [elements, isNode]);

  const onNodesChange = useCallback(
    (changes) =>
      onElementsChange((previousElements) => [
        ...previousElements.filter((element) => !isNode(element)),
        ...applyNodeChanges(changes, nodes),
      ]),
    [onElementsChange, nodes, isNode],
  );
  const onEdgesChange = useCallback(
    (changes) =>
      onElementsChange((previousElements) => [
        ...previousElements.filter((element) => isNode(element)),
        ...applyEdgeChanges(changes, edges),
      ]),
    [onElementsChange, edges, isNode],
  );

  const onReconnect = useCallback(
    (oldEdge, newConnection) => {
      const {
        source: oldEdgeSourceTaskIdentifier,
        target: oldEdgeTargetTaskIdentifier,
      } = oldEdge;
      const {
        source: newEdgeSourceTaskIdentifier,
        target: newEdgeTargetTaskIdentifier,
        sourceHandle: newEdgeSourceHandle,
        targetHandle: newEdgeTargetHandle,
      } = newConnection;

      if (
        oldEdgeSourceTaskIdentifier === newEdgeSourceTaskIdentifier &&
        oldEdgeTargetTaskIdentifier === newEdgeTargetTaskIdentifier
      ) {
        return;
      }
      reconnectRef.current = true;
      dispatch(
        linkTasks(
          { id: newEdgeSourceTaskIdentifier, handle: newEdgeSourceHandle },
          { id: newEdgeTargetTaskIdentifier, handle: newEdgeTargetHandle },
        ),
      );
    },
    [dispatch],
  );

  const onReconnectStart = useCallback(
    (event, edge, handleType) => {
      const { source: sourceTaskIdentifier, target: targetTaskIdentifier } =
        edge;
      dispatch(
        deleteTasksLinkWithoutAlert(sourceTaskIdentifier, targetTaskIdentifier),
      );
    },
    [dispatch],
  );

  const onReconnectEnd = useCallback(
    (event, edge, handleType, connectionState) => {
      const { source, target, sourceHandle, targetHandle } = edge;

      if (reconnectRef.current) {
        reconnectRef.current = false;
      } else {
        dispatch(
          linkTasks(
            { id: source, handle: sourceHandle },
            { id: target, handle: targetHandle },
          ),
        );
      }
    },
    [dispatch],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onInit={onLoad}
      {...props}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onPaneClick={onPanelClick}
      onReconnect={onReconnect}
      onReconnectStart={onReconnectStart}
      onReconnectEnd={onReconnectEnd}
      edgesReconnectable={true}
      reconnectRadius={20}
    >
      <Controls showInteractive={isCurrentUserEditor} />
      <MiniMap
        nodeBorderRadius={4}
        nodeStrokeColor={() => '#ffffff'}
        nodeColor={getMiniMapNodeColor}
        maskColor="rgba(0, 0, 0, 0.1)"
        style={{
          position: 'absolute',
          right: 60,
          bottom: 60,
          borderRadius: 4,
          border: '1px solid #e0e0e0',
          boxShadow: '0 0 6px rgba(0, 0, 0, 0.1)',
        }}
      />
    </ReactFlow>
  );
};

export default ReactFlowAdapter;
