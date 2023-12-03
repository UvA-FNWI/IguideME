import { useContext, type FC, type ReactElement } from 'react';
import './style.scss'
import { Row, Col } from 'antd';
import { tileViewContext } from '@/components/pages/student-dashboard/context';
interface Props {
  tile: Tile
}
const ViewTile: FC<Props> = ({ tile }): ReactElement => {
  const viewType = useContext(tileViewContext)
  return <div className='tileView'>
    <div style={{ margin: 12, }}>
      <h3 style={{ fontSize: 16, fontWeight: 1400, fontFamily: '"Antic Slab", serif' }}>
        {tile.title}
      </h3>
    </div>
    {renderViewType()}
  </div >
  function renderViewType() {
    switch (viewType) {
      case 'graph':
        return <GraphTile tile={tile} />
      case 'grid':
        return <GridTile tile={tile} />
    }
  }
}

const GraphTile: FC<Props> = ({ tile }): ReactElement => {
  return <>graph</>
}

const GridTile: FC<Props> = ({ tile }): ReactElement => {
  return <>grid</>
}
export default ViewTile;
