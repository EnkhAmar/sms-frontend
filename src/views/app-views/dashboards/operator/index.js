import React from 'react'
import Users from '../../components/dashboard/operator/users';
import Operators from '../../components/dashboard/operator/operators';
import {
  Descriptions,
} from 'antd';

const Operator = () => {
  //  
	return (
		<div>
      <Descriptions
        layout="vertical"
        column={{ xxl: 4, xl: 3, lg: 2, md: 1, sm: 1, xs: 1 }}
      >
        <Descriptions.Item span={1}>
          <Users />
        </Descriptions.Item>
        <Descriptions.Item>
          <Operators />
        </Descriptions.Item>
      </Descriptions>
		</div>
	)
}

export default Operator;
