import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, { applyEdgeChanges, applyNodeChanges } from 'reactflow';
import { NodeType } from 'helpers/smart-flow-builder-helpers';

const ReactFlowAdapter = ({
  elements,
  onSelectionChange,
  onLoad,
  extraNodes,
  ...props
}) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );

  const handleSelectionChange = (payload) => {
    onSelectionChange([...payload.nodes, ...payload.edges]);
  };

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
      onSelectionChange={handleSelectionChange}
      onInit={onLoad}
      {...props}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    />
  );
};

export default ReactFlowAdapter;
