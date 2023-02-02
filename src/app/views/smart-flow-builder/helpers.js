import {
  NodeType,
  LinkType,
  NodeSourceHandle,
  NodeTargetHandle,
  getUniqueLinkId,
} from 'helpers/smart-flow-builder-helpers';
import isNil from 'ramda/src/isNil';
import pick from 'ramda/src/pick';
import prop from 'ramda/src/prop';

// eslint-disable-next-line sonarjs/cognitive-complexity
export function mapLayoutToElements(layout, tasks) {
  if (tasks?.length > 0) {
    let itemsWithoutPositionCount = 0;

    return tasks.reduce((accumulator, t) => {
      if (t.taskLinks) {
        for (const link of t.taskLinks) {
          const { sourceTaskIdentifier, targetTaskIdentifier } = link;
          const layoutId = getUniqueLinkId(
            sourceTaskIdentifier,
            targetTaskIdentifier,
          );
          const { sourceHandle, targetHandle } =
            layout?.find(({ id }) => id === layoutId) || {};

          const linkElement = {
            id: layoutId,
            source: sourceTaskIdentifier,
            target: targetTaskIdentifier,
            sourceHandle: sourceHandle || NodeSourceHandle.SOURCE_A,
            targetHandle: targetHandle || NodeTargetHandle.TARGET_A,
            type:
              t.intentType === NodeType.DECISION
                ? LinkType.DECISION
                : LinkType.STANDARD,
            data: { link },
          };

          if (t.intentType === NodeType.DECISION) {
            const outcome =
              t.taskOutcomes?.find(
                ({ taskOutcomeIdentifier }) =>
                  taskOutcomeIdentifier === link.decisionOutcome,
              ) || null;
            linkElement.data.outcome = outcome;
          }

          accumulator.push(linkElement);
        }
      }

      let { position } =
        layout && Array.isArray(layout)
          ? layout?.find(({ id }) => id === t.identifier) || {}
          : {};

      if (!position) {
        position = { x: 150, y: 150 * (itemsWithoutPositionCount + 1) };
        itemsWithoutPositionCount += 1;
      }

      accumulator.push({
        id: t.identifier,
        type: t.intentType || NodeType.STANDARD,
        data: { task: t },
        position,
      });

      return accumulator;
    }, []);
  }

  return [];
}

export function mapElementsToLayout(elements) {
  const nodes = elements
    .filter(({ position, data }) => position && data.task)
    .map(pick(['id', 'position']));

  const links = elements
    .filter(({ source, target }) => source && target)
    .map(({ source, target, sourceHandle, targetHandle }) => ({
      id: getUniqueLinkId(source, target),
      sourceHandle,
      targetHandle,
    }));

  return [...(nodes || []), ...(links || [])];
}

export function updateNodePosition(nodeId, newPosition, elements) {
  return elements.map((n) =>
    n.id === nodeId ? { ...n, position: { ...n.position, ...newPosition } } : n,
  );
}

export function calculateNewElementPosition(layout) {
  const layoutNodes = layout?.filter(prop('position'));
  if (!layoutNodes || layoutNodes.length === 0)
    return {
      x: 300,
      y: 300,
    };

  let firstElementX;
  let lastElementX;
  let lastElementY;

  for (const { position } of layoutNodes) {
    const { x, y } = position;
    if (x < firstElementX || isNil(firstElementX)) {
      firstElementX = position.x;
    }
    if (x > lastElementX || isNil(lastElementX)) {
      lastElementX = x;
    }
    if (y > lastElementY || isNil(lastElementY)) {
      lastElementY = y;
    }
  }

  const newElementPositionX =
    (lastElementX - firstElementX) / 2 + firstElementX;
  const newElementPositionY = lastElementY + 300;

  return { x: newElementPositionX, y: newElementPositionY };
}

export function isTargetOfStandardNode(node, tasks) {
  return tasks?.some(
    ({ intentType, taskLinks }) =>
      intentType === NodeType.STANDARD &&
      taskLinks?.some(
        ({ targetTaskIdentifier }) => targetTaskIdentifier === node.id,
      ),
  );
}
