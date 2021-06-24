import React from 'react';
import {
  TeamOutlined
} from '@ant-design/icons';
import {
	Card,
  Progress,
	Row,
	Col,
 } from 'antd';

export const ActiveStudents = (props) => {
  const heading = (
    <div style={{textAlign: 'center'}}>
      <div style={{fontSize: 40}}>
        <TeamOutlined />
      </div>
      <div style={{fontSize: 40}}>
        {props.active + props.inactive}
      </div>
      <div>
        Registered Users
      </div>
    </div>
  );

	return (
    <div style={{height: 400}}>
      <Card title={heading} hoverable={"true"} bodyStyle={{height: 220}}>
        <Row>
          <Progress percent={Math.round((((props.active + props.inactive) / (props.active + props.inactive))*100) * 10) / 10} success={{ percent: Math.round(((props.active / (props.active + props.inactive))*100) * 10) / 10 }} showInfo={false} strokeLinecap="square" s/>
        </Row>
        <Row gutter={20}>
          <Col span={12}>
            <h4>{props.active} ( {Math.round(((props.active / (props.active + props.inactive))*100) * 10) / 10}% )</h4>Active Students
          </Col>
          <Col span={12}>
            <div style={{float: "right"}}>
              <h4 style={{textAlign: "right"}}>{props.inactive} ( {Math.round(((props.inactive / (props.active + props.inactive))*100) * 10) / 10}% )</h4>Inactive Students
            </div>
          </Col>
        </Row>
      </Card>
    </div>
	)
}

export default ActiveStudents;
