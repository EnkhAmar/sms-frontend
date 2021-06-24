import React from 'react';
import { ClassData, Data } from './DemoData.js';
import Class from '../../components/dashboard/class_students/class';
import Header from '../../components/dashboard/class_students/header';
import {
  List,
} from 'antd';

const ClassStudents = () => {
  return (
    <div>
      <Header data={Data} />
      <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 4,
        xxl: 4,
      }}
      dataSource={ClassData}
      renderItem={item => (
        <List.Item>
          <Class
            title={item.name}
            color={item.color}
            class={item.class}
            students={item.students}
            time={item.time}
          />
        </List.Item>
      )}
      />
    </div>
  )
}

export default ClassStudents;
