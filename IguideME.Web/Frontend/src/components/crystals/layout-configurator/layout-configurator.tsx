import { Button, Col, Form } from 'antd';
import { type FC, type ReactElement, useMemo, useState } from 'react';

import ConfigLayoutColumn from '@/components/atoms/layout-column/layout-column';
import { useMutation, useQuery } from 'react-query';
import { getLayoutColumns, postLayoutColumns } from '@/api/tiles';
import { type LayoutColumn } from '@/types/tile';
import { PlusOutlined } from '@ant-design/icons';
import {
	DndContext,
	type DragEndEvent,
	DragOverlay,
	type DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { useWatch } from 'antd/es/form/Form';
import { createPortal } from 'react-dom';
import Loading from '@/components/particles/loading';

const LayoutConfigurator: FC = (): ReactElement => {
	const { data } = useQuery('layout-columns', getLayoutColumns);
	if (data !== undefined) {
		return <LayoutColumnForm columns={data} />;
	}

	return <Loading />;
};

interface Props {
	columns: LayoutColumn[];
}

const LayoutColumnForm: FC<Props> = ({ columns }): ReactElement => {
	const [form] = Form.useForm<Props>();
	const { mutate: saveLayout } = useMutation(postLayoutColumns);
	const [active, setActive] = useState<{ name: number; restfield: { fieldKey?: number | undefined } } | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 20,
			},
		}),
	);
	const formColumns = useWatch('columns', form);

	const save = (values: Props): void => {
		console.log('values', values);
		saveLayout(values.columns);
	};

	const columnIds = useMemo(
		() => (formColumns !== undefined ? formColumns.map((column) => column.id) : []),
		[formColumns],
	);

	console.log('columns', columns);

	return (
		<DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
			<Form name="layout_columns_form" form={form} layout="inline" initialValues={{ columns }} onFinish={save}>
				<SortableContext items={columnIds}>
					<Form.List name="columns">
						{(fields, { add, remove }) => (
							<>
								{fields.map(({ key, name, ...restField }) => (
									<Col key={key}>
										<ConfigLayoutColumn name={name} form={form} restField={restField} remove={remove} />
									</Col>
								))}
								<Button
									type="dashed"
									onClick={() => {
										add();
									}}
									block
									icon={<PlusOutlined />}
								>
									Add Column
								</Button>
							</>
						)}
					</Form.List>
				</SortableContext>
				<Form.Item>
					<Button htmlType="submit">Save</Button>
				</Form.Item>
				{createPortal(
					<DragOverlay>
						{active !== null && (
							<Col>
								<ConfigLayoutColumn name={active.name} form={form} restField={active.restfield} />
							</Col>
						)}
					</DragOverlay>,
					document.body,
				)}
			</Form>
		</DndContext>
	);

	function onDragStart(event: DragStartEvent): void {
		if (event.active.data.current !== undefined) {
			setActive({ name: event.active.data.current.name, restfield: event.active.data.current.restField });
		}
	}

	function onDragEnd(event: DragEndEvent): void {
		setActive(null);
		const { active, over } = event;
		if (over === null) return;
		if (active.id === over.id) return;

		const activeIndex = formColumns.findIndex((column) => column.id === active.id);
		const overIndex = formColumns.findIndex((column) => column.id === over.id);

		form.setFieldsValue({ columns: arrayMove(formColumns, activeIndex, overIndex) });
	}
};

export default LayoutConfigurator;
