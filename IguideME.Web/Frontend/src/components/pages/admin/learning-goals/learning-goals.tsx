import { getLearningGoals, postLearningGoal } from "@/api/entries";
import AdminTitle from "@/components/atoms/admin-titles/admin-titles";
import { LearningGoal } from "@/types/tile";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { type FC, type ReactElement } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

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
      {goals?.map((goal) => <ViewLearningGoal key={goal.id} goal={goal} />)}
      <Button type="dashed" onClick={addGoal} block icon={<PlusOutlined />}>
        Add Goal
      </Button>
    </div>
  );
};

interface Props {
  goal: LearningGoal;
}
const ViewLearningGoal: FC<Props> = ({ goal }): ReactElement => {
  return <div>{goal.title}</div>;
};

export default LearningGoals;
