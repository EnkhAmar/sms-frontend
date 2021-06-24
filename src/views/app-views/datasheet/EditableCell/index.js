import React, { useState, useEffect, useRef } from 'react';
import { Input, Form, message, TimePicker } from 'antd';
import Select from 'react-select'
import { DATASHEET_REGISTER_TYPE, DATASHEET_TIME, url } from 'configs/EnvironmentConfig';
import AsyncSelect from 'react-select/async';
import './style.css';
import axios from 'axios';

const header = {
    "Content-type": "application/json",
    "Authorization": `Bearer ${ localStorage.getItem("userToken") }`
}

const config = {
    "headers": header
}

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    inputType,
    required,
    datasheetStatus,
    lesson,
    attributesRenderer,
    editing,
    updated,
    row,
    col,
    cell,
    onChange,
    onRevert,
    onKeyDown,
    ...restProps
}) => {
    // const [editing, setEditing] = useState(false);
    const inputRef = useRef();
    let body = children;

    useEffect(() => {
        if (editing && inputType === "normal") {
            inputRef.current.focus();
        }
    }, [ editing, inputType, ]);

    let options = [];
    switch(dataIndex) {
        case "status":
            options = datasheetStatus.filter(item => record.branch === item.branch);
            break;
        case "lesson":
            options = lesson.filter(item => record.branch === item.branch);
            break;
        case "register_type":
            options = DATASHEET_REGISTER_TYPE;
            break;
        case "time":
            options = DATASHEET_TIME;
            break;
        default:
            break;
    }

    const handleAsyncPhoneSearch = (inputValue, callback) => {
        if (record.branch===null) {
            message.error("Select branch!");
            return;
        }
        if (inputValue.length < 8)
            return;
        axios.get(`${url}/api/auth/action/?branch=${record.branch}&phone=${inputValue}`, config)
            .then(res => {
                if (res.data.data.length != 0)
                    callback(res.data.data)
                else 
                    callback([{ phone: inputValue, id: 0 }])
            })
            .catch(err => console.log(err.response.data))
    }

    const handleSelectSave = e => {
        handleSave([{ cell, row, col, value: e.id }])
        onRevert();
    };

    const handleDateTime = e => {
        handleSave([{ cell, row, col, value: e.target.value }])
        onRevert();
    };

    const handlePhoneSearch = e => {
        console.log(e)
        if (e.id != 0)
            handleSave([{ cell, row, col, value: e, existing: true }])
        else {
            handleSave([{ cell, row, col, value: e.phone }])
        }
        onRevert();
    };
    let childNode = children;
    if (editable) {
        let input;
        switch(inputType) {
            case "select":
                input = record.id === 0 && dataIndex==="user_phone" ? 
                (
                    <AsyncSelect
                        initialValue={ cell.value }
                        autoFocus
                        openOnFocus
                        closeOnSelect
                        onChange={ handlePhoneSearch }
                        onSelect={ () => console.log("dwqdwqwd") }
                        loadOptions={ handleAsyncPhoneSearch }
                        onInputKeyDown={ e => console.log(e) }
                        name="name"
                        theme={ { borderRadius: 0 } }
                        getOptionLabel={ item => item.phone }
                        getOptionValue={ item => item.id }
                        isDisabled={ record.branch===null ? true : false }
                    />
                )
                : 
                (
                    <Select
                        initialValue={ cell.value }
                        autoFocus
                        openOnFocus
                        closeOnSelect
                        isSearchable
                        onChange={ handleSelectSave }
                        name="name"
                        theme={ { borderRadius: 0 } }
                        getOptionLabel={ item => item.name }
                        getOptionValue={ item => item.id }
                        onInputKeyDown={ onKeyDown }
                        isDisabled={ record.branch===null ? true : false }
                        options={ options }
                    />
                )
                break;
            case "date":
                input = ( <input className="date-input" type="date" onChange={ handleDateTime } /> );
                break
            default:
                input = ( <Input onKeyDown={ restProps.onKeyDown } ref={inputRef} bordered={ false } onPressEnter={ handleDateTime } /> );
        }
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                    minHeight: 0
                }}
                name={dataIndex}
                rules={[
                    required ? {
                        required: true,
                        message: `Required`,
                    } : {
                        required: false
                    }
                ]}
            >
                { input }
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    textAlign: "center"
                }}
            >
                { body }
            </div>
        );
    }

    return childNode;
};


export default EditableCell;
