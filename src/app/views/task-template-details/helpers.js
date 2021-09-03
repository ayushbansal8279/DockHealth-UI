import {
  NodeType,
  LinkType,
  NodeSourceHandle,
  NodeTargetHandle,
  getUniqueLinkId,
} from 'helpers/task-template-builder-helpers';
import { isNil, pick, prop } from 'ramda';

// eslint-disable-next-line sonarjs/cognitive-complexity
export function mapLayoutToElements(layout, tasks) {
  if (tasks?.length > 0) {
    let itemsWithoutPositionCount = 0;

    return tasks.reduce((accumulator, t) => {
      if (t.taskLinks) {
        t.taskLinks.forEach(link => {
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
        });
      }

      let { position } = layout?.find(({ id }) => id === t.identifier) || {};

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
  return elements.map(n =>
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

  layoutNodes.forEach(({ position }) => {
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
  });

  const newElementPositionX =
    (lastElementX - firstElementX) / 2 + firstElementX;
  const newElementPositionY = lastElementY + 300;

  return { x: newElementPositionX, y: newElementPositionY };
}
