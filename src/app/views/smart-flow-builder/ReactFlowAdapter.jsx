import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, { applyEdgeChanges, applyNodeChanges } from 'reactflow';
import { NodeType } from 'helpers/smart-flow-builder-helpers';

const ReactFlowAdapter = ({
  elements,
  onElementsChange,
  onLoad,
  extraNodes,
  ...props
}) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const onNodesChange = useCallback(
    (changes) =>
      onElementsChange((previousElements) => [
        ...previousElements.filter(
          (element) => !Object.values(NodeType).includes(element.type),
        ),
        ...applyNodeChanges(changes, nodes),
      ]),
    [onElementsChange, nodes],
  );
  const onEdgesChange = useCallback(
    (changes) =>
      onElementsChange((previousElements) => [
        ...previousElements.filter((element) =>
          Object.values(NodeType).includes(element.type),
        ),
        ...applyEdgeChanges(changes, edges),
      ]),
    [onElementsChange, edges],
  );

  useEffect(() => {
    const nodesArray = [];
    const edgesArray = [];
    for (const element of elements) {
      if (Object.values(NodeType).includes(element.type)) {
        nodesArray.push(element);
      } else {
        edgesArray.push(element);
      }
    }
    setNodes(nodesArray);
    setEdges(edgesArray);
  }, [elements, extraNodes]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onInit={onLoad}
      {...props}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    />
  );
};

export default ReactFlowAdapter;
