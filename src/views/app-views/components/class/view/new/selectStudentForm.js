import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Col,
  Button,
  Select,
} from 'antd';
import { SUPERADMIN } from 'constants/AppConstant';
import '../styles.css'

const { Option } = Select;
const { TextArea } = Input;

const SelectStudentForm = ({handleSubmit, handleCancel, loading, fields, students, status, discounts, totalPayment}) => {
  let startDate = fields.find((item) => item.name[0] === 'start_date').value;
	let endDate = fields.find((item) => item.name[0] === 'end_date').value;

	function disabledEndDate(current) {
	  return current <= startDate;
	}

	function disabledStartDate(current) {
	  return current >= endDate;
	}

  return (
    <>
      <Form
        {...{
          labelCol: { span: 24 },
          wrapperCol: { span: 24 },
        }}
        onFinish={(e) => handleSubmit(e.student, e.status, e.discount, e.note, e.start_date, e.end_date, e.payment_paid)}
        name="Student Form"
        fields={fields}
      >

        <Form.Item
          label="Student"
          name="student"
          rules={[{ required: true, message: 'Please select a student!'}]}
        >
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select Student"
            loading={students ? false : true}
            filterOption={(input, option) => {
              let item = option.children[0] + option.children[1] + option.children[2];
              return item.toLowerCase().indexOf(input.toLowerCase()) >= 0
						}}
          >
          {
            students ?
            students.map(item => <Option key={item.id} value={item.id}>{item.firstname} {item.lastname ? item.lastname : ' '}</Option>)
            : null
          }
          </Select>
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Please select a status!'}]}
        >
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select Status"
            loading={status ? false : true}
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

        <Form.Item
          label="Discount"
          name="discount"
        >
          <Select
            mode="multiple"
            showSearch
            style={{ width: "100%" }}
            placeholder="Select Discount"
            loading={discounts ? false : true}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
          {
            discounts ?
            discounts.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
            : null
          }
          </Select>
        </Form.Item>

        <Form.Item
          label="Note"
          name="note"
        >
          <TextArea rows={2} placeholder="Enter Note" />
        </Form.Item>

        <div className="flex gap-5">
          <div className="flex-1">
            <Form.Item
              label="Start Date"
              name="start_date"
              rules={[{ required: true, message: 'Please enter start date!'}]}
            >
              <DatePicker
                placeholder="Select Start Date"
                style={{ width: "100%" }}
                disabledDate={endDate ? disabledStartDate : null}
  							onChange={(value) => startDate = value}
              />
            </Form.Item>
          </div>
          <div className="flex-1">
            <Form.Item
              label="End Date"
              name="end_date"
              rules={[{ required: true, message: 'Please enter end date!'}]}
            >
              <DatePicker
                placeholder="Select End Date"
                style={{ width: "100%" }}
                disabledDate={startDate ? disabledEndDate : null}
  							onChange={(value) => endDate = value}
              />
            </Form.Item>
          </div>
        </div>

        <Form.Item>
          <Col style={{ textAlign: 'right' }}>
          <Button onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" loading={loading} htmlType="submit" style={{ marginLeft: 8 }}>
            Save
          </Button>
          </Col>
        </Form.Item>
      </Form>
    </>
  )
}

export default SelectStudentForm;
