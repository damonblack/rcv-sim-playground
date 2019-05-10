import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import {Route, Link} from 'react-router-dom';

import NewHome from './components/NewHome';
import Vote from './components/vote/Vote';
import Monitor from './components/Monitor';
import CreatePoll from './components/CreatePoll';
import BallotPreview from './components/BallotPreview';
import BallotPrint from './components/BallotPrint';
import Faq from './components/Faq';
import Footer from './components/Footer';

import './index.css';

import {auth, googleAuth, myElectionsRef} from './services';

const styles = () => ({});

class ButtonAppBar extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      elections: [],
      user: null,
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({user});
        this.watchMyElections(user.uid);
      } else {
        this.setState({user: null, elections: []});
      }
    });
  }

  watchMyElections = (uid) => {
    myElectionsRef(uid).on('value', (snapshot) => {
      const electionsVal = snapshot.val();
      let elections = [];
      if (electionsVal && this.state.user) {
        elections = Object.keys(electionsVal).map((key) => {
          return {id: key, title: electionsVal[key].title};
        });
      }
      this.setState({elections});
    });
  };

  handleDrawer = () => {
    this.setState(({open}) => ({open: !open}));
  };

  login = async () => {
    try {
      const result = await auth.signInWithPopup(googleAuth);
      this.setState({user: result.user});
      this.watchMyElections(result.user.uid);
    } catch (e) {
      // eslint-disable-next-line no-alert
      window.alert('login failed');
    }
  };

  logout = async () => {
    try {
      await auth.signOut();
      this.setState({user: null, elections: []});
    } catch (e) {
      // eslint-disable-next-line no-alert
      window.alert('logout failed');
    }
  };

  render() {
    const {user, elections} = this.state;

    return (
      <div>
        <CssBaseline />
        <AppBar position="static" className="appBar">
          <Toolbar>
            <IconButton
              className="menuButton"
              color="inherit"
              aria-label="Menu"
            >
              <MenuIcon onClick={this.handleDrawer} />
            </IconButton>

            <Typography variant="h2" className="headerTitle">
              <Link to="/" style={{textDecoration: 'none', color: '#fff'}}>
                <span className="boldLogo">RCV</span>Tally
              </Link>
            </Typography>
            {user ? (
              <Button color="inherit" onClick={() => this.logout()}>
                Sign Out
              </Button>
            ) : (
              <Button color="inherit" onClick={() => this.login()}>
                Sign In
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <Route
          exact
          path="/"
          render={() => (
            <NewHome user={user} login={this.login} elections={elections} />
          )}
        />
        <Route exact path="/create" render={() => <CreatePoll user={user} />} />
        <Route path="/vote/:key" component={Vote} />
        <Route path="/preview/:key" component={BallotPreview} />
        <Route path="/print/:key" component={BallotPrint} />
        <Route path="/monitor/:key/round/:round" component={Monitor} />
        <Route path="/faq" component={Faq} />

        <Drawer
          className="drawer"
          open={this.state.open}
          onClose={this.handleDrawer}
          classes={{
            paper: 'drawerPaper',
          }}
        >
          <List>
            <ListItem component="a" href="/" key="faq">
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem component="a" href="/faq" key="faq">
              <ListItemText primary="FAQ" />
            </ListItem>
            <ListItem
              component="a"
              target="_blank"
              href="https://goo.gl/forms/KHiHVaNh302TUZIG2"
              key="faq"
            >
              <ListItemText primary="Provide Feedback" />
            </ListItem>
          </List>
        </Drawer>
        <Footer />
      </div>
    );
  }
}

export default withStyles(styles)(ButtonAppBar);
