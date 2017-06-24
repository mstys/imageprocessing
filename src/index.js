
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom';
import App from './App';
import MovieDash from './MovieDash';
import Stream from './Stream';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

const AppMain = () => (
  <Router>
    <div className="header-main">
      <ul className="menu">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dash">Dash</Link></li>
        <li><Link to="/stream">Capture video</Link></li>
        {/* <li><Link to="/react">React</Link></li>
        <li><Link to="/redux">Redux</Link></li>
        <li><Link to="/protectedRoute">Protected Route</Link></li>
        <li><Link to="/login">Login</Link></li>*/}
      </ul>

      <Route exact path="/" component={App} />

      <Switch>
        <Route path="/dash" component={MovieDash} />
        <Route path="/stream" component={Stream} />
        {/* <Route path="/products" component={Products} />
        <Route path="/protectedRoute" render={props => (<ProtectedRoute protected={true} />)} />
        <Route path="/:name" component={Person} />
        <Route path="/products/:id" component={ProductsDetails} />*/}
      </Switch>
    </div>
  </Router>
)

ReactDOM.render(<AppMain />, document.getElementById('root'));
registerServiceWorker();
