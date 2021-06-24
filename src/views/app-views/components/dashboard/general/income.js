import React, { useState } from 'react'
import Chart from "react-apexcharts";
import { COLOR_1 } from 'constants/ChartConstant';
import { TUGRUG } from 'constants/AppConstant';
import {
	Card,
	Select,
	Row,
	Divider,
	Descriptions,
 } from 'antd';

const { Option } = Select;

export const Income = (props) => {
  const [options, setOptions] = useState(
    {
			chart: {
				zoom: {
					enabled: false
				}
			},
			colors: [COLOR_1],
			fill: {
				type: "gradient",
				gradient: {
					shadeIntensity: 1,
					opacityFrom: 0.7,
					opacityTo: 0.9,
					stops: [0, 80, 100]
				}
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				curve: 'smooth',
				width: 3,
			},
			labels: props.options,
			xaxis: {
				type: 'datetime',
			},
			yaxis: {
				opposite: true
			},
			legend: {
				horizontalAlign: 'left'
			}
		}
  );

	return (
    <div style={{width: "100%"}}>
      <Card hoverable={"true"}>
        <Row style={{marginBottom: 20}}>
          <Select defaultValue="Weekly" style={{ width: 220, marginRight: 20 }} onChange={props.handleIncomePeriod}>
            <Option value="weekly">Weekly</Option>
            <Option value="monthly">Monthly</Option>
            <Option value="yearly">Yearly</Option>
            <Option value="all_time">All Time</Option>
          </Select>
          <Select defaultValue="Value" style={{ width: 220 }} onChange={props.handleValueChange}>
            <Option value="weekly">Value</Option>
            <Option value="monthly">Number</Option>
          </Select>
        </Row>
				<Row>
					<Descriptions
						layout="vertical"
						colon={"false"}
						column={{xl: 3, lg: 1, md: 1, sm: 1, xs: 1}}>
						<Descriptions.Item label="Registration Graph">
							<div>
								<h1>{(props.completed + props.incomplete).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{TUGRUG}</h1>
								<p>Total Paid Payments</p>
							</div>
						</Descriptions.Item>
						<Descriptions.Item span={2}>
							<div style={{width: "100%"}}>
								<Chart
								options={options}
								series={props.series}
								type="area"
								height= {300}
								/>
							</div>
						</Descriptions.Item>
					</Descriptions>
				</Row>
        <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }} />
        <Row>
					<Descriptions layout="vertical">
						<Descriptions.Item label="Total Completed Payments"><strong style={{fontSize: 18}}>{props.completed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{TUGRUG}</strong></Descriptions.Item>
						<Descriptions.Item label="Total Incomplete Payments"><strong style={{fontSize: 18}}>{props.incomplete.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{TUGRUG}</strong></Descriptions.Item>
					</Descriptions>
				</Row>
      </Card>
    </div>
	)
}


export default Income;
