import React from 'react';
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Home from '../src/pages/home/Home';
import Login from '../src/pages/login/Login';
import PrivateRoute from '../src/components/admin/PrivateRoute';


class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch> {/*只匹配其中一个*/}
          <Route path='/login' component={Login}></Route>
          <PrivateRoute path="/" component={Home} />
          {/* // <Route path='/' component={Home}></Route> */}
        </Switch>
      </BrowserRouter>
    )
  }

}

export default App;
