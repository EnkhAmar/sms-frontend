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

function Teachers({ staffUpdate, deleteStaff, editStaff, token }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [teachers, setTeachers] = useState([])
  let data;

  const getTeachers = async (page) => {
		setLoading(true);

		const res = await fetchStaffs(token, TEACHER_GROUP, page)

    setTotal(res.count)
    setCurrentPage(page)
    setLoading(false)
    
    if (res.results) {
      data = res.results.map( (teacher, index) => {
        return {
          key: index,
          id: teacher.id,
          image: teacher.profile.image,
          name: teacher.firstname + ' ' + (teacher.lastname ? teacher.lastname : ''),
          hours_worked: Math.round((teacher.job_hour)/1000000/3600),
          school: teacher.school_name,
          branch: teacher.branch_name,
          email: teacher.email,
          phone: teacher.phone
        }
      })
      setTeachers(data)
    } else {
      message.error({ content: Object.values(res), duration: 4 })
    }
	}

  useEffect(() => {
    getTeachers(1)
  }, [ staffUpdate ])

  const dropdownMenu = row => (
    <Menu>
      <Menu.Item  onClick={() => editStaff(row.id)}>
        <Flex alignItems="center">
          <span className="ml-2">Edit</span>
        </Flex>
      </Menu.Item>
      <Menu.Item onClick={() => {deleteStaff(row)}}>
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
        render: text => 
          <Link to={`/app/profile/$`}>
            <a>{text}</a>
          </Link>
      },
      {
        title: 'Weekly time chart ( 40 hour total )',
        dataIndex: 'hours_worked',
        key: 'hours_worked',
        render: hours => (
          <Progress
          style={{ minWidth: '150px' }}
          strokeColor={{
            from: '#108ee9',
            to: '#87d068',
          }}
          // type='circle'
          percent={hours*100/40}
          status="active"
          // format={hours => `${hours} Hours`}
        />
        )
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
        align: 'center',
        render: number => <span style={{ whiteSpace: 'nowrap' }}>{`(+976) ${number.slice(0,4)} - ${number.slice(4,8)}`}</span>
      },
      {
        title: 'School',
        dataIndex: 'school',
        key: 'school',
        align: "center",
      },
      {
        title: 'Branch',
        key: 'branch',
        dataIndex: 'branch',
        align: "center",
        render: branch => <span><Tag color='geekblue'>{branch}</Tag></span>
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
        <Table columns={columns} dataSource={teachers} pagination={false} />
        {
          total > DATA_PER_PAGE ?
          <Flex justifyContent="end" className="mt-3">
            <Pagination current={currentPage} onChange={getTeachers} total={total} pageSize={DATA_PER_PAGE}/>
          </Flex>
          : null
        }
      </>
    }
    </>
  )
}

export default React.memo(Teachers)
