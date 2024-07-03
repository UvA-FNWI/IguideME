import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import { type FC, type ReactElement } from 'react';

const GradePredictor: FC = (): ReactElement => {
  return (
    <>
      <AdminTitle
        description='Train and view models for predicting the students final grades'
        title='Grade Predictor'
      />
    </>
  );
};

export default GradePredictor;
