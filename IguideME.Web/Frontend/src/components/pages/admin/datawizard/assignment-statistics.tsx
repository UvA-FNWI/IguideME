import { getExternalAssignmentSubmissions } from '@/api/entries';
import { GradingType } from '@/types/grades';
import type { Assignment } from '@/types/tile';
import { useQuery } from '@tanstack/react-query';
import { Card } from 'antd';
import { type FC, useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

function convertGrade(grade: string | number): number {
  if (typeof grade === 'number') return grade;

  switch (grade) {
    case 'A':
      return 100;
    case 'A-':
      return 93;
    case 'B+':
      return 89;
    case 'B':
      return 86;
    case 'B-':
      return 83;
    case 'C+':
      return 79;
    case 'C':
      return 76;
    case 'C-':
      return 73;
    case 'D+':
      return 69;
    case 'D':
      return 66;
    case 'D-':
      return 63;
    case 'F':
      return 60;
    default:
      return 0;
  }
}

interface ExternalAssignmentStatisticsProps {
  assignment: Assignment;
}

const ExternalAssignmentStatistics: FC<ExternalAssignmentStatisticsProps> = ({ assignment }) => {
  const { data: submissions, isLoading } = useQuery({
    queryKey: [`external-assignment-${assignment.id}`, 'submissions'],
    queryFn: async () => await getExternalAssignmentSubmissions(assignment.id),
  });

  const chartData = useMemo(() => {
    if (!submissions) return [];

    const data = Array.from({ length: 11 }, (_, i) => ({
      grade: i,
      failed: 0,
      passed: 0,
    }));

    submissions.forEach(({ grade }) => {
      let viewingGrade: number;
      if (assignment.grading_type === GradingType.Letters) {
        viewingGrade = convertGrade(grade) / 10;
      } else if (assignment.grading_type === GradingType.Points) {
        viewingGrade = (grade / 100) * assignment.max_grade;
      } else {
        viewingGrade = grade / 10;
      }

      const existingGrade = data.find((d) => d.grade === Math.round(viewingGrade));
      if (existingGrade) {
        if (viewingGrade < 5.5) {
          existingGrade.failed += 1;
        } else {
          existingGrade.passed += 1;
        }
      } else {
        data.push({
          grade: Math.round(viewingGrade),
          failed: viewingGrade < 5.5 ? 1 : 0,
          passed: viewingGrade >= 5.5 ? 1 : 0,
        });
      }
    });

    return data;
  }, [submissions, assignment.grading_type, assignment.max_grade]);

  const statistics = useMemo(() => {
    if (!submissions || submissions.length === 0) return;

    const grades = submissions.map((submission) => {
      if (assignment.grading_type === GradingType.Letters) {
        return convertGrade(submission.grade) / 10;
      } else if (assignment.grading_type === GradingType.Points) {
        return (submission.grade / 100) * assignment.max_grade;
      } else {
        return submission.grade / 10;
      }
    });

    const average = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;

    if (grades.length === 1) {
      return { average, stdDev: 0, skewness: 0 };
    }

    const stdDev = Math.sqrt(grades.reduce((sum, grade) => sum + Math.pow(grade - average, 2), 0) / grades.length);
    const skewness = grades.reduce((sum, grade) => sum + Math.pow((grade - average) / stdDev, 3), 0) / grades.length;

    return { average: average.toFixed(2), stdDev: stdDev.toFixed(2), skewness: skewness.toFixed(2) };
  }, [submissions, assignment.grading_type, assignment.max_grade]);

  if (assignment.max_grade === 0 && assignment.grading_type === GradingType.Points) {
    return <p>This assignment has no maximum grade.</p>;
  }

  if (assignment.grading_type === GradingType.NotGraded) {
    return <p>This assignment is not graded.</p>;
  }

  return (
    <div className='flex items-center justify-between gap-8'>
      <Card loading={isLoading} size='small' title={<h5 className='text-base text-text'>Statistics</h5>}>
        <div className='text-sm'>
          {statistics ?
            <>
              <p>Average: {statistics.average}</p>
              <p>Standard Deviation: {statistics.stdDev}</p>
              <p>Skewness: {statistics.skewness}</p>
            </>
          : <p>No data available</p>}
        </div>
      </Card>
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        height={100}
        width={250}
      >
        <CartesianGrid vertical={false} />
        <XAxis axisLine dataKey='grade' interval={0} tickLine tickMargin={10} />
        <Bar dataKey='failed' stackId='a' fill='hsl(var(--failure))' radius={[0, 0, 4, 4]} />
        <Bar dataKey='passed' stackId='a' fill='hsl(var(--success))' radius={[4, 4, 0, 0]} />
      </BarChart>
    </div>
  );
};

export default ExternalAssignmentStatistics;
