import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import { BrowserRouter as Router } from 'react-router-dom';
import Views from './views';
import { Route, Switch } from 'react-router-dom';
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { Spin } from 'antd';
import Flex from 'components/shared-components/Flex';
import { THEME_CONFIG } from './configs/AppConfig';
import { useDispatch, useSelector } from "react-redux";
import {
  getUser
} from 'redux/actions/userActions'
import Icon from "components/util-components/Icon";

const themes = {
  dark: `${process.env.PUBLIC_URL}/css/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/css/light-theme.css`,
};

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userLogin);
  const token = useSelector((state) => state.userLogin.token);

  useEffect(() => {
    if (token != null) {
      dispatch(getUser());
    }
  }, []);

  if (!user.isLoading && (user.user != null || token == null)) {
    return (
      <div className="App">
        <ThemeSwitcherProvider themeMap={themes} defaultTheme={THEME_CONFIG.currentTheme} insertionPoint="styles-insertion-point">
          <Router>
            <Switch>
              <Route path="/" component={Views}/>
            </Switch>
          </Router>
        </ThemeSwitcherProvider>
      </div>
    );
  } else {
    return (
      <div style={{height: "100vh",  paddingTop: "50vh"}}>
        <Flex justifyContent="center" alignItems="center">
          <Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />
        </Flex>
      </div>
    )
  }
}

export default App;
