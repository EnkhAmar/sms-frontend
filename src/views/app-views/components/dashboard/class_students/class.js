import React from 'react'
import {
	Card,
 } from 'antd';

const Header = ({title, color}) => (
  <h4 style={{color: color}}>{title}</h4>
);

const SubHeader = ({classes, students}) => (
  <h5 style={{color: "#5ab783"}}>{classes} class {students} students</h5>
);

const Body = ({time, title}) => {
    const times = time.map((item, i) =>
      <div key={title + i}>{item.start} {item.instructor} - {item.students}</div>
    );
    return times;
}

export const Class = (props) => {
	return (
    <div style={{width: "100%"}}>
      <Card hoverable={true}>
        <Header title={props.title} color={props.color} />
        <SubHeader classes={props.class} students={props.students} />
        <Body time={props.time} title={props.title} />
      </Card>
    </div>
  )
}

export default Class;
