export const NodeType = {
  NEW_STANDARD: 'NEW_STANDARD',
  NEW_DECISION: 'NEW_DECISION',
  STANDARD: 'STANDARD',
  DECISION: 'DECISION',
};

export const LinkType = {
  STANDARD: 'STANDARD_LINK',
  DECISION: 'DECISION_LINK',
};

export const NodeSourceHandle = {
  SOURCE_A: 'SOURCE_A',
  SOURCE_B: 'SOURCE_B',
  SOURCE_C: 'SOURCE_C',
};

export const NodeTargetHandle = {
  TARGET_A: 'TARGET_A',
};

export function getUniqueLinkId(sourceId, targetId) {
  return `${sourceId}_${targetId}`;
}

export function createDecisionTaskNode(currentTemporaryElements, viewPosition) {
  const newDecisionTaskId = `${
    NodeType.NEW_DECISION
  }-${currentTemporaryElements?.filter(
    element => element.type === NodeType.NEW_DECISION,
  ).length || 0}`;

  return {
    id: newDecisionTaskId,
    type: NodeType.NEW_DECISION,
    position: {
      x: -viewPosition.x / viewPosition.zoom + 100,
      y: -viewPosition.y / viewPosition.zoom + 200,
    },
  };
}

export function createTaskNode(currentTemporaryElements, viewPosition) {
  const numberOfNewTasks =
    currentTemporaryElements?.filter(
      element => element.type === NodeType.NEW_STANDARD,
    ).length || 0;
  return {
    id: `${NodeType.NEW_STANDARD}-${numberOfNewTasks}`,
    type: NodeType.NEW_STANDARD,
    position: {
      x: -viewPosition.x / viewPosition.zoom + 100,
      y: -viewPosition.y / viewPosition.zoom + 100,
    },
  };
}

export function getTargetNodeType(sourceElementType) {
  if (sourceElementType === NodeType.NEW_DECISION) return NodeType.DECISION;

  return NodeType.STANDARD;
}
