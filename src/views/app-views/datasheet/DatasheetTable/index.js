import React, { useState, useEffect, useCallback } from 'react';
import ReactDataSheet from "react-datasheet";
import DataEditor from "react-datasheet/lib/DataEditor";
import "react-datasheet/lib/react-datasheet.css";
import "./style.css";
import EditableRow from "../EditableRow";
import EditableCell from "../EditableCell";
import { DATASHEET_REGISTER_TYPE, url } from "../../../../configs/EnvironmentConfig";
import { useSelector } from 'react-redux';
import { OPERATOR, STUDENT_GROUP } from 'constants/AppConstant';
import axios from 'axios';
import { DatePicker, Input, message, Radio, Select, Skeleton, Spin } from 'antd';
import Flex from 'components/shared-components/Flex';

const header = {
    "Content-type": "application/json",
    "Authorization": `Bearer ${ localStorage.getItem("userToken") }`
}

const config = {
    "headers": header
}

const datasheetHeader = [
    { readOnly: true, dataIndex: "", className: "not-bold", width: "3%" },
    { value: "Status", readOnly: true, className: "not-bold", width: "5%" },
    { value: "Phone", readOnly: true, className: "not-bold", width: "7.5%" },
    { value: "Firstname", readOnly: true, className: "not-bold", width: "10%" },
    { value: "Lastname", readOnly: true, className: "not-bold", width: "10%" },
    { value: "Lesson", readOnly: true, className: "not-bold", width: "7.5%" },
    { value: "Register Type", readOnly: true, className: "not-bold", width: "7.5%" },
    { value: "Description", readOnly: true, className: "not-bold", width: "20%" },
    { value: "Operator", readOnly: true, className: "not-bold", width: "10%" },
    { value: "Time", readOnly: true, className: "not-bold", width: "7.5%" },
    { value: "Date", readOnly: true, className: "not-bold", width: "7.5%" },
]

const fetchDetails = (details, filter) => {
    let _filter = { ...filter }
    Object.keys(filter).forEach(item => {
        if (_filter[item]===null)
            delete _filter[item]
    })
    return axios.post(`${url}/api/utility/detail/`, { "projection": details, ..._filter, "groups": 3 }, config);
}

const fetchDatasheet = (filter) => {
    let _filter = { ...filter }
    Object.keys(filter).forEach(item => {
        if (_filter[item]===null)
            delete _filter[item]
    })
    let queryParams = Object.keys(_filter).map(item => `${item}=${_filter[item]}`).join("&");
    return axios.get(`${url}/api/datasheet/action/?${queryParams === "" ? "" : "&" + queryParams}`, config)
}

const updateDatasheet = (data) => {
    return axios.put(`${url}/api/datasheet/action/${data.id}/`, data, config);
}

const addDatasheet = (data) => {
    return axios.post(`${url}/api/datasheet/action/`, JSON.stringify(data), config)
}

const generateCellData = (id, item) => {
    return [
        { readOnly: true, value: id, className: "not-bold" },
        { value: "", dataIndex: "status", inputType: "select", editable: true },
        { value: "", dataIndex: "user_phone", inputType: "select", editable: true },
        { value: "", dataIndex: "user_firstname", inputType: "normal", editable: true },
        { value: "", dataIndex: "user_lastname", inputType: "normal", editable: true },
        { value: "", dataIndex: "lesson", inputType: "select", editable: true },
        { value: "", dataIndex: "register_type", inputType: "select", editable: true },
        { value: "", dataIndex: "description", inputType: "normal", editable: true },
        { value: "", dataIndex: "operator_firstname", inputType: "normal", readOnly: true, editable: false },
        { value: "", dataIndex: "time", inputType: "select", editable: true },
        { value: "", dataIndex: "date", inputType: "date", editable: true },
    ]
}

const validatePhoneNumber = (value) => {
    console.log(value, value.length)
    if (value.length != 8) {
        message.error("Phone number should be 8!")
        return false;
    }
    if ( /[a-zA-Z]/.test(value)) {
        message.error("Phone number should not contain any letters!")
        return false;
    }
    if (value[0] != "8" && value[0] != "9") {
        message.error("Invalid phone number!")
        return false;
    }
    return true;
}

