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
import '../../styles.css';

const { Option } = Select;
const { TextArea } = Input;

const EditForm = ({handleSubmit, handleCancel, loading, fields, students, status, discounts, totalPayment}) => {
  let fullname = fields.find((item) => item.name === "firstname").value;
  if (fields.find((item) => item.name === "lastname").value) {
    fullname = fullname + ' ' + fields.find((item) => item.name === "lastname").value;
  }

  return (
    <>
      <Form
        {...{
          labelCol: { span: 24 },
          wrapperCol: { span: 24 },
        }}
        onFinish={(e) => handleSubmit(e.status, e.note, e.start_date, e.end_date, e.discounts)}
        name="Edit Student Form"
        fields={fields}
      >
        <div style={{margin: "10px 0px"}}>
          <h5>Student</h5>
          <span>{fullname}</span>
        </div>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Please select a status!'}]}
        >
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select Status"
            disabled={status ? false : true}
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
          label="Discounts"
          name="discounts"
        >
          <Select
            mode="multiple"
            showSearch
            style={{ width: "100%" }}
            placeholder="Select Discounts"
            disabled={discounts ? false : true}
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
              <DatePicker placeholder="Select Start Date" style={{ width: "100%" }} />
            </Form.Item>
          </div>
          <div className="flex-1">
            <Form.Item
              label="End Date"
              name="end_date"
              rules={[{ required: true, message: 'Please enter end date!'}]}
            >
              <DatePicker placeholder="Select End Date" style={{ width: "100%" }} />
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

export default EditForm;
