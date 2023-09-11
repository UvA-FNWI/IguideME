import { type FC, type ReactElement } from 'react';
import { useMutation, useQuery } from 'react-query';

import Loading from '@/components/particles/loading';
import { getTileGroups, postTileGroup } from '@/api/tiles';
import TileGroupView from '@/components/crystals/tile-group/tile-group';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const TileGroupBoard: FC = (): ReactElement => {
	const { data: tilegroups } = useQuery('tile-groups', getTileGroups);
	const { mutate: postGroup } = useMutation(postTileGroup);

	if (tilegroups === undefined) {
		return <Loading />;
	}

	return (
		<div>
			{tilegroups.map((group, index) => (
				<div key={index}>
					<TileGroupView group={group} />
				</div>
			))}
			<Button
				type="dashed"
				onClick={() => {
					postGroup({ title: 'TileGroup', id: -1, position: tilegroups.length });
				}}
				block
				icon={<PlusOutlined />}
			>
				Add Column
			</Button>
		</div>
	);
};

export default TileGroupBoard;
