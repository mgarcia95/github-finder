import './App.css';
import React, { useState, Fragment} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './component/layout/Navbar';
import Users from './component/users/Users';
import User from './component/users/User';
import Search from './component/users/Search';
import Alert from './component/layout/Alert';
import About from './component/pages/About';

import GithubState from './context/github/GithubState';

import axios from 'axios';

const App = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  //async componentDidMount(){

  //  this.setState({loading:true});

  //  const res=  await axios.get(`https://api.github.com/users?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}$client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}` );

  //  this.setState({users: res.data, loading:false});
  //}

  // Search Github users
  const searchUsers = async text => {
    setLoading(true);

    const res=  await axios.get(
      `https://api.github.com/search/users?q=${text}&client_id=${
        process.env.REACT_APP_GITHUB_CLIENT_ID}
        $client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}` 
    );

    setUsers(res.data.items);
    setLoading(false);
  };

  // Get single Github user
  const getUser = async username => {
    setLoading(true);

    const res=  await axios.get(
      `https://api.github.com/users/${username}?client_id=${
        process.env.REACT_APP_GITHUB_CLIENT_ID}
        $client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}` 
    );

    setUser(res.data);
    setLoading(false);
  };

  // Get users repos
  const getUserRepos = async username => {
    setLoading(true);

    const res=  await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${
        process.env.REACT_APP_GITHUB_CLIENT_ID}
        $client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}` 
    );

    setRepos(res.data);
    setLoading(false);
  };


  //Clear users from state
  const clearUsers= () => {
    setUsers([]);
    setLoading(false);
  };

  //Set Alert
  const showAlert = (msg, type) => {
    setAlert({msg, type});
    setTimeout(() => setAlert(null), 5000);
  };

    return (
      <GithubState>
      <Router>
      <div className="App">
        <Navbar title='Github Finder' icon='fab fa-github'/>
        <div className="container">
          <Alert alert={alert}/>
          <Switch>
            <Route 
            exact 
            path='/' 
            render={props => (
              <Fragment>
                  <Search 
                    searchUsers={searchUsers} 
                    clearUsers={clearUsers} 
                    showClear={users.length > 0 ? true : false}
                    setAlert={showAlert}
                  />
                  <Users loading={loading} users={users} />
              </Fragment>  
            )}
            />
            <Route exact path='/about' component={About} />
            <Route exact path='/user/:login' render={props => (
              <User 
              { ...props} 
              getUser={getUser} 
              user={user} 
              loading={loading}
              getUserRepos={getUserRepos}
              repos={repos}
              />
            )}
            />
          </Switch>  
        </div>
      </div> 
      </Router>
      </GithubState> 
      
    );
};

export default App;
