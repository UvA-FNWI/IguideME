import {
  closestCorners,
  type DroppableContainer,
  getFirstCollision,
  KeyboardCode,
  type KeyboardCoordinateGetter,
} from '@dnd-kit/core';

const directions: string[] = [KeyboardCode.Down, KeyboardCode.Right, KeyboardCode.Up, KeyboardCode.Left];

export const coordinateGetter: KeyboardCoordinateGetter = (
  event,
  { context: { active, droppableRects, droppableContainers, collisionRect } },
) => {
  if (directions.includes(event.code)) {
    event.preventDefault();

    if (!active || !collisionRect) return;

    const filteredContainers: DroppableContainer[] = [];

    droppableContainers.getEnabled().forEach((entry) => {
      if (entry.disabled) return;

      const rect = droppableRects.get(entry.id);
      if (!rect) return;

      const data = entry.data.current;
      if (data) {
        const { type, children } = data;

        if (type === 'Column' && Array.isArray(children) && children.length > 0) {
          if (active.data.current?.type !== 'Column') return;
        }
      }

      switch (event.code) {
        case 'ArrowDown':
          if (active.data.current?.type === 'Column') return;
          if (collisionRect.top < rect.top) filteredContainers.push(entry);

          break;
        case 'ArrowUp':
          if (active.data.current?.type === 'Column') return;
          if (collisionRect.top > rect.top) filteredContainers.push(entry);
          break;
        case 'ArrowLeft':
          if (collisionRect.left >= rect.left + rect.width) filteredContainers.push(entry);
          break;
        case 'ArrowRight':
          if (collisionRect.left + collisionRect.width <= rect.left) filteredContainers.push(entry);
          break;
      }
    });

    const collisions = closestCorners({
      active,
      collisionRect,
      droppableRects,
      droppableContainers: filteredContainers,
      pointerCoordinates: null,
    });

    const closestId = getFirstCollision(collisions, 'id');

    if (closestId !== null) {
      const newDroppable = droppableContainers.get(closestId);
      const newNode = newDroppable?.node.current;
      const newRect = newDroppable?.rect.current;

      if (newNode && newRect) {
        return {
          x: newRect.left,
          y: newRect.top,
        };
      }
    }
  }

  return undefined;
};
