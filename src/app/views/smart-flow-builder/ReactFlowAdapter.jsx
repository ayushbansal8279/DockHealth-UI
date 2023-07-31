import React, { useCallback, useEffect, useState, useMemo } from 'react';
import ReactFlow, { applyEdgeChanges, applyNodeChanges } from 'reactflow';
import { NodeType } from 'helpers/smart-flow-builder-helpers';

const ReactFlowAdapter = ({
  elements,
  onElementsChange,
  onLoad,
  extraNodes,
  ...props
}) => {
  const { nodes, edges } = useMemo(() => {
    const nodesArray = [];
    const edgesArray = [];
    for (const element of elements) {
      if (Object.values(NodeType).includes(element.type)) {
        nodesArray.push(element);
      } else {
        edgesArray.push(element);
      }
    }
    return { nodes: nodesArray, edges: edgesArray };
  }, [elements]);

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
