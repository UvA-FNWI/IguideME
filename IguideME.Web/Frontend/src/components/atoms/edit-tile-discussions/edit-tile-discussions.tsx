import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { CheckOutlined, CloseOutlined, DeleteFilled } from '@ant-design/icons';
import { Form, Input, Select, Switch, Table } from 'antd';
import { getTopics } from '@/api/entries';
import { useQuery } from '@tanstack/react-query';
import { useWatch } from 'antd/es/form/Form';
import { PublilshedStatus, type DiscussionTopic, type TileEntry } from '@/types/tile';
import { useCallback, useState, type FC, type ReactElement } from 'react';

const EditTileDiscussions: FC = (): ReactElement => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['topics'],
    queryFn: getTopics,
  });

  if (isError) return <QueryError className='static [&_span]:!text-2xl' title={'Error: Could not load discussions'} />;

  const alt: boolean = useWatch('alt');

  return (
    <>
      <Form.Item name='gradingType' hidden>
        <Input type='hidden' />
      </Form.Item>
      <p className='mb-1'>Discussions:</p>
      <div className='col-span-2'>
        <p className='float-end'>
          Count all:{' '}
          <Form.Item name='alt' noStyle valuePropName='checked'>
            <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
          </Form.Item>
        </p>
      </div>
      {!alt && (
        <div className='col-span-3'>
          <QueryLoading isLoading={isLoading}>
            <Form.Item name='entries' className='m-0 w-full'>
              <DiscussionSelect topics={data ?? []} value={[]} onChange={() => {}} />
            </Form.Item>
          </QueryLoading>
        </div>
      )}
    </>
  );
};

interface DiscussionSelectProps {
  topics: DiscussionTopic[];
  value: TileEntry[];
  onChange: (value: TileEntry[]) => void;
}

const DiscussionSelect: FC<DiscussionSelectProps> = ({
  topics,
  value: entries,
  onChange: setEntries,
}): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedTopics, setSelectedTopics] = useState<number[]>(entries.map((entry) => entry.content_id));

  const unselectedTopics: DiscussionTopic[] = [...topics.values()].filter((top) => {
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
            title: top ? top.title : 'No title found',
            html_url: top ? top.html_url : '',
            published: PublilshedStatus.LMSPublished,
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
        className='[&_div]:!text-text [&_td]:!bg-surface1 [&_td]:!text-text [&_th]:!bg-surface1 [&_th]:!text-text'
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
                  className='text-failure'
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
        className='[&>div]:!border-accent/70 [&>div]:!bg-surface1 [&>div]:hover:!border-accent [&>div]:hover:!bg-surface2 [&_span]:!text-text w-full [&>div]:!shadow-none'
        dropdownClassName='bg-surface1 [&_div]:!text-text selectionSelected'
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
