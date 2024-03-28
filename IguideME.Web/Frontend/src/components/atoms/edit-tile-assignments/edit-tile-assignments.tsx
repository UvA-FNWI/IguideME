import Loading from '@/components/particles/loading';
import { CheckCircleTwoTone, CloseCircleTwoTone, DeleteFilled } from '@ant-design/icons';
import { Col, Form, InputNumber, Row, Select, Table } from 'antd';
import { getAssignments } from '@/api/entries';
import { useQuery } from 'react-query';
import { useState, type FC, type ReactElement } from 'react';

import { GradingType, type Assignment, type TileEntry, printGradingType } from '@/types/tile';

const { Item } = Form;

const EditTileAssignments: FC = (): ReactElement => {
  const { data: assignments } = useQuery('assignments', getAssignments);
  return (
    <>
      <Row className="content-center">
        <Col span={4} className="grid items-center">
          Grading:
        </Col>
        <Col span={8}>
          <Item name="gradingType" noStyle>
            <Select
              options={Object.entries(GradingType)
                .filter((key, _) => isNaN(Number(key[0])))
                .map((_, val) => ({
                  value: val,
                  label: printGradingType(val),
                }))}
              className="w-full"
            />
          </Item>
        </Col>
        <Col span={4} offset={1} className="grid items-center">
          Weight:
        </Col>
        <Col span={7}>
          <Item name="weight" noStyle>
            <InputNumber<number>
              className="w-full"
              formatter={(value) => `${(value ?? 0) * 100}%`}
              parser={(value) => +parseFloat(value!.replace('%', '')).toFixed(1) / 100}
            />
          </Item>
        </Col>
      </Row>
      <Row>
        <p className="mb-1">Assignments:</p>
        <Item name="entries" className="w-full m-0">
          {assignments === undefined ? <Loading /> : <SelectAssignments assignments={assignments} />}
        </Item>
      </Row>
    </>
  );
};

interface SelectProps {
  value?: TileEntry[];
  onChange?: (value: TileEntry[]) => void;
  assignments: Map<number, Assignment>;
}

const SelectAssignments: FC<SelectProps> = ({ value: entries, onChange, assignments }): ReactElement => {
  if (entries === undefined) {
    return <Loading />;
  }

  const [selectedAssignments, setSelectedAssignments] = useState<number[]>(entries.map((entry) => entry.content_id));
  const [open, setOpen] = useState<boolean>(false);
  const unselectedAssignments: Assignment[] = [...assignments.values()].filter((ass) => {
    return !selectedAssignments.some((sel) => sel === ass.id);
  });

  const onSelectChange = (selected: number[]): void => {
    setOpen(false);
    setSelectedAssignments(selected);
    onChange?.(
      selected.map((id) => {
        const ass = assignments.get(id);
        return {
          title: ass!.title,
          tile_id: -1, // Set the correct id on the backend
          weight: 0,
          content_id: id,
        };
      }),
    );
  };

  const changeWeight = (entry: TileEntry, weight: number | null): void => {
    if (weight === null) {
      return;
    }
    onChange?.([...entries.filter((e) => e.content_id !== entry.content_id), { ...entry, weight }]);
  };

  const removeEntry = (rid: number): void => {
    setSelectedAssignments(selectedAssignments.filter((id) => id !== rid));
    onChange?.(entries.filter((e) => e.content_id !== rid));
  };

  return (
    <div className="flex flex-col gap-1">
      <Table
        columns={[
          {
            title: 'Name',
            dataIndex: 'title',
            key: 'title',
          },
          {
            title: 'Published',
            dataIndex: 'published',
            key: 'published',
            align: 'center',
            render: (_: string, entry: TileEntry) => {
              const assignment = assignments.get(entry.content_id);
              return assignment !== undefined && assignment.published ? (
                <CheckCircleTwoTone twoToneColor="rgb(55, 212, 63)" />
              ) : (
                <CloseCircleTwoTone twoToneColor="Red" />
              );
            },
          },
          {
            title: 'Grading',
            dataIndex: 'grading',
            key: 'grading',
            align: 'center',
            render: (_: string, entry: TileEntry) => {
              const assignment = assignments.get(entry.content_id);
              if (assignment !== undefined) {
                return printGradingType(assignment?.grading_type);
              }
            },
          },
          {
            title: 'Weight',
            dataIndex: 'weight',
            key: 'weight',
            align: 'center',
            render: (_: string, entry: TileEntry) => {
              return (
                <InputNumber
                  value={entry.weight}
                  onChange={(val) => {
                    changeWeight(entry, val);
                  }}
                  formatter={(value) => `${(value ?? 0) * 100}%`}
                  parser={(value) => +parseFloat(value!.replace('%', '')).toFixed(1) / 100}
                />
              );
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
        rowKey="content_id"
      />

      <Select
        value={selectedAssignments}
        mode="multiple"
        options={unselectedAssignments?.map((ass) => ({
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

export default EditTileAssignments;
