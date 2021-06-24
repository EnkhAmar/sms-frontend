import React, { useState } from 'react';
import Income from '../../components/dashboard/general/income';
import Stats from '../../components/dashboard/general/statistics';
import PieChart from '../../components/dashboard/general/pieChart';
import ActiveStudents from '../../components/dashboard/general/activeStudents';
import LessonSales from '../../components/dashboard/general/lessonSales';
import './general.css';
import {
	Row,
	Col,
 } from 'antd';

 const dataSeries = {
 	monthDataSeries1: {
 		prices: [
 			8107.85,
 			8128.0,
 			8122.9,
 			8165.5,
 			8340.7,
 			8423.7,
 			8423.5,
 			8514.3,
 			8481.85,
 			8487.7,
 			8506.9,
 			8626.2,
 			8668.95,
 			8602.3,
 			8607.55,
 			8512.9,
 			8496.25,
 			8600.65,
 			8881.1,
 			9340.85
 		],
 		dates: [
 			"11/13 2017",
 			"11/14 2017",
 			"11/15 2017",
 			"11/16 2017",
 			"11/17 2017",
 			"11/20 2017",
 			"11/21 2017",
 			"11/22 2017",
 			"11/23 2017",
 			"11/24 2017",
 			"11/27 2017",
 			"11/28 2017",
 			"11/29 2017",
 			"11/30 2017",
 			"12/01 2017",
 			"12/04 2017",
 			"12/05 2017",
 			"12/06 2017",
 			"12/07 2017",
 			"12/08 2017"
 		]
 	}
 }

export const General = () => {
	const [completed, setCompleted] = useState(5940000);
	const [incomplete, setIncomplete] = useState(1000);
	const [active, setActive] = useState(2435);
	const [inactive, setInactive] = useState(1253);
	const [pieSeries, setPieSeries] = useState(
    [44, 55, 13, 43, 22]
  );
  const [pieOptions, setPieOptions] = useState(
    ['Type A', 'Type B', 'Type C', 'Type D', 'Type E']
  );
	const [lessonSeries, setLessonSeries] = useState(
    [{
			name: 'Expected',
			data: [44000000, 55000000, 57000000, 56000000, 61000000, 58000000, 63000000, 60000000, 66000000]
		}, {
			name: 'Income',
			data: [35000000, 41000000, 36000000, 26000000, 45000000, 48000000, 52000000, 53000000, 41000000]
		}]
  );
  const [lessonOptions, setLessonOptions] = useState(
		['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
	);
	const [incomeSeries, setIncomeSeries] = useState(
    [{
			name: "Income",
			data: dataSeries.monthDataSeries1.prices
		}]
  );
  const [incomeOptions, setIncomeOptions] = useState(
    dataSeries.monthDataSeries1.dates
  );
	const [confirmed, setConfirmed] = useState(4250);
	const [unconfirmed, setUncorfirmed] = useState(1260);
	const [paid, setPaid] = useState(2250);
	const [discounted, setDiscounted] = useState(1000);
	const [pending, setPending] = useState(1000);
	const [recurring, setRecurring] = useState(256);

	const handleIncomePeriod = () => {

	}

	const handleIncomeValue = () => {

	}

	const handleLessonPeriod = () => {

	}

	return (
    <div style={{padding: "0px 20px"}}>
			<Row>
				<Income
					completed={completed}
					incomplete={incomplete}
					series={incomeSeries}
					options={incomeOptions}
					handlePeriodChange={handleIncomePeriod}
					handleValueChange={handleIncomeValue}
				/>
			</Row>
			<Row>
				<Stats
					confirmed={confirmed}
					unconfirmed={unconfirmed}
					paid={paid}
					discounted={discounted}
					pending={pending}
					recurring={recurring}
				/>
			</Row>
			<Row>
				<LessonSales series={lessonSeries} options={lessonOptions} handlePeriodChange={handleLessonPeriod} />
			</Row>
			<Row gutter={20}>
				<Col span={12} style={{style}}>
					<PieChart series={pieSeries} options={pieOptions} />
				</Col>
				<Col span={12} style={{style}}>
					<ActiveStudents inactive={inactive} active={active} />
				</Col>
			</Row>
    </div>
	)
}

const style = {
	padding: '8px 0',
}

export default General
