import React from 'react';
import {
  Tag
} from 'antd';

const Days = ({days}) => {
  return (
    <div>
      <Tag color={days.includes(1) ? "green" : "#d9d9d9"}>M</Tag>
      <Tag color={days.includes(2) ? "green" : "#d9d9d9"}>T</Tag>
      <Tag color={days.includes(3) ? "green" : "#d9d9d9"}>W</Tag>
      <Tag color={days.includes(4) ? "green" : "#d9d9d9"}>Th</Tag>
      <Tag color={days.includes(5) ? "green" : "#d9d9d9"}>F</Tag>
      <Tag color={days.includes(6) ? "green" : "#d9d9d9"}>Sa</Tag>
      <Tag color={days.includes(7) ? "green" : "#d9d9d9"}>Su</Tag>
    </div>
  )
}

export default Days;
