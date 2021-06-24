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

export const Users = (props) => {
	return (
    <div style={{width: "100%", margin: "0px 10px"}}>
      <Card hoverable={true}>
        <Header title={props.title} color={props.color} />
        <SubHeader classes={props.class} students={props.students} />
      </Card>
    </div>
  )
}

export default Users;
