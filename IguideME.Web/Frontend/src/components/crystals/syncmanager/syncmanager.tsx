// /------------------------- Module imports -------------------------/
import { Alert, Col, Row } from 'antd';
import { type FC, type ReactElement, useState } from 'react';

// /-------------------------- Own imports ---------------------------/
import SyncClock from '@/components/atoms/syncclock/syncclock';
import { syncContext } from './types';
import SyncProgressGrid from '@/components/atoms/syncprogressgrid/syncprogressgrid';

const SyncManager: FC = (): ReactElement => {
	const [startTime, setStartTime] = useState<number | null>(null);

	const error = false;
	return (
		<syncContext.Provider value={{ startTime, setStartTime }}>
			<Row gutter={[20, 20]}>
				<Col xs={24} md={12} lg={9}>
					<SyncClock />
					{error && (
						<Alert type="error" style={{ marginTop: 20 }} message="Failed to reach datamart. Try again later!" />
					)}
				</Col>

				<Col xs={24} md={12} lg={15}>
					<SyncProgressGrid />
				</Col>
			</Row>
		</syncContext.Provider>
	);
};

export default SyncManager;
