import { FC, ReactElement, useState } from 'react'
import { Link, NavigateFunction, useNavigate } from 'react-router-dom'

import "./style.scss"
import { Col, ConfigProvider, Row, Select } from 'antd'
import { useQuery } from 'react-query'
import { getself, getusers } from '@/api/users'
import { User, UserRoles } from '@/types/user'


const selector = (self: User | undefined, navigate: NavigateFunction): ReactElement => {

  const isadmin: boolean = self?.role === UserRoles.instructor;

  const { data } = useQuery("users", () => getusers, {enabled: isadmin });
  const [currentUser, setCurrentUser] = useState<User | undefined>(self);

  // TODO: currently bugs when home is pressed, can't figure out how to clear the select element

  const students = data?.sort((a, b) => a.sortable_name.localeCompare(b.sortable_name)).filter(student => student.userID !== currentUser?.userID);

  const onchange = (userID: string) => {
    setCurrentUser(students?.find(student => student.userID === userID));
    navigate(userID ??"/");
    ;
  }

  if (!isadmin) {
    return <></>
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          controlOutlineWidth: 0,
          controlHeight: 38,
          colorText: 'white',
          colorBorder: 'white',
          colorTextSecondary: 'white',
          colorTextQuaternary: 'white',
          colorBgBase: 'rgb(90, 50, 255)',
          motion: false,
        },
      }}>
      <Select placeholder={"Choose a student"}
              // value={({label: currentUser?.name, value: currentUser?.userID})}
              onChange={onchange}
              showSearch={true}
              options={students?.map((student) => ({label: student.name, value: student.userID}))}
              allowClear={true}
              style={{width: "40vw", maxWidth: "400px"}}
        />
    </ConfigProvider>
    )
}

const Header: FC = (): ReactElement => {
  const navigate = useNavigate();
  const { data: self } = useQuery("self", () => getself, {onSuccess: (data) => {
    if (data.role === UserRoles.student) {
      navigate(data.userID ?? "/");
    }
  }});

  return (
    <div className='Header'>
      <Row justify={"space-between"} align="middle">
        <Col>
          <Link to={'/'}>
            <h1>IguideME</h1>
          </Link>
        </Col>
        <Col>
        {
          selector(self, navigate)
        }</Col>
        <Col>
          {
            self?.role === UserRoles.instructor ?
            <div className='adminButton'>
            <Link to={'/admin'}>
              <h3>Admin Panel</h3>
            </Link>
          </div>
          :
          <></>}
        </Col>
      </Row>
    </div>
  )
}

export default Header
