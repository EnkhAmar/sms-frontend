import React from 'react'
import {
	Card,
  List,
 } from 'antd';

const Head = () => (
  <div style={{textAlign: "center"}}>
    <h2>Classes & Students</h2>
  </div>
)

 const Header = ({data}) => {
   return (
     <div style={{width: "100%"}}>
      <Card bodyStyle={{padding: "5px"}}>
        <Head />
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 5,
          }}
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <Card hoverable={true} bodyStyle={{padding: "8px 20px 0px 10px"}}>
                <h5>{item.title}</h5>
                <h3 style={{marginBottom: "0px"}}>{item.number}</h3>
              </Card>
            </List.Item>
          )}
        />
      </Card>
     </div>
   )
 }

 export default Header;
