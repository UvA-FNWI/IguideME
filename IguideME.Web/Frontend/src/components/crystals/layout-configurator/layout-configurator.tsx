import ConfigLayoutColumn from '@/components/atoms/layout-column/layout-column';
import Loading from '@/components/particles/loading';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { Button, Col, Row } from 'antd';
import { createPortal } from 'react-dom';
import { getLayoutColumns, postLayoutColumns } from '@/api/tiles';
import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type FC, type ReactElement, useMemo, useState } from 'react';

import { type LayoutColumn } from '@/types/tile';
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

const LayoutConfigurator: FC = (): ReactElement => {
  const { data, isFetching } = useQuery({
    queryKey: ['layout-columns'],
    queryFn: getLayoutColumns,
  });

  if (isFetching || data === undefined) {
    return <Loading />;
  } else {
    return <LayoutConfiguratorInner data={data} />;
  }
};

interface Props {
  data: LayoutColumn[];
}

const LayoutConfiguratorInner: FC<Props> = ({ data }): ReactElement => {
  const queryClient = useQueryClient();

  const [columns, setColumns] = useState<LayoutColumn[]>(JSON.parse(JSON.stringify(data)));

  const { mutate: saveLayout } = useMutation({
    mutationFn: postLayoutColumns,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['layout-columns'] });
    },
  });
  const [active, setActive] = useState<LayoutColumn | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 20,
      },
    }),
  );

  const save = (): void => {
    if (columns !== null) {
      saveLayout(columns);
    }
  };

  const columnIds = useMemo(() => columns.map((column) => column.id), [columns]);

  const addColumn = (): void => {
    setColumns([
      ...columns,
      {
        id: -columns.length,
        width: 50,
        position: columns.length,
        groups: [],
      },
    ]);
  };

  const removeColumn = (id: number): void => {
    setColumns(columns.filter((col) => col.id !== id));
  };

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <SortableContext items={columnIds}>
        <Row>
          {columns.map((column) => (
            <Col key={column.id}>
              <ConfigLayoutColumn
                column={column}
                remove={removeColumn}
                parentOnChange={(column) => {
                  columns[columns.findIndex((col) => col.id === column.id)] = column;
                  setColumns(columns);
                }}
              />
            </Col>
          ))}
        </Row>
        <Row>
          <Button type="dashed" onClick={addColumn} block icon={<PlusOutlined />} className="bg-white">
            Add Column
          </Button>
        </Row>
      </SortableContext>
      <Button className="mt-2 bg-white" onClick={save}>
        Save
      </Button>
      {createPortal(
        <DragOverlay>{active !== null && <ConfigLayoutColumn column={active} />}</DragOverlay>,
        document.body,
      )}
    </DndContext>
  );

  function onDragStart(event: DragStartEvent): void {
    if (event.active.data.current !== undefined) {
      setActive(columns.find((col) => col.id === event.active.id) ?? null);
    }
  }

  function onDragEnd(event: DragEndEvent): void {
    setActive(null);
    const { active, over } = event;
    if (over === null) return;
    if (active.id === over.id) return;

    const activeIndex = columns.findIndex((column) => column.id === active.id);
    const overIndex = columns.findIndex((column) => column.id === over.id);

    setColumns(arrayMove(columns, activeIndex, overIndex));
  }
};

export default LayoutConfigurator;
