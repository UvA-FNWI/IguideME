import ConfigLayoutColumn from '@/components/atoms/layout-column/layout-column';
import QueryError from '@/components/particles/QueryError';
import type { LayoutColumn } from '@/types/tile';
import { DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { Button, Card, Tooltip } from 'antd';
import type { CSSProperties, FC } from 'react';

interface ColumnProps {
  column: LayoutColumn;
  isLoading: boolean;
  isError: boolean;

  handleSettingChange: (column: LayoutColumn) => void;
  removeColumn: (index: number) => void;
}

const Column: FC<ColumnProps> = ({ column, isLoading, isError, handleSettingChange, removeColumn }) => {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({ id: column.id });

  const style: CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  return (
    <Card
      className={`custom-card-no-hover ${isDragging ? 'opacity-20' : ''} min-w-max !bg-surface1`}
      key={column.id}
      loading={isLoading}
      ref={setNodeRef}
      size='small'
      style={style}
      title={
        <div className='flex justify-between py-3'>
          <div className='flex cursor-grab items-center gap-2' {...attributes} {...listeners}>
            <div>
              <MenuOutlined className='text-text' />
            </div>
            <h3 className='text-lg'>Column</h3>
          </div>
          <Tooltip title='Remove column'>
            <Button
              className='custom-default-button !border-none'
              onClick={() => {
                removeColumn(column.id);
              }}
              icon={<DeleteOutlined className='text-failure' />}
            />
          </Tooltip>
        </div>
      }
    >
      {isError ?
        <QueryError className='static' title='Error: Failed to load column' />
      : <ConfigLayoutColumn column={column} handleSettingChange={handleSettingChange} />}
    </Card>
  );
};

export default Column;
