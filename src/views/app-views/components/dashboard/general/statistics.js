import React from 'react';
import { COLOR_1, COLOR_2, COLOR_4 } from 'constants/ChartConstant';
import {
	Card,
	Row,
	Col,
	Descriptions,
  Button,
  Tooltip,
 } from 'antd';

export const Stats = (props) => {

  return (
		<div className="full-width">
      <Card hoverable={"true"}>
        <Descriptions
          title="Students"
          layout="vertical"
          colon={"false"}
          column={{lg: 3, md: 1, sm: 1, xs: 1}}>
          <Descriptions.Item label="Overview of students">
            <Button type="primary" size="large">Refresh</Button>
          </Descriptions.Item>
          <Descriptions.Item>
            <div className="full-width">
              <h4 className="stat-subtitle">Interested Students</h4>
							<p className="stat-subtitle">{props.confirmed + props.unconfirmed}</p>
              <Row>
                <Tooltip placement="top" title="Confirmed">
                  <Col className="stat-col color-white" flex={props.confirmed / (props.confirmed + props.unconfirmed)} style={{backgroundColor: COLOR_1}}>{props.confirmed}</Col>
                </Tooltip>
                <Tooltip placement="top" title="Unconfirmed">
                  <Col className="stat-col color-white" flex={props.unconfirmed / (props.confirmed + props.unconfirmed)} style={{backgroundColor: COLOR_2}}>{props.unconfirmed}</Col>
                </Tooltip>
              </Row><br />
              <h4 className="stat-subtitle">Confirmed Students by Status</h4>
							<p className="stat-subtitle">{props.confirmed}</p>
              <Row>
                <Tooltip placement="top" title="Confirmed: ">
                  <Col className="stat-col" flex={5} style={{backgroundColor: COLOR_1}}></Col>
                </Tooltip>
                <Tooltip placement="top" title="Confirmed: ">
                  <Col className="stat-col" flex={5} style={{backgroundColor: COLOR_2}}></Col>
                </Tooltip>
              </Row><br />
              <h4 className="stat-subtitle">Confirmed Students by Payment</h4>
							<p className="stat-subtitle">{props.confirmed}</p>
              <Row>
                <Tooltip placement="top" title="Fully Paid">
                  <Col className="stat-col color-white" flex={props.paid / (props.paid + props.discounted + props.pending)} style={{backgroundColor: COLOR_1}}>{props.paid > 0 ? props.paid : ""}</Col>
                </Tooltip>
                <Tooltip placement="top" title="Discount">
                  <Col className="stat-col color-white" flex={props.discounted / (props.paid + props.discounted + props.pending)} style={{backgroundColor: COLOR_2}}>{props.discounted > 0 ? props.discounted : ""}</Col>
                </Tooltip>
                <Tooltip placement="top" title="Pending">
                  <Col className="stat-col color-white" flex={props.pending / (props.paid + props.discounted + props.pending)} style={{backgroundColor: COLOR_4}}>{props.pending > 0 ? props.pending : ""}</Col>
                </Tooltip>
              </Row><br />
              <h4 className="stat-subtitle">Recurring Students</h4>
							<p className="stat-subtitle">{props.recurring}</p>
              <Row>
                <Tooltip placement="top" title="Recurring">
                  <Col className="stat-col color-white" flex={props.recurring} style={{backgroundColor: COLOR_1}}>{props.recurring > 0 ? props.recurring : ""}</Col>
                </Tooltip>
              </Row>
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
	)
}

export default Stats;
