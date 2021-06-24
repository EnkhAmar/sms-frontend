import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Row,
  Col,
  Button,
  Select,
} from 'antd';
import '../../styles.css';

const { Option } = Select;

const PaymentForm = ({handleSubmit, handleCancel, loading, fields, paymentTypes}) => {
  const remaining = fields.find((item) => item.name === 'remaining').value;
  const refund = fields.find((item) => item.name === 'refund').value;

  return (
    <>
      <Form
        {...{
          labelCol: { span: 24 },
          wrapperCol: { span: 24 },
        }}
        onFinish={handleSubmit}
        name="Payment Form"
        fields={fields}
      >
    		<div className="flex gap-5">
          <div className="flex-1">
            <Form.Item
              label="Payment"
              name="paid"
              rules={[
                {
                  required: true, message: 'Please enter payment amount!'
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (value !== 0) {
                      return Promise.resolve()
                    }
                    return Promise.reject('Payment cannot be 0!')
                  }
                })
              ]}
            >
              <InputNumber max={remaining} min={refund} style={{ width: "100%" }} placeholder="Enter Payment Amount" />
            </Form.Item>
          </div>
    			<div className="flex-1">
            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: 'Please select exam date!'}]}
            >
              <DatePicker placeholder="Select Date" style={{ width: "100%" }} />
            </Form.Item>
    			</div>
    		</div>

        <Form.Item
          label="Payment Type"
          name="pay_type"
          rules={[{ required: true, message: 'Please select a payment type!' }]}
        >
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select Payment Type"
            loading={paymentTypes ? false : true}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
          {
            paymentTypes ?
            paymentTypes.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
            : null
          }
          </Select>
        </Form.Item>

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

export default PaymentForm;
