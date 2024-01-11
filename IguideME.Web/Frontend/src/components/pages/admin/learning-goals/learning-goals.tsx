import {
  deleteGoal,
  deleteRequirement,
  getAssignments,
  getLearningGoals,
  patchGoalRequirement,
  patchLearningGoal,
  postGoalRequirement,
  postLearningGoal,
} from "@/api/entries";
import AdminTitle from "@/components/atoms/admin-titles/admin-titles";
import {
  LogicalExpression,
  type LearningGoal,
  type GoalRequirement,
} from "@/types/tile";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
} from "antd";
import { useState, type FC, type ReactElement } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import "./style.scss";
import Loading from "@/components/particles/loading";
import { useForm } from "antd/es/form/Form";

const { Item } = Form;

interface GoalProps {
  goal: LearningGoal;
}

interface ReqProps {
  requirement: GoalRequirement;
}
const LearningGoals: FC = (): ReactElement => {
  const { data: goals } = useQuery("learning-goals", getLearningGoals);

  const queryClient = useQueryClient();
  const { mutate: postGoal } = useMutation({
    mutationFn: postLearningGoal,
    onSuccess: async () => {
      await queryClient.invalidateQueries("learning-goals");
    },
  });

  const addGoal = (): void => {
    postGoal({
      id: -1,
      title: "New Goal",
      requirements: [],
    });
  };
  return (
    <div>
      <AdminTitle
        title="Learning Goals"
        description="Configure the learning goals for the course."
      />
      {goals === undefined ? (
        <Loading />
      ) : (
        goals.map((goal) => <ViewLearningGoal key={goal.id} goal={goal} />)
      )}
      <Button type="dashed" onClick={addGoal} block icon={<PlusOutlined />}>
        Add Goal
      </Button>
    </div>
  );
};

const ViewLearningGoal: FC<GoalProps> = ({ goal }): ReactElement => {
  const [title, setTitle] = useState<string>(goal.title);
  const [editing, setEditing] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const { mutate: patchGoal } = useMutation({
    mutationFn: patchLearningGoal,
    onSuccess: async () => {
      await queryClient.invalidateQueries("learning-goals");
    },
  });
  const { mutate: removeGoal } = useMutation({
    mutationFn: deleteGoal,
    onSuccess: async () => {
      await queryClient.invalidateQueries("learning-goals");
    },
  });

  const { mutate: postRequirement } = useMutation({
    mutationFn: postGoalRequirement,
    onSuccess: async () => {
      await queryClient.invalidateQueries("learning-goals");
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
    <div className="learningGoal">
      <Row align="middle" justify="space-between">
        <Col style={{ cursor: "text" }}>
          <h2
            onClick={() => {
              setEditing(true);
            }}
            style={{ padding: 5 }}
          >
            {!editing
              ? goal.title
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
                      if (e.key !== "Enter") return;
                      patchGoal({ ...goal, title });
                      setEditing(false);
                    }}
                  />
                )}
          </h2>
        </Col>
        <Col>
          <DeleteFilled
            onClick={() => {
              removeGoal(goal.id);
            }}
            style={{ padding: 5 }}
          />
        </Col>
      </Row>
      <Divider style={{ margin: "5px 0px 8px 0px" }} />
      <Row>
        <Col style={{ width: "100%" }}>
          {goal.requirements.map((requirement) => (
            <ViewGoalRequirement
              key={requirement.id}
              requirement={requirement}
            />
          ))}
          <Button
            type="dashed"
            onClick={addRequirement}
            block
            icon={<PlusOutlined />}
          >
            Add Requirement
          </Button>
        </Col>
      </Row>
    </div>
  );
};

const ViewGoalRequirement: FC<ReqProps> = ({ requirement }): ReactElement => {
  const queryClient = useQueryClient();

  const { data: assignments } = useQuery("assignments", getAssignments);
  const { mutate: saveRequirement } = useMutation({
    mutationFn: patchGoalRequirement,
    onSuccess: async () => {
      await queryClient.invalidateQueries("learning-goals");
    },
  });

  const { mutate: removeRequirement } = useMutation({
    mutationFn: deleteRequirement,
    onSuccess: async () => {
      await queryClient.invalidateQueries("learning-goals");
    },
  });
  console.log(assignments);
  return (
    <div className="goalRequirement">
      <Form<GoalRequirement>
        name={`goal_requirement_form_${requirement.id}`}
        initialValues={requirement}
        onFinish={(data: GoalRequirement) => {
          saveRequirement(data);
        }}
        requiredMark={false}
        style={{ width: "100%" }}
      >
        <Row gutter={20}>
          <Item name="id" hidden>
            <Input type="hidden" />
          </Item>
          <Item name="goal_id" hidden>
            <Input type="hidden" />
          </Item>
          <Col span={6}>
            <Item name="assignment_id" noStyle>
              <Select
                style={{ width: "100%" }}
                showSearch
                optionFilterProp="label"
                options={
                  assignments === undefined
                    ? []
                    : [...assignments.values()].map((ass) => ({
                        value: ass.id,
                        label: ass.title,
                      }))
                }
              />
            </Item>
          </Col>
          <Col span={2}>
            <Item name="expression" noStyle>
              <Select
                style={{ width: "100%" }}
                options={[
                  {
                    value: LogicalExpression.Equal,
                    label: "=",
                  },
                  {
                    value: LogicalExpression.Greater,
                    label: ">",
                  },
                  {
                    value: LogicalExpression.GreaterEqual,
                    label: "≥",
                  },
                  {
                    value: LogicalExpression.Less,
                    label: "<",
                  },
                  {
                    value: LogicalExpression.LessEqual,
                    label: "≤",
                  },
                  {
                    value: LogicalExpression.NotEqual,
                    label: "≠",
                  },
                ]}
              />
            </Item>
          </Col>
          <Col span={4}>
            <Item name="value" noStyle>
              <InputNumber />
            </Item>
          </Col>
          <Col offset={8} span={4}>
            <Space>
              <Item noStyle>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Item>
              <Button
                type="primary"
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