const validateBranch = (record) => {
    if (record.branch===null) {
        message.error("Select branch!")
        return false;
    }
    return true;
}

const DatasheetTable = () => {
    const filters = useSelector(state => state.filters);
    const user = useSelector(state => state.userLogin.user);
    const currentTheme = useSelector(state => state.theme.currentTheme)
    const [ isDatasheetLoading, setDatasheetLoading ] = useState(false);
    const [ status, setStatus ] = useState([]);
    const [ lesson, setLesson ] = useState([]);
    const [ operator, setOperator ] = useState([]);
    const [ rawDatasource, setRawDataSource ] = useState([]);
    const [ dataSource, setDatasource ] = useState([]);
    const [ datasheetFilter, setDatasheetFilter ] = useState({
        operator: user.role_id === OPERATOR ? user.id : null,
        status: null,
        lesson: null,
        search: null,
        day: 3,
        date: null
    })

    const handleDatasheetFetch = useCallback(() => {
        setDatasheetLoading(true);
        // setCurrentPage(page);
        let _filters = user.role_id === OPERATOR ? datasheetFilter : { ...filters, ...datasheetFilter };
        fetchDatasheet(_filters)
            .then(res => {
                let _dataSource = [ datasheetHeader, ]
                const datasheets = res.data.data.map((item, index) => {
                    item.key = item.id + "datasheet";
                    let _cellData = generateCellData(index + 1, item);
                    _dataSource.push(_cellData);
                    return item;
                })
                const branch = user.role_id === OPERATOR ? user.branch : filters.branch
                setRawDataSource([ ...datasheets, {
                    id: 0,
                    key: "0datasheet",
                    user_phone: null,
                    user_firstname: null,
                    user_lastname: null,
                    operator_firstname: user.firstname,
                    register_type: null,
                    description: null,
                    time: null,
                    user: null,
                    operator: user.id,
                    status: null,
                    lesson: null,
                    groups: STUDENT_GROUP,
                    branch
                }])
                _dataSource.push(generateCellData(_dataSource.length, {
                    id: 0,
                    key: "0datasheet",
                    user_phone: null,
                    user_firstname: null,
                    user_lastname: null,
                    operator_firstname: user.firstname,
                    register_type: null,
                    description: null,
                    time: null,
                    user: null,
                    operator: user.id,
                    status: null,
                    lesson: null,
                    groups: STUDENT_GROUP,
                    branch
                }));
                setDatasource(_dataSource)
                setDatasheetLoading(false);
            })
            .catch(err => {
                console.log(err.response.data)
            })
    }, [ user, filters, datasheetFilter ])

    const handleDetailFetch = useCallback(() => {
        let _filters = user.role_id === OPERATOR ? datasheetFilter : { ...filters, ...datasheetFilter };
        let detailList = []
        if (lesson.length===0)
            detailList.push("lesson")
        if (status.length===0)
            detailList.push("datasheet_status")
        if (detailList.length===0)
            return;
        fetchDetails([ "lesson", "datasheet_status", "user" ], _filters)
            .then(res => {
                if ("lesson" in res.data.data)
                    setLesson(res.data.data.lesson);
                if ("datasheet_status" in res.data.data)
                    setStatus(res.data.data.datasheet_status);
                if ("user" in res.data.data)
                    setOperator(res.data.data.user);
            })
            .catch(err => {
                console.log(err.response.data);
            })
    }, [ user, datasheetFilter, filters ])

    const handleDatasheetUpdate = async (data) => {
        // return updateDatasheet(data, null)
        try {
            const res = await updateDatasheet(data, null)
            if (res.data.success)
                return true;
        } catch(err) {
            handleDatasheetFetch()
            Object.keys(err.response.data).forEach(item => {
                message.error(item + ": " + err.response.data[item])
            })
        }
        return false;
    }

    const handleNewDatasheetWithExisting = (item, additional, { cell, row, col, value, ...restProps }) => {
        delete item.id;
        const newItem = { 
            ...item, 
            ...additional,
            user_phone: value.phone, 
            user_firstname: value.firstname,
            user_lastname: value.lastname === null ? "" : value.lastname,
        };
        addDatasheet(newItem)
            .then(res => handleDatasheetFetch(1))
            .catch(err => {
                handleDatasheetFetch()
                Object.keys(err.response.data).forEach(item => {
                    message.error(item + ": " + err.response.data[item])
                })
            });
        return newItem;
    }

    const handleDatasheetChange = async (changes) => {
        const rawGrid = [ ...rawDatasource ];
        await changes.forEach(async ({ cell, row, col, value, ...restProps }) => {
            const item = { ...rawGrid[row - 1] };
            if (item.id===0)
                if (!validateBranch(item))
                    return;
            if (restProps.existing) {
                rawGrid[row - 1] = handleNewDatasheetWithExisting(item, { user: value.id }, { cell, row, col, value, ...restProps });
                return;
            }
            if (cell.dataIndex === "user_phone" && !validatePhoneNumber(value)) {
                return;
            }
            item[cell.dataIndex] = value;
            rawGrid[row - 1][cell.dataIndex] = value;
            if (item.id===0 && item.user_firstname && item.user_phone) {
                delete item.user;
                item.phone = item.user_phone;
                item.lastname = item.user_lastname;
                item.firstname = item.user_firstname;
                rawGrid[row - 1] = handleNewDatasheetWithExisting(item, {}, { cell, row, col, value, ...restProps });
                return;
            }
            if (item.id != 0 && cell.dataIndex === "user_phone" || cell.dataIndex === "user_firstname" || cell.dataIndex === "user_lastname") {
                rawGrid.forEach(_item => {
                    if (_item.user===item.user)
                        _item[cell.dataIndex] = value;
                })
                item.with_user = true;
                item.phone = item.user_phone;
                item.lastname = item.user_lastname;
                item.firstname = item.user_firstname;
                item.groups = STUDENT_GROUP;
            }
            if (item.id != 0) {
                handleDatasheetUpdate(item)
            }
        });
        setRawDataSource(rawGrid)
    }

    const handleFilterChange = (value, e) => {
        let name, _value;
        if (typeof value==="object") {
            name = value.target.name;
            _value = value.target.value;
        } else {
            name = "name" in e ? e.name : "search";
            _value = value
        }
        if (value === "all")
            setDatasheetFilter({
                ...datasheetFilter,
                [ name ]: null
            })
        else 
            setDatasheetFilter({
                ...datasheetFilter,
                [ name ]: _value
            })
    }

    const handleDiableClick = () => {
        if (filters.branch===null)
            message.error("Select branch!");
    }

    const handleSelectClear = (name) => {
        setDatasheetFilter({
            ...datasheetFilter,
            [ name ]: null
        })
    }

    const handleFilterDateSelect = (value) => {
        setDatasheetFilter({
            ...datasheetFilter,
            day: -1,
            date: value.format('YYYY-MM-DD')
        })
    }

    useEffect(() => {
        handleDatasheetFetch(1);
        handleDetailFetch();
    }, [ filters, datasheetFilter, handleDatasheetFetch, handleDetailFetch ])

    return (
        <div className="sheet-container">
            <Flex justifyContent="space-between" className="filter-container">
                <Flex justifyContent="end" className="filter-container">
                    <Radio.Group defaultValue="3" value={ datasheetFilter.day } name="day" onChange={ handleFilterChange } buttonStyle="solid">
                        <Radio.Button value={ 1 }>1 day</Radio.Button>
                        <Radio.Button value={ 3 }>3 days</Radio.Button>
                        <Radio.Button value={ 7 }>7 days</Radio.Button>
                    </Radio.Group>
                    <DatePicker onSelect={ handleFilterDateSelect } className="select-width" />
                </Flex>
                <Flex justifyContent="end" className="filter-container">
                    <Select allowClear onClear={ handleSelectClear.bind(this, "operator") } className="select-width" onClick={ user.role_id !== OPERATOR ? handleDiableClick : null } defaultValue={ datasheetFilter.operator === null ? null : datasheetFilter.operator } disabled={ filters.branch === null && user.role_id !== OPERATOR ? true : false } placeholder="Operator" onSelect={ handleFilterChange }>
                        { operator.length != 0 ? operator.map(item => <Select.Option name="operator" key={ item.id + "datasheet-filter-operator" } value={ item.id }> { item.firstname } </Select.Option>) : null}
                    </Select>
                    <Select allowClear onClear={ handleSelectClear.bind(this, "lesson") } className="select-width" onClick={ user.role_id !== OPERATOR ? handleDiableClick : null } disabled={ filters.branch === null && user.role_id !== OPERATOR ? true : false } placeholder="Lesson" onSelect={ handleFilterChange }>
                        { lesson.length != 0 ? lesson.map(item => <Select.Option name="lesson" key={ item.id + "datasheet-filter-lesson" } value={ item.id }> { item.name } </Select.Option>) : null}
                    </Select>
                    <Select allowClear onClear={ handleSelectClear.bind(this, "status") } className="select-width" onClick={ user.role_id !== OPERATOR ? handleDiableClick : null } disabled={ filters.branch === null && user.role_id !== OPERATOR ? true : false } placeholder="Datasheet Status" onSelect={ handleFilterChange }>
                        { status.length != 0 ? status.map(item => <Select.Option name="status" key={ item.id + "datasheet-filter-status" } value={ item.id }> { item.name } </Select.Option>) : null}
                    </Select>
                    <Input.Search allowClear name="search" onSearch={ handleFilterChange } placeholder="Search..." className="select-width" />
                </Flex>
            </Flex>
            { isDatasheetLoading ? (
                <Flex justifyContent="center">
                    <Skeleton />
                </Flex>
            ) : (
                <ReactDataSheet
                    className="test"
                    data={dataSource}
                    valueRenderer={(cell, row, col) => {
                        if (rawDatasource.length === 0)
                            return cell.dataIndex;
                        if (row === 0 || col === 0)
                            return cell.value;
                        let body = rawDatasource[row - 1][cell.dataIndex];
                        let _body;
                        const record = rawDatasource[row - 1];
                        switch(cell.dataIndex) {
                            case "status":
                                if (record.status === null)
                                    break;
                                _body = status.find(item => item.id === record.status);
                                body = _body === null || _body === undefined ? cell.value : _body.name;
                                break;
                            case "lesson":
                                if (record.lesson === null)
                                    break;
                                _body = lesson.find(item => item.id === record.lesson);
                                body = _body === null || _body === undefined ? cell.value : _body.name;
                                break;
                            case "register_type":
                                if (record.register_type === null)
                                    break;
                                _body = DATASHEET_REGISTER_TYPE.find(item => item.id === record.register_type);
                                body = _body === null || _body === undefined ? cell.value : _body.name;
                                break;
                            default:
                                break;
                        }
                        return body;
                    }}
                    onContextMenu={(e, cell, i, j) =>
                        cell.readOnly ? e.preventDefault() : null
                    }
                    rowRenderer={ EditableRow }
                    dataEditor={ props => {
                        if (props.cell.inputType === "normal" || (props.cell.dataIndex==="user_phone" && rawDatasource[props.row - 1].id != 0))
                            return <DataEditor { ...props } />
                        return (
                            <EditableCell
                                { ...props }
                                editable={ props.cell.editable }
                                record={ rawDatasource[props.row - 1] }
                                inputType={ props.cell.inputType }
                                datasheetStatus={ status }
                                lesson={ lesson }
                                dataIndex={ props.cell.dataIndex }
                                handleSave={ handleDatasheetChange }
                                editing={ true }
                            /> )
                    } }

                    onCellsChanged={ handleDatasheetChange }
                />
            ) }
        </div>
    )
}

export default DatasheetTable;
