import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { Button, Col, Divider, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import {
  deleteLearningGoal,
  deleteRequirement,
  getAssignments,
  getLearningGoals,
  patchGoalRequirement,
  patchLearningGoal,
  postGoalRequirement,
  postLearningGoal,
} from '@/api/entries';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LogicalExpression, type LearningGoal, type GoalRequirement } from '@/types/tile';
import { useEffect, useState, type FC, type ReactElement } from 'react';

const { Item } = Form;

interface GoalProps {
  goal: LearningGoal;
}

interface ReqProps {
  requirement: GoalRequirement;
}
const LearningGoals: FC = (): ReactElement => {
  const {
    data: goals,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['learning-goals'],
    queryFn: getLearningGoals,
  });

  const queryClient = useQueryClient();
  const { mutate: postGoal } = useMutation({
    mutationFn: postLearningGoal,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['learning-goals'] });
    },
  });

  const addGoal = (): void => {
    postGoal({
      id: -1,
      title: 'New Goal',
      requirements: [],
    });
  };

  if (isLoading) {
    return (
      <QueryLoading isLoading={isLoading}>
        <article className='w-full h-[100px] rounded-lg' />
      </QueryLoading>
    );
  } else if (isError) {
    return (
      <article className='w-full h-[100px] rounded-lg'>
        <QueryError title='Error: Unable to load learning goals' />
      </article>
    );
  } else {
    return (
      <>
        <AdminTitle title='Learning Goals' description='Configure the learning goals for the course.' />
        {goals?.map((goal) => <ViewLearningGoal key={goal.id} goal={goal} />)}
        <Button type='dashed' onClick={addGoal} block icon={<PlusOutlined />} className='bg-white'>
          Add Goal
        </Button>
      </>
    );
  }
};

const ViewLearningGoal: FC<GoalProps> = ({ goal }): ReactElement => {
  const [title, setTitle] = useState<string>(goal.title);
  const [editing, setEditing] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const { mutate: patchGoal } = useMutation({
    mutationFn: patchLearningGoal,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['learning-goals'] });
    },
  });
  const { mutate: removeGoal } = useMutation({
    mutationFn: deleteLearningGoal,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['learning-goals'] });
    },
  });

  const { mutate: postRequirement } = useMutation({
    mutationFn: postGoalRequirement,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['learning-goals'] });
    },
  });

  const addRequirement = (): void => {
    postRequirement({
      id: -1,
      goal_id: goal.id,
      assignment_id: -1,
      value: 55,
      expression: LogicalExpression.GreaterEqual,
    });
  };

  return (
    <div className='font-tnum p-[10px] border border-dashed border-zinc-400 rounded-lg bg-white mb-[10px] min-h-[100px]'>
      <Row className='content-center justify-between'>
        <Col className='cursor-text'>
          <h2
            onClick={() => {
              setEditing(true);
            }}
            className='p-1 font-tnum text-lg'
          >
            {!editing ?
              goal.title
            : editing && (
                <Input
                  value={title}
                  autoFocus
                  onBlur={() => {
                    setEditing(false);
                  }}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter') return;
                    patchGoal({ ...goal, title });
                    setEditing(false);
                  }}
                />
              )
            }
          </h2>
        </Col>
        <Col>
          <DeleteFilled
            onClick={() => {
              removeGoal(goal.id);
            }}
            className='p-1'
          />
        </Col>
      </Row>
      <Divider className='mt-1 mb-2' />
      <Row>
        <Col className='w-full'>
          {goal.requirements.map((requirement, index) => (
            <ViewGoalRequirement key={index} requirement={requirement} />
          ))}
          <Button type='dashed' onClick={addRequirement} block icon={<PlusOutlined />}>
            Add Requirement
          </Button>
        </Col>
      </Row>
    </div>
  );
};

const ViewGoalRequirement: FC<ReqProps> = ({ requirement }): ReactElement => {
  const queryClient = useQueryClient();

  const {
    data: assignments,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['assignments'],
    queryFn: getAssignments,
  });

  const { mutate: saveRequirement } = useMutation({
    mutationFn: patchGoalRequirement,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['learning-goals'] });
    },
  });

  const { mutate: removeRequirement } = useMutation({
    mutationFn: deleteRequirement,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['learning-goals'] });
    },
  });

  const [form] = Form.useForm<GoalRequirement>();
  useEffect(() => {
    if (!isLoading && !isError) {
      form.setFieldsValue(requirement);
    } else {
      form.resetFields();
    }
  }, [isLoading, isError, requirement, form]);

  return (
    <div className='font-tnum w-full p-[10px] border border-solid border-zinc-200 rounded-lg mb-[10px]'>
      <Form<GoalRequirement>
        form={form}
        name={`goal_requirement_form_${requirement.id}`}
        initialValues={{}}
        onFinish={(data: GoalRequirement) => {
          if (isError || isLoading) return;
          saveRequirement(data);
        }}
        requiredMark={false}
        className='w-full'
      >
        <Row gutter={20}>
          <Item name='id' hidden>
            <Input type='hidden' />
          </Item>
          <Item name='goal_id' hidden>
            <Input type='hidden' />
          </Item>
          <Col span={6}>
            <Item name='assignment_id' noStyle>
              <Select
                aria-disabled={isLoading || isError}
                className='w-full'
                disabled={isLoading || isError}
                showSearch
                optionFilterProp='label'
                options={
                  assignments === undefined ?
                    []
                  : [...assignments.values()].map((ass) => ({
                      value: ass.id,
                      label: ass.title,
                    }))
                }
                placeholder={
                  isLoading ? 'Loading assignments ...'
                  : isError ?
                    'Failed to load assignments'
                  : undefined
                }
              />
            </Item>
          </Col>
          <Col span={2}>
            <Item name='expression' noStyle>
              <Select
                aria-disabled={isLoading || isError}
                className='w-full'
                disabled={isLoading || isError}
                options={[
                  {
                    value: LogicalExpression.Equal,
                    label: '=',
                  },
                  {
                    value: LogicalExpression.Greater,
                    label: '>',
                  },
                  {
                    value: LogicalExpression.GreaterEqual,
                    label: '≥',
                  },
                  {
                    value: LogicalExpression.Less,
                    label: '<',
                  },
                  {
                    value: LogicalExpression.LessEqual,
                    label: '≤',
                  },
                  {
                    value: LogicalExpression.NotEqual,
                    label: '≠',
                  },
                ]}
              />
            </Item>
          </Col>
          <Col span={4}>
            <Item name='value' noStyle>
              <InputNumber aria-disabled={isLoading || isError} disabled={isLoading || isError} />
            </Item>
          </Col>
          <Col offset={8} span={4}>
            <Space>
              <Item noStyle>
                <Button className='text-white bg-primary-blue' type='primary' htmlType='submit'>
                  Save
                </Button>
              </Item>
              <Button
                type='primary'
                danger
                onClick={() => {
                  removeRequirement(requirement.id);
                }}
              >
                Delete
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default LearningGoals;
