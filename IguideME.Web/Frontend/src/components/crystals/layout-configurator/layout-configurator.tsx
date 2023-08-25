import { Button, Col, Form} from 'antd';
import { FC, ReactElement} from 'react';

import ConfigLayoutColumn from '@/components/atoms/layout-column/layout-column';
import { useMutation, useQuery } from 'react-query';
import { getLayoutColumns, postLayoutColumns } from '@/api/tiles';
import { LayoutColumn } from '@/types/tile';
import { PlusOutlined } from '@ant-design/icons';

const LayoutConfigurator: FC = (): ReactElement => {
    const { data } = useQuery("layout-columns", getLayoutColumns);
    if (data) {
        return (<LayoutColumnForm columns={data}/>)
    }

    return (<>Loading...</>);
}

type Props = {
    columns: LayoutColumn[];
}

const LayoutColumnForm: FC<Props> = ({columns}): ReactElement => {
    const [form] = Form.useForm<Props>();
    const {mutate: saveLayout} = useMutation(postLayoutColumns);


    const save = (values: Props) => {
        console.log('values', values);
        saveLayout(values.columns);

    }

    return (
        <Form name='layout_columns_form'
              form={form}
              layout='inline'
              initialValues={{columns}}
              onFinish={save}
              >
            <Form.List name="columns">
                {
                    (fields, {add, remove}) => (
                        <>
                        {fields.map(({key, name, ...restField}) => (
                            <Col key={key}>
                                <ConfigLayoutColumn form={form} name={name} restField={restField} remove={remove}/>
                            </Col>
                        ))}
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Add Column
                        </Button>
                        </>
                    )
                }
            </Form.List>
            <Form.Item>
                <Button htmlType='submit'>
                    Save
                </Button>
            </Form.Item>
        </Form>
    )
}

export default LayoutConfigurator
