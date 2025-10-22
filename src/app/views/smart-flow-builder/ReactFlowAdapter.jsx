import React, { useCallback, useMemo } from 'react';
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

const ReactFlowAdapter = ({
  elements,
  onElementsChange,
  onLoad,
  onPanelClick,
  isCurrentUserEditor,
  ...props
}) => {
  const isNode = useCallback(
    (element) => Object.values(NodeType).includes(element.type),
    [],
  );

  const [nodes, edges] = useMemo(() => {
    const nodesArray = [];
    const edgesArray = [];
    for (const element of elements) {
      if (isNode(element)) {
        nodesArray.push(element);
      } else {
        edgesArray.push(element);
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

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onInit={onLoad}
      {...props}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onPaneClick={onPanelClick}
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
