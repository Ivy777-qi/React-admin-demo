import React from 'react';
import { Switch } from 'react-router-dom';
import AutoComponents from './autoComponents';
import PrivateRoute from './PrivateRoute';

class ContentMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Switch>
        {
          AutoComponents.map(item => {
            return <PrivateRoute exact key={item.path} path={item.path} component={item.component} />
          })
        }
      </Switch>
    )


  }
}

export default ContentMenu;