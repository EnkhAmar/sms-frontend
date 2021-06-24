import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Table, Tag, Progress, Avatar, Spin, Pagination, message } from 'antd'
import getInitials from 'utils/getInitials'
import { Menu } from 'antd';
import { url } from 'configs/EnvironmentConfig'
import axios from 'axios'
import Flex from 'components/shared-components/Flex'
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { ADMIN, ADMIN_GROUP, OPERATOR_GROUP, TEACHER_GROUP, ACCOUNTANT_GROUP } from 'constants/AppConstant'
import { fetchStaffs } from './Forms/fetchData'

const DATA_PER_PAGE = 20

function Admins({ staffUpdate, deleteStaff, editStaff, token }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [admins, setAdmins] = useState([])
  let data;
  console.log("admin")
  const getAdmins = async (page) => {
		setLoading(true);

		const res = await fetchStaffs(token, ADMIN_GROUP, page)

    setTotal(res.count)
    setCurrentPage(page)
    setLoading(false)
    
    if (res.results) {
      data = res.results.map( (admin, index) => {
        
        return {
          key: index,
          id: admin.id,
          image: admin.profile ? admin.profile.image : null,
          name: admin.firstname + ' ' + (admin.lastname ? admin.lastname : ''),
          school: admin.school_name,
          email: admin.email,
          phone: admin.phone,
        }
      })
      setAdmins(data)
    } else {
      message.error({ content: Object.values(res), duration: 4 })
    }
	}

  useEffect(() => {
    getAdmins(1)
  }, [staffUpdate])

  const dropdownMenu = row => (
    <Menu>
      <Menu.Item onClick={() => editStaff(row.id)}>
        <Flex alignItems="center">
          <span className="ml-2">Edit</span>
        </Flex>
      </Menu.Item>
      <Menu.Item onClick={() => deleteStaff(row)}>
        <Flex alignItems="center">
          <span className="ml-2" >Delete</span>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
        title: ' ',
        dataIndex: 'image',
        key: 'image',
        align: 'left',
        render: (image, record) => (
          <Link to={`/app/profile/${record.id}`}>
          <Avatar style={{backgroundColor: '#3d3f56'}} src={image} >   
              {record.logo? '' : <span className="font-weight-semibold font-size-sm">{getInitials(record.name)}</span>}
          </Avatar>
          </Link>
        )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      render: (text, record) => 
        <Link to={`/app/profile/${record.id}`}>
          <a>{text}</a>,
        </Link>   
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      align: 'left',
      render: number => <span style={{ whiteSpace: 'nowrap' }}>{`(+976) ${number.slice(0,4)} - ${number.slice(4,8)}`}</span>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: email => <a href={`mailto:${email}`}>{email}</a>
    },
    {
      title: 'School',
      dataIndex: 'school',
      key: 'school',
    },
    {
      title: '',
      key: 'action',
      width: 10,
      align: "center",
      render: (_, elm) => (
        <div className="text-right">
          <EllipsisDropdown menu={dropdownMenu(elm)}  />
        </div>
      )
    },
  ];
  
    return (
      <>
      {
        loading
        ? <div style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
            <Spin tip='Loading...' />
          </div>
        : <>
          <Table columns={columns} dataSource={admins} pagination={false} />
          {
            total > DATA_PER_PAGE ?
            <Flex justifyContent="end" className="mt-3">
              <Pagination current={currentPage} onChange={getAdmins} total={total} pageSize={DATA_PER_PAGE}/>
            </Flex>
            : null
          }
        </>
      }
      </>
    )
}

export default React.memo(Admins)