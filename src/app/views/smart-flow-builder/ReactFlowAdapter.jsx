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
    />
  );
};

export default ReactFlowAdapter;
