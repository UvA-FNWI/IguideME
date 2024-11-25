import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { App, Button, Divider, Form, Input, InputNumber, Select } from 'antd';
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
import { LogicalExpression, type GoalRequirement, type LearningGoal } from '@/types/tile';
import { useEffect, useMemo, type FC, type ReactElement } from 'react';
import EditTitle from '@/components/crystals/edit-title/edit-title';

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

  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const { mutate: postGoal } = useMutation({
    mutationFn: postLearningGoal,

    onMutate: () => {
      void message.open({
        key: 'goal-add',
        type: 'loading',
        content: 'Adding learning goal...',
      });
    },

    onError: () => {
      void message.open({
        key: 'goal-add',
        type: 'error',
        content: 'Error adding learning goal',
        duration: 3,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['learning-goals'] });

      void message.open({
        key: 'goal-add',
        type: 'success',
        content: 'Learning goal added successfully',
        duration: 3,
      });
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
            className='bg-accent/30 hover:border-solid hover:!border-border1 hover:!bg-accent/70 [&_span]:!text-text'
          >
            Add Goal
          </Button>
        </div>
      </>
    );
  }
};

const ViewLearningGoal: FC<GoalProps> = ({ goal }): ReactElement => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  const { mutate: patchGoal } = useMutation({
    mutationFn: patchLearningGoal,

    onMutate: () => {
      void message.open({
        key: 'goal-title',
        type: 'loading',
        content: 'Saving title...',
      });
    },

    onError: () => {
      void message.open({
        key: 'goal-title',
        type: 'error',
        content: 'Error saving title',
        duration: 3,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['learning-goals'] });

      void message.open({
        key: 'goal-title',
        type: 'success',
        content: 'Title saved successfully',
        duration: 3,
      });
    },
  });

  const { mutate: removeGoal } = useMutation({
    mutationFn: deleteLearningGoal,

    onMutate: () => {
      void message.open({
        key: 'goal-delete',
        type: 'loading',
        content: 'Deleting learning goal...',
      });
    },

    onError: () => {
      void message.open({
        key: 'goal-delete',
        type: 'error',
        content: 'Error deleting learning goal',
        duration: 3,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['learning-goals'] });

      void message.open({
        key: 'goal-delete',
        type: 'success',
        content: 'Learning goal deleted successfully',
        duration: 3,
      });
    },
  });

  const { mutate: postRequirement } = useMutation({
    mutationFn: postGoalRequirement,

    onMutate: () => {
      void message.open({
        key: 'requirement-add',
        type: 'loading',
        content: 'Adding requirement...',
      });
    },

    onError: () => {
      void message.open({
        key: 'requirement-add',
        type: 'error',
        content: 'Error adding requirement',
        duration: 3,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['learning-goals'] });

      void message.open({
        key: 'requirement-add',
        type: 'success',
        content: 'Requirement added successfully',
        duration: 3,
      });
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
        <EditTitle
          title={goal.title}
          onSave={(title: string) => {
            patchGoal({ ...goal, title });
          }}
        />
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
        className='border-dashed bg-accent/20 hover:border-solid hover:!border-border1 hover:!bg-accent/70 [&_span]:!text-text'
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

  const { message } = App.useApp();

  const { mutate: saveRequirement } = useMutation({
    mutationFn: patchGoalRequirement,

    onMutate: () => {
      void message.open({
        key: 'requirement-save',
        type: 'loading',
        content: 'Saving requirement...',
      });
    },

    onError: () => {
      void message.open({
        key: 'requirement-save',
        type: 'error',
        content: 'Error saving requirement',
        duration: 3,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['learning-goals'] });

      void message.open({
        key: 'requirement-save',
        type: 'success',
        content: 'Requirement saved successfully',
        duration: 3,
      });
    },
  });

  const { mutate: removeRequirement } = useMutation({
    mutationFn: deleteRequirement,

    onMutate: () => {
      void message.open({
        key: 'requirement-delete',
        type: 'loading',
        content: 'Deleting requirement...',
      });
    },

    onError: () => {
      void message.open({
        key: 'requirement-delete',
        type: 'error',
        content: 'Error deleting requirement',
        duration: 3,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['learning-goals'] });

      void message.open({
        key: 'requirement-delete',
        type: 'success',
        content: 'Requirement deleted successfully',
        duration: 3,
      });
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

  const selectOptions = useMemo(() => {
    if (assignments === undefined) return [];

    return [...assignments.values()].map((ass) => ({
      value: ass.id,
      label: ass.title,
    }));
  }, [assignments]);

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

        <div className='flex flex-col justify-between gap-2 md:flex-row'>
          <div
            className='grid grid-cols-3 gap-1 overflow-x-auto'
            style={{ gridTemplateColumns: '300px min-content min-content' }}
          >
            <Item
              name='assignment_id'
              noStyle
              getValueProps={(value) => ({
                value: value === -1 ? undefined : value,
              })}
              getValueFromEvent={(value) => (value === undefined ? -1 : value)}
            >
              <Select
                aria-disabled={isLoading || isError}
                className='w-full [&>div]:!border-accent/60 [&>div]:!bg-surface1 [&>div]:!shadow-none [&>div]:hover:!border-accent [&>div]:hover:!bg-surface2 [&_span]:!text-text'
                dropdownClassName='bg-surface1 [&_div]:!text-text selectionSelected'
                disabled={isLoading || isError}
                showSearch
                optionFilterProp='label'
                options={selectOptions}
                placeholder={
                  isLoading ? 'Loading assignments ...'
                  : isError ?
                    'Failed to load assignments'
                  : 'Please select an assignment'
                }
              />
            </Item>

            <Item name='expression' noStyle>
              <Select
                aria-disabled={isLoading || isError}
                className='w-full [&>div]:!border-accent/60 [&>div]:!bg-surface1 [&>div]:!shadow-none [&>div]:hover:!border-accent [&>div]:hover:!bg-surface2 [&_span]:!text-text'
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
