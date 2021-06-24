import {
  Card,
  Tooltip,
  Tag,
  Table,
  Badge
} from 'antd';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { TUGRUG, PAGINATION_COUNT } from 'constants/AppConstant';
import './studentStyles.css'

const StudentInfo = ({ data }) => {
  const columns = [
    {
      title: "Class Name",
      dataIndex: 'class_name',
      key: 'class_name',
      render: (text, record) => (
        <span>
          <h5>
            <Link to={"class/view/" + data[0].class_id}><h5 style={{display: 'inline-block'}}>{text}</h5></Link>&nbsp;
            <Tooltip title={record.total_payment - record.payments_paid - record.discount_amount <= 0 ? "Payment Completed" : "Payment Incomplete"}>
              <Badge
                count={
                  record.total_payment - record.payments_paid - record.discount_amount <= 0 ?
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  :
                  <ExclamationCircleOutlined style={{ color: '#f5222d' }} />
                }
              />
            </Tooltip>
          </h5>
          <div>
            <Tooltip title="Note">{record.note}</Tooltip>
          </div>
        </span>
      )
    },
    {
      title: "Start Date",
      dataIndex: 'start_date',
      key: 'start_date'
    },
    {
      title: "End Date",
      dataIndex: 'end_date',
      key: 'end_date'
    },
    {
      title: 'Original Fee',
      dataIndex: 'total_payment',
      align: 'center',
      key: 'total_payment',
      render: text => (
        <Tag color="geekblue">{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{TUGRUG}</Tag>
      )
    },
    {
      title: 'Discount',
      dataIndex: 'discount_amount',
      align: 'center',
      key: 'discount_amount',
      render: text => (
        <Tag color="orange">{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{TUGRUG}</Tag>
      )
    },
    {
      title: 'Payment Fee',
      key: 'amount_to_pay',
      align: 'center',
      render: (text, record) => (
        <Tag color="volcano">{(record.total_payment - record.discount_amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{TUGRUG}</Tag>
      )
    },
    {
      title: 'Total Paid',
      dataIndex: 'payments_paid',
      align: 'center',
      key: 'payments_paid',
      render: text => (
        <Tag color="green">{text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}{TUGRUG}</Tag>
      )
    },
    {
      title: 'Remaining Fee',
      key: 'remaining_fee',
      align: 'center',
      render: (text, record) => (
        <Tag color="error">{(record.total_payment - record.payments_paid - record.discount_amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{TUGRUG}</Tag>
      )
    },
  ]
  return (
    <>
      <Table
        style={{margin: '20px 10px'}}
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{x: 900}}
      />
    </>
  )

  // return (
  //   <>
  //   <Card title={null} bodyStyle={{padding: 10}} hoverable={true}>
  //     <h5 className="m-0"><Tooltip title="Class Name">{data.class_name}</Tooltip></h5>
  //     <p className="mb-1"><Tooltip title="Note">{data.note}</Tooltip></p>
  //     <div className="info-flex">
  //       <div className="info-flex-1 info-item">
  //         <Tooltip title="Start Date">
  //           <CalendarOutlined /> {data.start_date}
  //         </Tooltip>
  //       </div>
  //       <div className="info-flex-1 info-item">
  //         <Tooltip title="End Date">
  //           <CalendarOutlined /> {data.end_date}
  //         </Tooltip>
  //       </div>
  //     </div>
  //     <div className="info-flex">
  //       <div className="info-flex-1 info-item">
  //         <Tooltip title="Total payment">
  //           <Tag color="processing">{data.total_payment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{TUGRUG}</Tag>
  //         </Tooltip>
  //       </div>
  //       <div className="info-flex-1 info-item">
  //         <Tooltip title="Discount">
  //           <Tag color="warning">{data.discount_amount ? data.discount_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}{TUGRUG}</Tag>
  //         </Tooltip>
  //       </div>
  //     </div>
  //     <div className="info-flex">
  //       <div className="info-flex-1 info-item">
  //         <Tooltip title="Payments Paid">
  //           <Tag color="green">{data.payments_paid ? data.payments_paid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}{TUGRUG}</Tag>
  //         </Tooltip>
  //       </div>
  //       <div className="info-flex-1 info-item">
  //         <Tooltip title="Payment Remaining">
  //           <Tag color="volcano">{(data.total_payment - data.payments_paid).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{TUGRUG}</Tag>
  //         </Tooltip>
  //       </div>
  //     </div>
  //   </Card>
  //   </>
  // )
}

export default StudentInfo;
