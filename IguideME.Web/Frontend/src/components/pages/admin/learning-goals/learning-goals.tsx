import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { Button, Divider, Form, Input, InputNumber, Select } from 'antd';
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
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LogicalExpression, type GoalRequirement, type LearningGoal } from '@/types/tile';
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
        <div className='flex flex-col gap-2'>
          {goals?.map((goal) => <ViewLearningGoal key={goal.id} goal={goal} />)}
          <Button
            type='dashed'
            onClick={addGoal}
            block
            icon={<PlusOutlined />}
            className='bg-cardBackground hover:!bg-dropdownBackground hover:!border-primary-500 [&_span]:!text-text'
          >
            Add Goal
          </Button>
        </div>
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
    <div className='font-tnum p-[10px] border border-dashed border-text rounded-lg bg-cardBackground'>
      <div className='w-full flex justify-between'>
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
                className='!border-primary-500 hover:!border-primary-500 !bg-cardBackground hover:!bg-dropdownBackground text-text'
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
        <DeleteFilled
          onClick={() => {
            removeGoal(goal.id);
          }}
          className='p-1 text-primary-red'
        />
      </div>

      <Divider className='mt-1 mb-2' />

      {goal.requirements.map((requirement, index) => (
        <ViewGoalRequirement key={index} requirement={requirement} />
      ))}

      <Button
        className='bg-cardBackground hover:!bg-dropdownBackground hover:!border-primary-500 [&_span]:!text-text'
        type='dashed'
        onClick={addRequirement}
        block
        icon={<PlusOutlined />}
      >
        Add Requirement
      </Button>
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

  const { mutate: saveRequirement, status: saveStatus } = useMutation({
    mutationFn: patchGoalRequirement,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['learning-goals'] });
    },
  });

  const { mutate: removeRequirement, status: deleteStatus } = useMutation({
    mutationFn: deleteRequirement,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['learning-goals'] });
    },
  });

  useEffect(() => {
    if (saveStatus === 'success') {
      toast.success('Requirement saved successfully', {
        closeButton: true,
      });
    } else if (saveStatus === 'error') {
      toast.error('Error saving requirement', {
        closeButton: true,
      });
    }
  }, [saveStatus]);

  useEffect(() => {
    if (deleteStatus === 'success') {
      toast.success('Requirement deleted successfully', {
        closeButton: true,
      });
    } else if (deleteStatus === 'error') {
      toast.error('Error deleting requirement', {
        closeButton: true,
      });
    }
  }, [deleteStatus]);

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
        <Item name='id' hidden>
          <Input type='hidden' />
        </Item>
        <Item name='goal_id' hidden>
          <Input type='hidden' />
        </Item>

        <div className='flex flex-col gap-2'>
          <div
            className='grid grid-cols-3 gap-1 overflow-x-auto'
            style={{ gridTemplateColumns: '300px min-content min-content' }}
          >
            <Item name='assignment_id' noStyle>
              <Select
                aria-disabled={isLoading || isError}
                className='w-full [&>div]:!bg-cardBackground [&>div]:!border-primary-500 [&>div]:hover:!bg-dropdownBackground [&_span]:!text-text'
                dropdownClassName='bg-dropdownBackground [&_div]:!text-text selectionSelected'
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

            <Item name='expression' noStyle>
              <Select
                aria-disabled={isLoading || isError}
                className='w-full [&>div]:!bg-cardBackground [&>div]:!border-primary-500 [&>div]:hover:!bg-dropdownBackground [&_span]:!text-text'
                dropdownClassName='bg-dropdownBackground [&_div]:!text-text selectionSelected'
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

            <Item name='value' noStyle>
              <InputNumber
                className='w-12 !border-primary-500 hover:!border-primary-500 !bg-cardBackground hover:!bg-dropdownBackground [&_input]:!text-text antNumberInput'
                aria-disabled={isLoading || isError}
                disabled={isLoading || isError}
              />
            </Item>
          </div>
          <div className='flex gap-2'>
            <Item noStyle>
              <Button
                className='min-w-20 bg-primary-500 hover:!bg-primary-600 [&_span]:text-text'
                type='primary'
                htmlType='submit'
              >
                Save
              </Button>
            </Item>
            <Button
              className='min-w-20 bg-primary-red hover:!bg-red-400 [&_span]:text-text'
              type='primary'
              danger
              onClick={() => {
                removeRequirement(requirement.id);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};
export default LearningGoals;
