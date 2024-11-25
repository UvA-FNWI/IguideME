import { Divider, InputNumber, Slider, Transfer } from 'antd';
import { getTileGroups } from '@/api/tiles';
import type { Key } from 'antd/lib/table/interface';
import { useQuery } from '@tanstack/react-query';
import { useState, type FC, type ReactElement } from 'react';
import { type LayoutColumn } from '@/types/tile';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';

interface Props {
  column: LayoutColumn;
  handleSettingChange: (column: LayoutColumn) => void;
}

interface RecordType {
  key: number;
  title: string;
}

const ConfigLayoutColumn: FC<Props> = ({ column, handleSettingChange }): ReactElement => {
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

  const onGroupSelectChange = (source: Key[], target: Key[]): void => {
    setSelectedGroups([...source.map(String), ...target.map(String)]);
  };

  const onGroupChange = (targetKeys: Key[]): void => {
    setGroups(targetKeys.map(String));
    column.groups = targetKeys.map((key) => Number(key));
    handleSettingChange(column);
  };

  const formatter = (value: number | undefined): string => (value !== undefined ? `${value}%` : '');

  return (
    <div>
      <Slider
        className='custom-slider'
        min={0}
        max={100}
        onChange={(value: number) => {
          setWidth(value);
          column.width = value;
          handleSettingChange(column);
        }}
        tooltip={{ formatter }}
        value={width}
      />
      <InputNumber
        addonAfter='%'
        changeOnWheel
        className='antNumberInput w-full !border border-solid !border-accent/70 !bg-surface1 hover:!border-accent hover:!bg-surface2 [&_input]:!text-text'
        min={0}
        max={100}
        step={1}
        value={width}
        onChange={(value) => {
          setWidth(value ?? 0);
          column.width = value ?? 0;
          handleSettingChange(column);
        }}
      />

      <Divider className='my-[10px] mr-[10px]' />

      {isError ?
        <QueryError className='static p-0' title='Error: Failed to load tile groups' />
      : <QueryLoading isLoading={isLoading}>
          <Transfer
            dataSource={groups?.map((value) => ({ ...value, key: value.key.toString() }))}
            targetKeys={targetGroups}
            selectedKeys={selectedGroups}
            onChange={onGroupChange}
            onSelectChange={onGroupSelectChange}
            render={(item) => item.title}
            oneWay
            showSearch
            className='custom-transfer'
          />
        </QueryLoading>
      }
    </div>
  );
};

export default ConfigLayoutColumn;
