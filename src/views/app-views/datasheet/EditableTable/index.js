import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, Pagination, Space } from 'antd';
import EditableRow from '../EditableRow';
import EditableCell from '../EditableCell';
import axios from 'axios';
import { url } from "../../../../configs/EnvironmentConfig";
import Flex from 'components/shared-components/Flex';
import { useSelector } from 'react-redux';
import { OPERATOR } from 'constants/AppConstant';

const components = {
    body: {
        row: EditableRow,
        cell: EditableCell,
    },
};

const columnsModel = [
    {
        title: 'Status',
        dataIndex: 'status',
        width: '7.5%',
        editable: true,
        inputType: "select",
        align: "center",
    },
    {
        title: 'Phone',
        dataIndex: 'user_phone',
        width: '10%',
        editable: true,
        inputType: "select",
        align: "center",
        required: true
    },
    {
        title: 'Firstname',
        dataIndex: 'user_firstname',
        width: '7.5%',
        editable: true,
        inputType: "normal",
        align: "center",
        required: true
    },
    {
        title: 'Lastname',
        dataIndex: 'user_lastname',
        width: '7.5%',
        editable: true,
        inputType: "normal",
        align: "center"
    },
    {
        title: 'Lesson',
        dataIndex: 'lesson',
        editable: true,
        inputType: "select",
        width: '10%',
        align: "center"
    },
    {
        title: 'Register Type',
        dataIndex: 'register_type',
        editable: true,
        inputType: "select",
        width: '10%',
        align: "center"
    },
    {
        title: 'Description',
        dataIndex: 'description',
        editable: true,
        inputType: "normal",
        width: '17.5%',
        align: "center"
    },
    {
        title: 'Operator',
        dataIndex: 'operator_firstname',
        editable: false,
        inputType: "select",
        width: '10%',
        align: "center"
    },
    {
        title: 'Time',
        dataIndex: 'time',
        editable: true,
        inputType: "time",
        width: '10%',
        align: "center"
    },
    {
        title: 'Date',
        dataIndex: 'created',
        editable: true,
        inputType: "date",
        width: '10%',
        align: "center"
    }
];

const header = {
    "Content-type": "application/json",
    "Authorization": `Bearer ${ localStorage.getItem("userToken") }`
}

const config = {
    "headers": header
}

const fetchDetails = (details, filter) => {
    let _filter = { ...filter }
    if ("school" in _filter && _filter.school===null)
        delete _filter.school
    if ("branch" in _filter && _filter.branch===null)
        delete _filter.branch
    console.log({ "projection": details, ..._filter });
    return axios.post(`${url}/api/utility/detail/`, { "projection": details, ..._filter }, config);
}

const fetchDatasheet = (page, filter) => {
    let _filter = { ...filter }
    if ("school" in _filter && _filter.school===null)
        delete _filter.school
    if ("branch" in _filter && _filter.branch===null)
        delete _filter.branch
    let queryParams = Object.keys(_filter).map(item => `${item}=${_filter[item]}`).join("&");
    return axios.get(`${url}/api/datasheet/action/?page=${page}${queryParams==="" ? "" : "&" + queryParams}`, config)
}

const updateDatasheet = (data, fitler) => {
    return axios.put(`${url}/api/datasheet/action/${data.id}/`, data, config);
}

