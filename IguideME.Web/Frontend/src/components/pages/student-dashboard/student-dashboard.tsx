import { FC, ReactElement } from 'react'
import { useParams } from 'react-router-dom'

const StudentDashboard: FC = (): ReactElement => {
  const { id } = useParams()

  return (
    <div>
      Student: {id}
    </div>

  )
}

export default StudentDashboard
