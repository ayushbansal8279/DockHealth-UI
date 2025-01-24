import ELK from 'elkjs/lib/elk.bundled';

export const TASK_NODE_WIDTH = 230;

export const NodeType = {
  NEW_AUTOMATION: 'NEW_AUTOMATION',
  NEW_STANDARD: 'NEW_STANDARD',
  NEW_DECISION: 'NEW_DECISION',
  STANDARD: 'STANDARD',
  DECISION: 'DECISION',
  NEW_WORKFLOW_LINK: 'NEW_WORKFLOW_LINK',
  WORKFLOW_LINK: 'WORKFLOW_LINK',
  START_INDICATOR: 'INDICATOR',
  END_INDICATOR: 'INDICATOR',
};

export const LinkType = {
  INDICATOR: 'INDICATOR_LINK',
  STANDARD: 'STANDARD_LINK',
  DECISION: 'DECISION_LINK',
  TEMPORARY: 'TEMPORARY_LINK',
  TEMPORARY_DECISION: 'TEMPORARY_DECISION_LINK',
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
  type,
  sourceId,
  targetId,
  sourceHandle,
  targetHandle,
  indicatorType
) {
  if((sourceId === targetId) && (indicatorType === 'START_INDICATOR')){
    sourceId = 'START_INDICATOR'
  } 
  if((sourceId === targetId) && (indicatorType === 'END_INDICATOR')){
    targetId = 'END_INDICATOR'
  } 
  return {
    id: getUniqueLinkId(sourceId, targetId),
    source: sourceId,
    target: targetId,
    sourceHandle: sourceHandle || NodeSourceHandle.SOURCE_A,
    targetHandle: targetHandle || NodeTargetHandle.TARGET_A,
    type,
    data: {},
    indicatorType
  };
}

export function createTemporaryTaskNode(
  currentTemporaryElements,
  elementPosition,
  type = NodeType.NEW_STANDARD,
) {
  const numberOfNewTasks =
    currentTemporaryElements?.filter((element) => element.type === type)
      .length || 0;

  return {
    id: `${type}-${numberOfNewTasks}`,
    type,
    position: elementPosition,
  };
}

export function createTemporaryOptionsForDecisionTask(
  currentTemporaryElements,
  decisionTaskId,
  decisionTaskPosition,
) {
  const firstTemporaryStandardTask = createTemporaryTaskNode(
    currentTemporaryElements,
    {
      x: decisionTaskPosition.x - 200,
      y: decisionTaskPosition.y + 300,
    },
  );

  const secondTemporaryStandardTask = createTemporaryTaskNode(
    [firstTemporaryStandardTask, ...(currentTemporaryElements || [])],
    {
      x: decisionTaskPosition.x + 200,
      y: decisionTaskPosition.y + 300,
    },
  );

  return [
    firstTemporaryStandardTask,
    secondTemporaryStandardTask,
    createLinkElement(
      LinkType.TEMPORARY_DECISION,
      decisionTaskId,
      firstTemporaryStandardTask.id,
    ),
    createLinkElement(
      LinkType.TEMPORARY_DECISION,
      decisionTaskId,
      secondTemporaryStandardTask.id,
    ),
  ];
}

export function createDecisionTaskNodes(
  currentTemporaryElements,
  elementPosition,
) {
  const newDecisionTaskId = `${NodeType.NEW_DECISION}-${
    currentTemporaryElements?.filter(
      (element) => element.type === NodeType.NEW_DECISION,
    ).length || 0
  }`;

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

export function createNewAutomationTaskNode(
  currentTemporaryElements,
  elementPosition,
  type = NodeType.NEW_AUTOMATION,
) {
  const numberOfNewTasks =
    currentTemporaryElements?.filter((element) => element.type === type)
      .length || 0;
  return {
    id: `${type}-${numberOfNewTasks}`,
    type,
    position: elementPosition,
  };
}

export function getTargetNodeType(sourceElementType) {
  if (sourceElementType === NodeType.NEW_DECISION) return NodeType.DECISION;

  return NodeType.STANDARD;
}

export async function getAutoLayout(tasks, startX = 0, startY = 0) {
  const elk = new ELK();

  const nodes = [];
  const edges = [];

  for (const { identifier, taskLinks } of tasks) {
    nodes.push({ id: identifier, width: 230, height: 130 });

    // eslint-disable-next-line no-unused-expressions
    if (taskLinks)
      for (const { sourceTaskIdentifier, targetTaskIdentifier } of taskLinks) {
        if (
          tasks.some(({ identifier: id }) => sourceTaskIdentifier === id) &&
          tasks.some(({ identifier: id }) => targetTaskIdentifier === id)
        ) {
          edges.push({
            id: getUniqueLinkId(sourceTaskIdentifier, targetTaskIdentifier),
            sources: [sourceTaskIdentifier],
            targets: [targetTaskIdentifier],
          });
        }
      }
  }

  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.direction': 'DOWN',
      'elk.algorithm': 'mrtree',
      separateConnectedComponents: false,
      'elk.padding': '[left=0, top=0, right=0, bottom=0]',
      'spacing.nodeNode': 200,
      'spacing.nodeNodeBetweenLayers': 200,
    },
    children: nodes,
    edges,
  };

  const { children } = await elk.layout(graph);

  return children.map(({ id, x, y }) => ({
    id,
    position: {
      x: x + startX,
      y: y + startY,
    },
  }));
}
