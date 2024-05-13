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
import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { LogicalExpression, type GoalRequirement, type LearningGoal } from '@/types/tile';
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Divider, Form, Input, InputNumber, Select } from 'antd';
import { useEffect, useState, type FC, type ReactElement } from 'react';
import { toast } from 'sonner';

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
        <div className='h-[100px] w-full rounded-lg bg-surface1' />
      </QueryLoading>
    );
  } else if (isError) {
    return (
      <div className='h-[100px] w-full rounded-lg bg-surface1'>
        <QueryError title='Error: Unable to load learning goals' />
      </div>
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
            className='bg-accent/30 hover:!bg-accent/70 hover:border-solid hover:!border-border1 [&_span]:!text-text'
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
    <div className='font-tnum rounded-lg border border-solid border-border0 bg-surface1 p-[10px]'>
      <div className='flex w-full justify-between'>
        <h2
          onClick={() => {
            setEditing(true);
          }}
          className='font-tnum p-1 text-lg'
        >
          {!editing ?
            goal.title
          : editing && (
              <Input
                className='w-full !border-accent !bg-surface1 text-text hover:!border-accent hover:bg-surface1 focus:!border-accent focus:shadow-sm focus:shadow-accent aria-invalid:!border-failure aria-invalid:shadow-none aria-invalid:focus:!shadow-sm aria-invalid:focus:!shadow-failure'
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
          className='p-1 text-failure'
        />
      </div>

      <Divider className='mb-2 mt-1' />

      {goal.requirements.map((requirement, index) => (
        <ViewGoalRequirement key={index} requirement={requirement} />
      ))}

      <Button
        className='bg-accent/20 border-dashed hover:!border-border1 hover:border-solid hover:!bg-accent/70 [&_span]:!text-text'
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
    <div className='font-tnum mb-[10px] w-full rounded-lg border border-solid border-border1 p-[10px]'>
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

        <div className='flex justify-between gap-2'>
          <div
            className='grid grid-cols-3 gap-1 overflow-x-auto'
            style={{ gridTemplateColumns: '300px min-content min-content' }}
          >
            <Item name='assignment_id' noStyle>
              <Select
                aria-disabled={isLoading || isError}
                className='w-full [&>div]:hover:!border-accent [&>div]:!border-accent/60 [&>div]:!bg-surface1 [&>div]:!shadow-none [&>div]:hover:!bg-surface2 [&_span]:!text-text'
                dropdownClassName='bg-surface1 [&_div]:!text-text selectionSelected'
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
                className='w-full [&>div]:hover:!border-accent [&>div]:!border-accent/60 [&>div]:!bg-surface1 [&>div]:!shadow-none [&>div]:hover:!bg-surface2 [&_span]:!text-text'
                dropdownClassName='bg-surface1 [&_div]:!text-text selectionSelected'
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
                className='antNumberInput w-12 !border border-solid !border-accent/60 !bg-surface1 hover:!border-accent hover:!bg-surface2 [&_input]:!text-text'
                aria-disabled={isLoading || isError}
                disabled={isLoading || isError}
                variant='borderless'
              />
            </Item>
          </div>
          <div className='flex gap-2'>
            <Item noStyle>
              <Button
                className='min-w-20 bg-success hover:!bg-success/80 [&_span]:text-text'
                type='primary'
                htmlType='submit'
              >
                Save
              </Button>
            </Item>
            <Button
              className='min-w-20 bg-failure hover:!bg-failure/80 [&_span]:text-text'
              type='primary'
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
