import type { ReactElement } from 'react';
import { Form, Button } from 'antd';

import type { Tile } from '@/types/tile';
import { TileSelect } from './tile-select';
import { useSearchParams } from 'react-router-dom';

export function SelectComparison({
  defaultValues,
  tiles,
}: {
  defaultValues?: [string, string];
  tiles: Tile[];
}): ReactElement {
  const [form] = Form.useForm();
  const [, setSearchParams] = useSearchParams();
  const onFinish = (values: { tileA: string; tileB: string }): void => {
    setSearchParams({
      a: values.tileA,
      b: values.tileB,
    });
  };

  return (
    <Form
      form={form}
      initialValues={{
        tileA: defaultValues ? defaultValues[0] : undefined,
        tileB: defaultValues ? defaultValues[1] : undefined,
      }}
      onFinish={onFinish}
    >
      <div className='flex w-full max-w-5xl flex-wrap items-center gap-4 p-2'>
        <p className='shrink-0'>Compare</p>
        <Form.Item
          className='!m-0'
          name='tileA'
          rules={[{ required: true, message: 'Please select a valid tile or entry' }]}
        >
          <TileSelect
            tiles={tiles}
            setKey={form.getFieldValue('tileA')}
            changeKey={(key) => {
              form.setFieldsValue({ tileA: key });
            }}
          />
        </Form.Item>
        <p className='shrink-0'>to</p>
        <Form.Item
          className='!m-0'
          name='tileB'
          rules={[{ required: true, message: 'Please select a valid tile or entry' }]}
        >
          <TileSelect
            tiles={tiles}
            setKey={form.getFieldValue('tileB')}
            changeKey={(key) => {
              form.setFieldsValue({ tileB: key });
            }}
          />
        </Form.Item>
      </div>
      <Button className='custom-default-button mt-6 w-28' type='primary' htmlType='submit'>
        Compare
      </Button>
    </Form>
  );
}
