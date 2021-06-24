import {
	Form,
	Input,
	Select,
  Button,
  Col,
	InputNumber,
} from 'antd';
import {
	UploadOutlined,
} from '@ant-design/icons';
import { TUGRUG, ADMIN, SUPERADMIN } from 'constants/AppConstant';
import Flex from 'components/shared-components/Flex';
import './styles.css';

const { Option } = Select;

const LessonForm = ({handleCancel, handleSubmit, fields, handleUpdate, type, branches, schools, getBranches, role, submit}) => (
  <Form
    {...{
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
    }}
    onFinish={type==='add' ? handleSubmit : handleUpdate}
    name="Lesson Form"
		fields={fields}
  >

    <div className="flex gap-5">
      <div className="flex-1">
        <Form.Item
          label="Room Name"
          name="name"
          rules={[{ required: true, message: 'Please input room name!' }]}
        >
          <Input placeholder="Enter Room Name" />
        </Form.Item>
      </div>
      <div className="flex-1">
        <Form.Item
          label="Capacity"
          name="capacity"
          rules={[{ required: true, message: 'Please input room capacity!'}]}
        >
          <InputNumber type="number" min={0} max={4294967295} placeholder="Enter room capacity" style={{width: "100%"}}/>
        </Form.Item>
      </div>
    </div>

    {
      type==="add" && (role===ADMIN || role===SUPERADMIN) ?
      <div className="flex gap-5">
        {
          schools && schools.length > 0 ?
          <div className="flex-1">
            <Form.Item
            label="School"
            name="school"
            rules={[{ required: true, message: 'Please select a school!' }]}
            >
              <Select
							 	showSearch
								style={{ width: "100%" }}
								placeholder="Select a school"
								onChange={getBranches}
								filterOption={(input, option) =>
		              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
		            }
							>
                {
                  schools.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
                }
              </Select>
            </Form.Item>
          </div>
          : null
        }
  			<div className="flex-1">
  		    <Form.Item
  		      label="Branch"
  		      name="branch"
						rules={[{ required: true, message: 'Please select a branch!' }]}
  		    >
            <Select
              placeholder="Select branch"
              showSearch
              disabled={branches ? false : true}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {
                branches ?
                branches.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
                : null
              }
            </Select>
  		    </Form.Item>
  			</div>
  		</div>
      : null
    }

    <Form.Item>
      <Col style={{ textAlign: 'right' }}>
      <Button onClick={handleCancel}>
        Cancel
      </Button>
      <Button type="primary" loading={submit} htmlType="submit" style={{ marginLeft: 8 }}>
				{
					type==='add' ?
					'Submit'
					:
					'Save'
				}
      </Button>
      </Col>
    </Form.Item>
  </Form>
)

export default LessonForm;
