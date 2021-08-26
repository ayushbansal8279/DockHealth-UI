export const TASK_NODE_WIDTH = 230;

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

export function createTaskNode(currentTemporaryElements, elementPosition) {
  const numberOfNewTasks =
    currentTemporaryElements?.filter(
      element => element.type === NodeType.NEW_STANDARD,
    ).length || 0;

  return {
    id: `${NodeType.NEW_STANDARD}-${numberOfNewTasks}`,
    type: NodeType.NEW_STANDARD,
    position: elementPosition,
  };
}

export function createDecisionTaskNodes(
  currentTemporaryElements,
  elementPosition,
) {
  const newDecisionTaskId = `${
    NodeType.NEW_DECISION
  }-${currentTemporaryElements?.filter(
    element => element.type === NodeType.NEW_DECISION,
  ).length || 0}`;

  const firstNewStandardTask = createTaskNode(currentTemporaryElements, {
    x: elementPosition.x - 200,
    y: elementPosition.y + 300,
  });

  return [
    {
      id: newDecisionTaskId,
      type: NodeType.NEW_DECISION,
      position: elementPosition,
    },
    firstNewStandardTask,
    createTaskNode(
      [firstNewStandardTask, ...(currentTemporaryElements || [])],
      {
        x: elementPosition.x + 200,
        y: elementPosition.y + 300,
      },
    ),
  ];
}

export function getTargetNodeType(sourceElementType) {
  if (sourceElementType === NodeType.NEW_DECISION) return NodeType.DECISION;

  return NodeType.STANDARD;
}
