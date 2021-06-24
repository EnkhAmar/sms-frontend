import React, { useState } from 'react'
import Chart from "react-apexcharts";
import { COLORS} from 'constants/ChartConstant';
import {
	Card,
 } from 'antd';

export const PieChart = (props) => {
  const [options, setOptions] = useState(
    {
			colors: COLORS,
			labels: props.options,
			responsive: [{
				breakpoint: 480,
				options: {
					chart: {
						width: 200
					},
					legend: {
						position: 'bottom'
					}
				}
			}]
		}
  );

	return (
    <div style={{height: 400}}>
      <Card title="Payment Types" hoverable={"true"} bodyStyle={{height: 340}}>
    		<Chart
    			options={options}
    			series={props.series}
    			height= {300}
          type="pie"
    		/>
      </Card>
    </div>
  )
}

export default PieChart;
