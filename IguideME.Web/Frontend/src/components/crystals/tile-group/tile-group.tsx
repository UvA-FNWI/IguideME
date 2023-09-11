import { type FC, type ReactElement } from 'react';
import { type TileGroup } from '@/types/tile';

import './style.scss';
import { Divider } from 'antd';

interface Props {
	group: TileGroup;
}
const TileGroupView: FC<Props> = ({ group }): ReactElement => {
	return (
		<div className="tileGroup">
			<h2>{group.title}</h2>
			<Divider style={{ margin: '5px 0px 8px 0px' }} />
		</div>
	);
};

export default TileGroupView;
