import type { ReactElement } from 'react';

import { AdminHeader } from '@/app/courses/[courseId]/admin/_components/admin-header';

export default function GradePredictor(): ReactElement {
  return (
    <AdminHeader title='Grade Predictor' subtitle='Train and view models for predicting the students final grades.' />
  );
}
