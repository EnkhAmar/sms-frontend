import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Row,
  Col,
  Button
} from 'antd';

const ExamForm = ({handleSubmit, handleCancel, loading, fields}) => {

  return (
    <>
      <Form
        {...{
          labelCol: { span: 24 },
          wrapperCol: { span: 24 },
        }}
        onFinish={handleSubmit}
        name="Exam Form"
        fields={fields}
      >

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter exam name!'}]}
        >
          <Input placeholder="Enter Exam Name" />
        </Form.Item>

        <div className="flex gap-5">
  	      <div className="flex-1">
            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: 'Please select exam date!'}]}
            >
              <DatePicker placeholder="Select Date" style={{ width: "100%" }} />
            </Form.Item>
    			</div>
    			<div className="flex-1">
            <Form.Item
              label="Total Mark"
              name="total_mark"
            >
              <InputNumber min={0} style={{ width: "100%" }} placeholder="Enter Total Mark" />
            </Form.Item>
    			</div>
    		</div>

        <Form.Item>
          <Col style={{ textAlign: 'right' }}>
          <Button onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" loading={loading} htmlType="submit" style={{ marginLeft: 8 }}>
            Submit
          </Button>
          </Col>
        </Form.Item>
      </Form>
    </>
  )
}

export default ExamForm;
