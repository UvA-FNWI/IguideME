import { getTileGroups } from '@/api/tiles';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { DeleteFilled } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useQuery } from '@tanstack/react-query';
import { Col, Divider, InputNumber, Row, Slider, Transfer } from 'antd';
import { useTheme } from 'next-themes';
import { type FC, type ReactElement, useState } from 'react';

import { type LayoutColumn } from '@/types/tile';

const MIN_WIDTH = 1;
const MAX_WIDTH = 100;
const formatter = (value: number | undefined): string => (value !== undefined ? `${value}%` : '');

interface Props {
  column: LayoutColumn;
  remove?: (index: number) => void;
  parentOnChange?: (column: LayoutColumn) => void;
}

interface RecordType {
  key: number;
  title: string;
}

const ConfigLayoutColumn: FC<Props> = ({ column, remove, parentOnChange }): ReactElement => {
  const [width, setWidth] = useState<number>(column.width);
  const [targetGroups, setGroups] = useState<string[]>(column.groups.map(String));
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const { data, isError, isLoading } = useQuery({
    queryKey: ['tile-groups'],
    queryFn: getTileGroups,
  });

  const groups: RecordType[] | undefined = data?.map((x) => {
    return { key: x.id, title: x.title };
  });

  const onChange = (): void => {
    parentOnChange?.(column);
  };

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column !== undefined ? column.id : 0,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const onGroupSelectChange = (source: string[], target: string[]): void => {
    setSelectedGroups([...source, ...target]);
  };

  const onGroupChange = (targetKeys: string[]): void => {
    setGroups(targetKeys);
    column.groups = targetKeys.map((key) => +key);
    onChange();
  };

  const { theme } = useTheme();

  if (isLoading) {
    return (
      <QueryLoading isLoading={isLoading}>
        <div
          className={`h-[360px] w-[425px] rounded-md bg-surface1 p-3 ${theme === 'light' ? 'shadow-statusCard' : 'border border-solid border-accent/50'}`}
        />
      </QueryLoading>
    );
  } else if (isError || data === undefined) {
    return (
      <div
        className={`relative h-[360px] w-[425px] rounded-md bg-surface1 p-3 [&>div]:grid [&>div]:place-content-center ${theme === 'light' ? 'shadow-statusCard' : 'border border-solid border-accent/50'}`}
      >
        <QueryError title='Error: Failed to load tile groups' />
      </div>
    );
  }

  if (isDragging) {
    return (
      <div
        className={`h-[360px] w-[425px] rounded-md bg-accent/20 p-3 ${theme === 'light' ? 'shadow-statusCard' : 'border border-solid border-accent/50'}`}
        ref={setNodeRef}
        style={style}
      />
    );
  } else {
    return (
      <div
        className={`h-[360px] w-[425px] rounded-md bg-surface1 p-3 ${theme === 'light' ? 'shadow-statusCard' : 'border border-solid border-accent/50'}`}
        ref={setNodeRef}
        style={style}
      >
        <Row className='cursor-grab justify-between' {...attributes} {...listeners}>
          <Col>
            <h3 className='text-lg'>Column</h3>
          </Col>
          <Col>
            <DeleteFilled className='text-failure' onClick={() => remove?.(column.id)} />
          </Col>
        </Row>

        <Divider className='my-[10px] mr-[10px]' />

        <Row className='content-center justify-between'>
          <Col className='grid place-content-center' span={3}>
            <span className='text-sm text-text'>Width:</span>
          </Col>
          <Col span={15}>
            <Slider
              className='customSlider'
              min={MIN_WIDTH}
              max={MAX_WIDTH}
              value={width}
              onChange={(value) => {
                setWidth(value);
                column.width = value;
                onChange();
              }}
              tooltip={{ formatter }}
            />
          </Col>
          <Col span={4}>
            <InputNumber
              min={MIN_WIDTH}
              max={MAX_WIDTH}
              value={width}
              onChange={(value) => {
                setWidth(value ?? MIN_WIDTH);
                column.width = value ?? MIN_WIDTH;
                onChange();
              }}
              formatter={formatter}
              className='antNumberInput w-full !border border-solid !border-accent/50 !bg-surface1 hover:!border-accent hover:!bg-surface1 [&_input]:!text-text'
            />
          </Col>
        </Row>

        <Divider className='my-[10px] mr-[10px]' />
        <div className='mb-[10px] text-sm text-text'>Tile Groups:</div>

        <Row className='justify-center'>
          <Transfer
            dataSource={groups?.map((value) => ({ ...value, key: value.key.toString() }))}
            targetKeys={targetGroups}
            selectedKeys={selectedGroups}
            onChange={onGroupChange}
            onSelectChange={onGroupSelectChange}
            render={(item) => item.title}
            oneWay
            showSearch
            className='customTransfer [&_span]:!text-text'
          />
        </Row>
      </div>
    );
  }
};

export default ConfigLayoutColumn;
