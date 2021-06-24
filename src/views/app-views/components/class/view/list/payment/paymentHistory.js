import { useState } from 'react';
import {
  Table,
  Spin,
  Menu,
  InputNumber,
  Button,
  Col,
  Row,
  Modal,
  Pagination,
  Tooltip
} from 'antd';
import {
	DeleteOutlined,
	EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { TUGRUG, PAGINATION_COUNT } from 'constants/AppConstant';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';

const { confirm } = Modal;

const PaymentHistory = ({
  payments,
  paymentTypes,
  loading,
  changeEdit,
  editPayment,
  deletePayment,
  currentPage,
  paymentTotal,
  getPayments,
  fields
}) => {
  const [values, setValues] = useState([]);

  const changeValue = (id, val) => {
    if (val > payments.find((item) => item.id === id).paid + fields.find((item) => item.name === 'remaining').value) {
      val = payments.find((item) => item.id === id).paid + fields.find((item) => item.name === 'remaining').value;
    }
    let items = [...values];
    let index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      items[index].value = val;
    } else {
      items.push({id: id, value: val});
    }
    setValues(items);
  }

  const removeValue = (id) => {
    let items = [...values];
    let index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      items.splice(index, 1);
    }
    setValues(items)
  }

  const showDeleteConfirm = (id, paid, date) => {
    confirm({
      title: 'Are you sure delete this payment?',
      content: paid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + TUGRUG + ' / ' + date,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deletePayment(id)
      }
    });
  }


  const columns = [
    {
      dataIndex: 'paid',
      key: 'paid',
      width: 130,
      render: (text, record) => (
        <span style={text >= 0 ? {color: '#138f5b'} : {color: '#f5222d'}}>
          {
            record.edit ?
            <InputNumber
              defaultValue={text}
              max={text + fields.find((item) => item.name === 'remaining').value}
              min={text + fields.find((item) => item.name === 'refund').value}  
              onBlur={(e) => changeValue(record.id, e.target.value)} style={{width: 110}}
            />
            :
            <>
              {text >= 0 ? '+' : null}{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{TUGRUG}
            </>
          }
        </span>
      ),
    },
    {
      dataIndex: 'date',
      key: 'date',
    },
    {
      key: 'payment_type',
      render: (text, record) => (
        <span>
        {
          paymentTypes.find((item) => item.id === record.pay_type).name
        }
        </span>
      )
    },
    {
      key: 'action',
      align: 'right',
      render: (text, record) => (
        <span>
          {
            record.edit ?
            <Row style={{ float: 'right' }}>
              <Tooltip title="Cancel">
                <CloseCircleOutlined
                  onClick={() => {changeEdit(record.id, false); removeValue(record.id)}}
                  style={{color: '#f5222d', fontSize: 20, marginRight: 10}}
                />
              </Tooltip>
              <Tooltip title='Save'>
                <CheckCircleOutlined
                  onClick={() => editPayment(record.id, values.find((item) => item.id === record.id).value, record.pay_type)}
                  style={{color: '#138f5b', fontSize: 20}}
                />
              </Tooltip>
            </Row>
            :
            <EllipsisDropdown
              menu={
                <Menu>
                  <Menu.Item key="0" onClick={() => changeEdit(record.id, true)}>
                    <EditOutlined />
                    <span>Edit</span>
                  </Menu.Item>
                  <Menu.Item key="1" onClick={() => showDeleteConfirm(record.id, record.paid, record.date)}>
                    <DeleteOutlined />
                    <span>Remove</span>
                  </Menu.Item>
                </Menu>
              }
            />
          }
        </span>
      )
    }
  ]

  return (
    <>
      <Table
        columns={columns}
        dataSource={payments}
        bordered={false}
        showHeader={false}
        pagination={false}
        loading={loading ? true : false}
        className="pb-3"
      />
      {
        paymentTotal > PAGINATION_COUNT ?
        <Flex justifyContent="end">
          <Pagination style={{marginBottom: 20}} current={currentPage} onChange={(page) => getPayments(page, payments[0].student)} total={paymentTotal} pageSize={PAGINATION_COUNT}/>
        </Flex>
        : null
      }
    </>
  )
}

// <a style={{textDecoration: 'underline', color: 'rgb(245, 34, 45)', alignItems: 'center', display: 'flex', marginRight: 10}} onClick={() => changeEdit(record.id, false)}>Cancel</a>
// <Button size="small" type="primary">Save</Button>

export default PaymentHistory;
