import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Table, Tag, Avatar, Spin, Pagination, message } from 'antd'
import getInitials from 'utils/getInitials'
import { Menu } from 'antd';
import Flex from 'components/shared-components/Flex'
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { ACCOUNTANT_GROUP } from 'constants/AppConstant'
import { fetchStaffs } from './Forms/fetchData'

const DATA_PER_PAGE = 20


function Accountant({ staffUpdate, deleteStaff, editStaff, token }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [accountants, setAccountants] = useState([])
  let data;
  
  const getAccountants = async (page) => {
		setLoading(true);

		const res = await fetchStaffs(token, ACCOUNTANT_GROUP, page)

    setTotal(res.count)
    setCurrentPage(page)
    setLoading(false)
    
    if (res.results) {
      data = res.results.map( (accountant, index) => {
        return {
          key: index,
          id: accountant.id,
          image: accountant.profile ? accountant.profile.image : null,
          name: accountant.firstname + ' ' + (accountant.lastname ? accountant.lastname : ''),
          school: accountant.school_name,
          branch: accountant.branch_name,
          email: accountant.email,
          phone: accountant.phone,
        }
      })
      setAccountants(data)
    } else {
      message.error({ content: Object.values(res), duration: 4 })
    }
	}

  useEffect(() => {
    getAccountants(1)
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
        render: (image, record) => (
          <Link to={`/app/profile/${record.id}`}>
          <Avatar style={{backgroundColor: '#3d3f56'}} src={image} >   
            {record.logo ? '' : <span className="font-weight-semibold font-size-sm">{getInitials(record.name)}</span>}
          </Avatar>
          </Link>
        )
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
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
        align: "left",
      },
      {
        title: 'Branch',
        key: 'branch',
        dataIndex: 'branch',
        align: "left",
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
          <Table columns={columns} dataSource={accountants} pagination={false} />
          {
            total > DATA_PER_PAGE ?
            <Flex justifyContent="end" className="mt-3">
              <Pagination current={currentPage} onChange={getAccountants} total={total} pageSize={DATA_PER_PAGE}/>
            </Flex>
            : null
          }
        </>
      }
      </>
    )
}

export default React.memo(Accountant)
