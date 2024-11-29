import type { Assignment } from '@/types/tile';
import { useQuery } from '@tanstack/react-query';
import type { FC, ReactElement } from 'react';

interface AssignmentOverview {
  assignment: Assignment;
}

const AssignmentOverview: FC<AssignmentOverview> = ({ assignment }): ReactElement => {
  const {
    data: submissions,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['external assignment', assignment.id, 'submissions'],
    queryFn: async () => await getSubmissions(assignment.id),
  });
};
