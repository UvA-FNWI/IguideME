import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { CheckOutlined, CloseOutlined, DeleteFilled } from '@ant-design/icons';
import { Form, Select, Switch, Table } from 'antd';
import { getTopics } from '@/api/entries';
import { useQuery } from '@tanstack/react-query';
import { type Discussion, type TileEntry } from '@/types/tile';
import { useCallback, useState, type FC, type ReactElement } from 'react';

const { Item } = Form;

const EditTileDiscussions: FC = (): ReactElement => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['topics'],
    queryFn: getTopics,
  });

  if (isError) return <QueryError className='static [&_span]:!text-2xl' title={'Error: Could not load discussions'} />;

  return (
    <>
      <p className='mb-1'>Discussions:</p>
      <div className='col-span-2'>
        <Item name='alt' noStyle valuePropName='checked'>
          <Switch className='float-end' checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
        </Item>
      </div>
      <div className='col-span-3'>
        <QueryLoading isLoading={isLoading}>
          <Item name='entries' className='w-full m-0'>
            <DiscussionSelect topics={data ?? []} value={[]} onChange={() => {}} />
          </Item>
        </QueryLoading>
      </div>
    </>
  );
};

type DiscussionSelectProps = {
  topics: Discussion[];
  value: TileEntry[];
  onChange: (value: TileEntry[]) => void;
};

const DiscussionSelect: FC<DiscussionSelectProps> = ({
  topics,
  value: entries,
  onChange: setEntries,
}): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedTopics, setSelectedTopics] = useState<number[]>(entries.map((entry) => entry.content_id));

  const unselectedTopics: Discussion[] = [...topics.values()].filter((top) => {
    return !selectedTopics.some((sel) => sel === top.id);
  });

  const onSelectChange = useCallback(
    (selected: number[]): void => {
      setOpen(false);
      setSelectedTopics(selected);
      setEntries(
        selected.map((id) => {
          const top = topics.find((disc) => disc.id === id);
          return {
            title: top!.title,
            tile_id: -1, // Set the correct id on the backend
            weight: 0,
            content_id: id,
          };
        }),
      );
    },
    [topics],
  );

  const removeEntry = (rid: number): void => {
    setSelectedTopics(selectedTopics.filter((id) => id !== rid));
    setEntries(entries.filter((e) => e.content_id !== rid));
  };

  const format = new Intl.DateTimeFormat(navigator.language, { dateStyle: 'short', timeStyle: 'short' });

  return (
    <div className='flex flex-col gap-1'>
      <Table
        className='[&_th]:!bg-cardBackground [&_th]:!text-text [&_td]:!bg-dropdownBackground [&_td]:!text-text [&_div]:!text-text'
        columns={[
          {
            title: 'Name',
            dataIndex: 'title',
            key: 'title',
          },
          {
            title: 'Author',
            dataIndex: 'author',
            key: 'author',
            align: 'center',
            render: (_: string, entry: TileEntry) => {
              const topic = topics.find((top) => top.id === entry.content_id);
              return topic?.author;
            },
          },
          {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            align: 'center',
            render: (_: string, entry: TileEntry) => {
              const topic = topics.find((top) => top.id === entry.content_id);
              if (topic !== undefined) return format.format(new Date(topic.date * 1000));
            },
          },
          {
            title: '',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            render: (_: string, entry: TileEntry) => {
              return (
                <DeleteFilled
                  className='text-primary-red'
                  onClick={() => {
                    removeEntry(entry.content_id);
                  }}
                />
              );
            },
          },
        ]}
        pagination={false}
        dataSource={entries.sort((a, b) => a.title.localeCompare(b.title))}
        rowKey='content_id'
      />

      <Select
        className='w-full [&>div]:!bg-cardBackground [&>div]:!border-primary-500 [&>div]:hover:!bg-dropdownBackground [&_span]:!text-text'
        dropdownClassName='bg-dropdownBackground [&_div]:!text-text selectionSelected'
        value={selectedTopics}
        mode='multiple'
        options={unselectedTopics?.map((ass) => ({
          value: ass.id,
          label: ass.title,
        }))}
        open={open}
        onDropdownVisibleChange={(visible) => {
          setOpen(visible);
        }}
        onChange={onSelectChange}
        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        tagRender={() => <></>}
        onInputKeyDown={(event) => {
          if (event.key === 'Backspace') {
            event.stopPropagation();
          }
        }}
      />
    </div>
  );
};
export default EditTileDiscussions;
