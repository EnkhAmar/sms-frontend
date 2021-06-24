import {
  Row,
  Col,
  Select,
  Form,
  message,
  Input
} from 'antd';
import { SUPERADMIN, ADMIN } from 'constants/AppConstant';
const { Option } = Select;
const { Search } = Input;

const Filters = ({
  classes,
  lessons,
  status,
  payments,
  paymentChange,
  classChange,
  lessonChange,
  statusChange,
  fields,
  branchFilter,
  role,
  handleSearch,
  classFilter
}) => {

  const formItemStyle = {
    marginRight: 10, marginBottom: 10, width: 150
  }

  const checkBranch = () => {
    if ((role===ADMIN || role===SUPERADMIN) && branchFilter===null) {
      message.error('Please select a branch filter!');
    }
  }

  const checkClass = () => {
    if (classFilter === null) {
      message.error('Please select a class!');
    }
  }

  return (
    <Form
      fields={fields}
    >
      <Row wrap="true">
        <Form.Item name="class" style={formItemStyle}>
          <Select
            allowClear
            showSearch
            placeholder="Select Class"
            size="small"
            onChange={classChange}
            onClick={checkBranch}
            disabled={(role === ADMIN || role === SUPERADMIN) && branchFilter === null && classes === null ? true : false}
            filterOption={(input, option) => {
              let item = option.children[0] + option.children[1] + option.children[2];
              return item.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }}
          >
            {
              classes ?
              classes.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
              : null
            }
          </Select>
        </Form.Item>

        <Form.Item name="lesson" style={formItemStyle}>
          <Select
            allowClear
            showSearch
            onChange={lessonChange}
            onClick={() => {checkBranch(); checkClass();}}
            size="small"
            disabled={((role === ADMIN || role === SUPERADMIN) && branchFilter === null && lessons === null) || classFilter === null ? true : false}
            placeholder="Select Lesson"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              lessons ?
              lessons.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
              : null
            }
          </Select>
        </Form.Item>

        <Form.Item name="payment" style={formItemStyle}>
          <Select
            allowClear
            showSearch
            size="small"
            placeholder="Select Payment"
            onChange={paymentChange}
            onClick={() => {checkBranch(); checkClass();}}
            disabled={((role === ADMIN || role === SUPERADMIN) && branchFilter === null && payments === null) || classFilter === null ? true : false}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              payments ?
              payments.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
              : null
            }
          </Select>
        </Form.Item>

        <Form.Item name="status" style={formItemStyle}>
          <Select
            allowClear
            showSearch
            placeholder="Select Status"
            size="small"
            disabled={((role === ADMIN || role === SUPERADMIN) && branchFilter === null && status === null) || classFilter === null ? true : false}
            onChange={statusChange}
            onClick={() => {checkBranch(); checkClass();}}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              status ?
              status.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
              : null
            }
          </Select>
        </Form.Item>

        <Form.Item name="search" className="filter-search" style={{marginBottom: 10}}>
          <Search placeholder="Search..." onSearch={value => handleSearch(value)} size="small" />
        </Form.Item>
      </Row>
    </Form>
  )
}

export default Filters;
