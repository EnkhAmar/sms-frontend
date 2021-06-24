import React, { useState } from 'react'
import Chart from "react-apexcharts";
import { COLOR_1, COLOR_2, COLOR_4 } from 'constants/ChartConstant';
import { TUGRUG } from 'constants/AppConstant';
import {
	Card,
	Select,
	Row,
 } from 'antd';
 const { Option } = Select;

export const LessonSales = (props) => {
  const [options, setOptions] = useState(
    {
			plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '55%',
					endingShape: 'rounded'
				},
			},
			colors: [COLOR_1, COLOR_2, COLOR_4],
			dataLabels: {
				enabled: false
			},
			stroke: {
				show: true,
				width: 2,
				colors: ['transparent']
			},
			xaxis: {
				categories: props.options,
			},
			fill: {
				opacity: 1
			},
			tooltip: {
				y: {
					formatter: val => (`${val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${TUGRUG}`)
				}
			}
		}
  );

	return (
    <div style={{width: "100%"}}>
      <Card title="Lesson Sales" hoverable={"true"}>
        <Row style={{marginBottom: 20}}>
          <Select defaultValue="Weekly" style={{ width: 220, marginRight: 20 }} onChange={props.handleChange}>
            <Option value="weekly">Weekly</Option>
            <Option value="monthly">Monthly</Option>
            <Option value="yearly">Yearly</Option>
            <Option value="all_time">All Time</Option>
          </Select>
        </Row>
  			<Chart
  				options={options}
  				series={props.series}
  				height= {400}
  				type="bar"
  			/>
      </Card>
    </div>
	)
}

export default LessonSales;
