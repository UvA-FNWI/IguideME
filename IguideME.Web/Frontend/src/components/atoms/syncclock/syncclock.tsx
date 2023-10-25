// /------------------------- Module imports -------------------------/
import Swal from 'sweetalert2';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { type FC, type ReactElement, useContext, useEffect } from 'react';
import { Button, Col, ConfigProvider, Row } from 'antd';

import './style.scss';
import { pollSync, startNewSync, stopCurrentSync } from '@/api/syncing';
import { syncContext } from '@/components/crystals/syncmanager/types';
import { getRelativeTimeTimer } from '@/helpers/time';
import { SyncStateNames } from '@/types/synchronization';

const SyncClock: FC = (): ReactElement => {
	const { startTime, setStartTime } = useContext(syncContext);
	const queryClient = useQueryClient();

	let elapsed;
	if (startTime !== null) {
		elapsed = getRelativeTimeTimer(startTime, Date.now());
	}

	// const elapsed = null;
	const { mutate: initiateSync } = useMutation(startNewSync);
	const { mutate: abortSync } = useMutation(stopCurrentSync);
	const { data } = useQuery('syncPoll', pollSync, { refetchInterval: elapsed === undefined ? false : 100 });

	useEffect(() => {
		if (data !== undefined) {
			const done = !data.some((job) => job.task !== SyncStateNames.DONE);
			if (done) {
				setStartTime(null);
				// This marks everything for a refetch from the backend.
				void queryClient.invalidateQueries();
			}
		}
	}, [data, setStartTime]);

	const startSync = (): void => {
		initiateSync();
		setStartTime(Date.now());
	};

	const stopSync = (): void => {
		abortSync();
	};

	return (
		<ConfigProvider
			theme={{
				components: {
					Button: {
						colorPrimaryHover: 'rgb(0, 185, 120)',
						colorPrimary: 'rgb(0, 185, 120)',
						colorPrimaryActive: 'rgb(0, 185, 120)',
						colorPrimaryTextHover: 'rgb(0, 185, 120)',
					},
				},
			}}
		>
			<Row justify="center" gutter={10} style={{ marginBottom: '20px' }}>
				<Col>
					<div className={`clock ${elapsed !== undefined ? 'rotating' : ''}`}>
						<div style={{ border: 'none' }}>
							<span>
								<h3>
									<small>elapsed time</small>
								</h3>
							</span>
							<span>
								<h3>{elapsed ?? 'Idle'}</h3>
							</span>
						</div>
					</div>
				</Col>
			</Row>

			<Row gutter={10}>
				<Col xs={12}>
					<Button className="syncbutton" disabled={elapsed !== undefined} block onClick={startSync}>
						synchronize
					</Button>
				</Col>

				<Col xs={12}>
					<Button
						className="syncbutton"
						disabled={elapsed === undefined}
						block
						onClick={() => {
							void Swal.fire({
								title: 'Do you really want to abort the synchronization?',
								text: `This will undo the updates from the current sync!`,
								icon: 'warning',
								focusCancel: true,
								showCancelButton: true,
								confirmButtonText: 'Abort',
								cancelButtonText: 'Cancel',
								customClass: {},
							}).then((result) => {
								if (result.isConfirmed) {
									stopSync();
									void Swal.fire(
										'Synchronization aborted!',
										'The synchronization has stopped and the most recent data will be used instead.',
										'error',
									);
								}
							});
						}}
					>
						abort
					</Button>
				</Col>
			</Row>
		</ConfigProvider>
	);
};

export default SyncClock;
