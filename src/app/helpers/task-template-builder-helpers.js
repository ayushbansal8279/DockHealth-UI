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
  TEMPORARY: 'TEMPORARY_LINK',
};

export const NodeSourceHandle = {
  SOURCE_A: 'SOURCE_A',
  SOURCE_B: 'SOURCE_B',
  SOURCE_C: 'SOURCE_C',
};

export const NodeTargetHandle = {
  TARGET_A: 'TARGET_A',
  TARGET_B: 'TARGET_B',
  TARGET_C: 'TARGET_C',
  TARGET_D: 'TARGET_D',
};

export function getUniqueLinkId(sourceId, targetId) {
  return `${sourceId}_${targetId}`;
}

export function createLinkElement(
  sourceId,
  targetId,
  sourceHandle,
  targetHandle,
) {
  return {
    id: getUniqueLinkId(sourceId, targetId),
    source: sourceId,
    target: targetId,
    sourceHandle: sourceHandle || NodeSourceHandle.SOURCE_A,
    targetHandle: targetHandle || NodeTargetHandle.TARGET_A,
    type: LinkType.TEMPORARY,
    data: {},
  };
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

export function createTemporaryOptionsForDecisionTask(
  currentTemporaryElements,
  decisionTaskId,
  decisionTaskPosition,
) {
  const firstTemporaryStandardTask = createTaskNode(currentTemporaryElements, {
    x: decisionTaskPosition.x - 200,
    y: decisionTaskPosition.y + 300,
  });

  const secondTemporaryStandardTask = createTaskNode(
    [firstTemporaryStandardTask, ...(currentTemporaryElements || [])],
    {
      x: decisionTaskPosition.x + 200,
      y: decisionTaskPosition.y + 300,
    },
  );

  return [
    firstTemporaryStandardTask,
    secondTemporaryStandardTask,
    createLinkElement(decisionTaskId, firstTemporaryStandardTask.id),
    createLinkElement(decisionTaskId, secondTemporaryStandardTask.id),
  ];
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

  const temporaryDecisionTask = {
    id: newDecisionTaskId,
    type: NodeType.NEW_DECISION,
    position: elementPosition,
  };

  return [
    temporaryDecisionTask,
    ...createTemporaryOptionsForDecisionTask(
      currentTemporaryElements,
      temporaryDecisionTask.id,
      temporaryDecisionTask.position,
    ),
  ];
}

export function getTargetNodeType(sourceElementType) {
  if (sourceElementType === NodeType.NEW_DECISION) return NodeType.DECISION;

  return NodeType.STANDARD;
}
