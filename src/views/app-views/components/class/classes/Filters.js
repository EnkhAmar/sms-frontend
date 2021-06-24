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

const Filters = ({teachers, lessons, teacherChange, lessonChange, statusChange, fields, branchFilter, role, handleSearch}) => {

  const checkBranch = () => {
    if ((role===ADMIN || role===SUPERADMIN) && branchFilter===null) {
      message.error('Please select a branch filter!');
    }
  }

  return (
    <Form
      fields={fields}
    >
      <Row wrap="true">
        <Form.Item name="lesson" className="filter" style={{marginRight: 10, marginBottom: 10}}>
          <Select
            allowClear
            showSearch
            onChange={lessonChange}
            onClick={checkBranch}
            size="small"
            disabled={(role===ADMIN || role===SUPERADMIN) && branchFilter===null ? true : false}
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

        <Form.Item name="teacher" className="filter" style={{marginRight: 10, marginBottom: 10}}>
          <Select
            allowClear
            showSearch
            placeholder="Select Teacher"
            onChange={teacherChange}
            onClick={checkBranch}
            size="small"
            disabled={(role===ADMIN || role===SUPERADMIN) && branchFilter===null ? true : false}
            filterOption={(input, option) => {
              let item = option.children[0] + option.children[1] + option.children[2];
              return item.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }}
          >
            {
              teachers ?
              teachers.map(item => <Option key={item.id} value={item.id}>{item.firstname} {item.lastname ? item.lastname : ' '}</Option>)
              : null
            }
          </Select>
        </Form.Item>

        <Form.Item name="status" className="filter" style={{marginRight: 10, marginBottom: 10}}>
          <Select
            allowClear
            showSearch
            className="filter"
            placeholder="Select Status"
            onChange={statusChange}
            size="small"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="active">Active</Option>
            <Option value="soon">Upcoming</Option>
            <Option value="finished">Finished</Option>
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
