import { Dispatch, FC, ReactElement, SetStateAction, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'

import "./style.scss"
import { Button, Col, ConfigProvider, Row, Select } from 'antd'
import { useQuery } from 'react-query'
import { getself, getusers } from '@/api/users'
import { User, UserRoles } from '@/types/user'

// TODO: add coursename to header when in admin panel

const selector = (isAdmin: boolean, currentUser: User | undefined, setCurrentUser: Dispatch<SetStateAction<User | undefined>>, navigate: NavigateFunction): ReactElement => {
  // TODO: check that this actually prevents the call from being made.
  const { data } = useQuery("users", () => getusers, {enabled: isAdmin });
  const students = data?.sort((a, b) => a.sortable_name.localeCompare(b.sortable_name)).filter(student => student.userID !== currentUser?.userID);

  const onchange = (userID: string) => {
    setCurrentUser(students?.find(student => student.userID === userID));
    navigate(userID ??"/");
    ;
  }

  if (!isAdmin) {
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
              value={(currentUser?.name)}
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

  const [currentUser, setCurrentUser] = useState<User | undefined>(self);
  const [inHome, setInHome] = useState<boolean>(true);

  const isAdmin: boolean = self?.role === UserRoles.instructor;

  const goHome = () => {
    setCurrentUser(undefined);
    setInHome(true);
    navigate("/");
  }

  const toggleAdmin = (path: string) => {
    setInHome(!inHome);
    navigate(path);
  }

  return (
    <div className='Header'>
      <Row justify={"space-between"} align="middle">
        <Col>
          <div className='homebutton'>
            <Button type="link" onClick={goHome}>
              <h1>
                IguideME
              </h1>
            </Button>
          </div>
        </Col>
        <Col>
        {
          selector(isAdmin && inHome, currentUser, setCurrentUser, navigate)
        }</Col>
        <Col>
          <div style={{minWidth: "100px"}}>
          {

            isAdmin && inHome ?
              <Button className='adminButton' type="link" onClick={() => toggleAdmin('/admin')}>
                <h3>Admin Panel</h3>
              </Button>
          :
          <></>}
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Header
