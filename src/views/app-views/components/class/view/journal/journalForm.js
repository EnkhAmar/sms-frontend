import {
  Form,
  Select,
  Row,
  Col,
  Button,
  TimePicker,
  Radio
} from 'antd';

const { Option } = Select;

const JournalForm = ({handleSubmit, handleCancel, loading, fields, rooms}) => {
  return (
    <>
    <Form
      {...{
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
      }}
      onFinish={handleSubmit}
      name="Day Form"
      fields={fields}
    >

      <Form.Item
        label="Room"
        name="room"
        rules={[{ required: true, message: 'Please select room!'}]}
      >
        <Select
          showSearch
          style={{ width: "100%" }}
          placeholder="Select Room"
          loading={rooms ? false : true}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
        {
          rooms ?
          rooms.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
          : null
        }
        </Select>
      </Form.Item>

      <div className="flex gap-5">
	      <div className="flex-1">
	        <Form.Item
	          label="Start Time"
	          name="start_time"
						rules={[{ required: true, message: 'Please select start time!' }]}
	        >
	          <TimePicker placeholder="Select Start Time" format="HH:mm" style={{ width: "100%" }} />
	        </Form.Item>
	      </div>
	      <div className="flex-1">
	        <Form.Item
	          label="End Time"
	          name="end_time"
						rules={[{ required: true, message: 'Please select end time!' }]}
	        >
	          <TimePicker placeholder="Select End Time" format="HH:mm" style={{ width: "100%" }} />
	        </Form.Item>
	      </div>
	    </div>

      <div>
        <Form.Item
          label="Day"
          name="day"
          rules={[{ required: true, message: 'Please select day!' }]}
        >
          <Radio.Group buttonStyle="solid" style={{width: '100%'}}>
            <Radio.Button value="1" style={{width: '14.21%', textAlign: 'center', minWidth: 50, borderRadius: 0}}>M</Radio.Button>
            <Radio.Button value="2" style={{width: '14.21%', textAlign: 'center', minWidth: 50}}>T</Radio.Button>
            <Radio.Button value="3" style={{width: '14.21%', textAlign: 'center', minWidth: 50}}>W</Radio.Button>
            <Radio.Button value="4" style={{width: '14.21%', textAlign: 'center', minWidth: 50}}>Th</Radio.Button>
            <Radio.Button value="5" style={{width: '14.21%', textAlign: 'center', minWidth: 50}}>F</Radio.Button>
            <Radio.Button value="6" style={{width: '14.21%', textAlign: 'center', minWidth: 50}}>Sa</Radio.Button>
            <Radio.Button value="7" style={{width: '14.21%', textAlign: 'center', minWidth: 50, borderRadius: 0}}>Su</Radio.Button>
          </Radio.Group>
        </Form.Item>
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

export default JournalForm;
