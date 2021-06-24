import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, Alert } from "antd";
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import {
	signIn,
	showLoading,
	authenticated
} from 'redux/actions/Auth';
import {
	login,
	hideAuthMessage,
	showAuthMessage
} from 'redux/actions/userActions'
import JwtAuthService from 'services/JwtAuthService'
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion"

export const LoginForm = (props) => {
	let history = useHistory();
	const {
		showForgetPassword,
		onForgetPasswordClick,
		showLoading,
		extra,
		error,
		auth,
		allowRedirect
	} = props
	 
	const {loading, message, showMessage, redirect} = auth;
	 

	const userLogin = useSelector(state => state.userLogin)
	const { token: access_token } = userLogin
	 
	 

	const dispatch = useDispatch()
	const onLogin = values => {
		showLoading()
		// signIn(values)
		dispatch(login(values))
	};
	 
	useEffect(() => {
		 
		 
		 
		 
		if (access_token !== null && allowRedirect) {
			 
			history.push(redirect)
		}
		if(showMessage) {
			setTimeout(() => {
				hideAuthMessage();
			}, 3000);
			 
		}
	}, [history, redirect, error, showMessage, access_token]);

	return (
		<>
			<motion.div
				initial={{ opacity: 0, marginBottom: 0 }}
				animate={{
					opacity: showMessage ? 1 : 0,
					marginBottom: showMessage ? 20 : 0
				}}>
				<Alert type="error" showIcon message={message}></Alert>
			</motion.div>
			<Form
				layout="vertical"
				name="login-form"
				onFinish={onLogin}
			>
				<Form.Item
					name="email"
					label="Email"
					rules={[
						{
							required: true,
							message: 'Please input your email',
						},
						{
							type: 'email',
							message: 'Please enter a validate email!'
						}
					]}>
					<Input prefix={<MailOutlined className="text-primary" />}/>
				</Form.Item>
				<Form.Item
					name="password"
					label={
						<div className={`${showForgetPassword? 'd-flex justify-content-between w-100 align-items-center' : ''}`}>
							<span>Password</span>
							{
								showForgetPassword &&
								<span
									onClick={() => onForgetPasswordClick}
									className="cursor-pointer font-size-sm font-weight-normal text-muted"
								>
									Forget Password?
								</span>
							}
						</div>
					}
					rules={[
						{
							required: true,
							message: 'Please input your password',
						}
					]}
				>
					<Input.Password prefix={<LockOutlined className="text-primary" />}/>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" block loading={loading}>
						Sign In
					</Button>
				</Form.Item>
				{ extra }
			</Form>
		</>
	)
}

LoginForm.propTypes = {
	otherSignIn: PropTypes.bool,
	showForgetPassword: PropTypes.bool,
	extra: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	]),
};

LoginForm.defaultProps = {
	otherSignIn: true,
	showForgetPassword: false
};

// const mapStateToProps = ({auth}) => {
// 	const {loading, message, showMessage, token, redirect} = auth;
//   	return {loading, message, showMessage, token, redirect}
// }

const mapStateToProps = (state) => ({
	auth: state.auth,
	error: state.error
})

const mapDispatchToProps = {
	showAuthMessage,
	showLoading,
	hideAuthMessage,
	authenticated
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