const EditableTable = () => {

    const filters = useSelector(state => state.filters);
    const user = useSelector(state => state.userLogin.user);
    const [ pageCount, setPageCount ] = useState(0);
    const [ isDatasheetLoading, setDatasheetLoading ] = useState(false);
    const [ status, setStatus ] = useState([]);
    const [ lesson, setLesson ] = useState([]);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ dataSource, setDatasource ] = useState([]);

    const columns = columnsModel.map(col => {
        if (!col.editable) {
            return col;
        }
        let datasheetStatus = col.dataIndex === "status" ? status : null;
        let _lesson = col.dataIndex === "lesson" ? lesson : null;
        return {
            ...col,
            key: col.id + "datasheet",
            onCell: record => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                inputType: col.inputType,
                datasheetStatus,
                lesson: _lesson,
                required: col.required,
                handleSave: handleSave,
            }),
        };
    });
    useEffect(() => {
        handlePaginationChange(1);
        handleDetailFetch();
    }, [ filters ])

    const handlePaginationChange = page => {
        setDatasheetLoading(true);
        setCurrentPage(page);
        let _filters = user.role_id===OPERATOR ? { branch: user.branch } : filters;
        fetchDatasheet(page, _filters)
            .then(res => {
                const datasheets = res.data.results.map(item => { item.key = item.id + "datasheet"; return item; })
                setPageCount(res.data.count)
                setDatasource([{
                    id: 0,
                    key: "0datasheet",
                    user_phone: "",
                    user_firstname: "",
                    user_lasttname: "",
                    operator_firstname: "",
                    register_type: "",
                    description: "",
                    time: "",
                    user: "",
                    operator: "",
                    status: "",
                    lesson: "",
                    branch: filters.branch
                }, ...datasheets])
                setDatasheetLoading(false);
            })
            .catch(err => {
                console.log(err.response.data)
            })
    }
    
    const handleDetailFetch = () => {
        let _filters = user.role_id===OPERATOR ? { branch: user.branch } : filters;
        fetchDetails([ "lesson", "datasheet_status" ], _filters)
            .then(res => {
                setLesson(res.data.data.lesson);
                setStatus(res.data.data.datasheet_status);
            })
            .catch(err => {
                console.log(err.response.data);
            })
    }

    const handleDatasheetUpdate = data => {
        console.log(data.status)
        updateDatasheet(data, null)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleDatasheetCreate = data => {

    }

    const handleDelete = key => {
        // const dataSource = [...this.state.dataSource];
        // setState({
        //     dataSource: dataSource.filter(item => item.key !== key),
        // });
    };

    const handleAdd = () => {
        // const { count, dataSource } = state;
        // const newData = {
        //     key: count,
        //     name: `Edward King ${count}`,
        //     age: 32,
        //     address: `London, Park Lane no. ${count}`,
        // };
        // setState({
        //     dataSource: [...dataSource, newData],
        //     count: count + 1,
        // });
    };

    const handleSave = row => {
        console.log(row);
        if (row.id != 0)
            handleDatasheetUpdate(row);
        else
            handleDatasheetCreate(row);
        if (row.status != null)
            row.status = status.find(item => item.id===row.status).name;
        if (row.lesson != null)           
            row.lesson = lesson.find(item => item.id===row.lesson).name;
        const newData = [ ...dataSource ];
        const index = newData.findIndex(item => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setDatasource(newData)
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Table
                loading = { isDatasheetLoading }
                components={components}
                rowClassName={() => 'editable-row'}
                bordered={ true }
                dataSource={dataSource}
                columns={columns}
                pagination={ false }
            />
            <Flex justifyContent="end">
                <Pagination current={ currentPage } onChange={ handlePaginationChange } total={ pageCount } pageSize={ 20 } />
            </Flex>
        </div>
    )
}

// class EditableTable extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             dataSource: [
//                 {
//                     key: '0',
//                     name: 'Edward King 0',
//                     age: '32',
//                     address: 'London, Park Lane no. 0',
//                 },
//                 {
//                     key: '1',
//                     name: 'Edward King 1',
//                     age: '32',
//                     address: 'London, Park Lane no. 1',
//                 },
//             ],
//             count: 2,
//         };
//     }

//     handleDelete = key => {
//         const dataSource = [...this.state.dataSource];
//         this.setState({
//             dataSource: dataSource.filter(item => item.key !== key),
//         });
//     };

//     handleAdd = () => {
//         const { count, dataSource } = this.state;
//         const newData = {
//             key: count,
//             name: `Edward King ${count}`,
//             age: 32,
//             address: `London, Park Lane no. ${count}`,
//         };
//         this.setState({
//             dataSource: [...dataSource, newData],
//             count: count + 1,
//         });
//     };

//     handleSave = row => {
//         console.log("dwqdwqwdq");
//         const newData = [ ...this.state.dataSource ];
//         const index = newData.findIndex(item => row.key === item.key);
//         const item = newData[index];
//         console.log(item);
//         newData.splice(index, 1, { ...item, ...row });
//         this.setState({
//             dataSource: newData,
//         });
//     };

//     render() {
//         const { dataSource } = this.state;
//         const components = {
//             body: {
//                 row: EditableRow,
//                 cell: EditableCell,
//             },
//         };
//         const columns = this.columns.map(col => {
//             if (!col.editable) {
//                 return col;
//             }

//             return {
//                 ...col,
//                 onCell: record => ({
//                     record,
//                     editable: col.editable,
//                     dataIndex: col.dataIndex,
//                     title: col.title,
//                     handleSave: this.handleSave,
//                 }),
//             };
//         });
//         return (
//             <div>
//                 <Button
//                     onClick={this.handleAdd}
//                     type="primary"
//                     style={{
//                         marginBottom: 16,
//                     }}
//                 >
//                     Add a row
//                 </Button>
//                 <Table
//                     components={components}
//                     rowClassName={() => 'editable-row'}
//                     bordered
//                     dataSource={dataSource}
//                     columns={columns}
//                 />
//             </div>
//         );
//     }
// }

export default EditableTable;