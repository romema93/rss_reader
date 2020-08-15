import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AddIcon from '@material-ui/icons/Add';
import {checkLogin, getLoginToken} from "../../service/login.service";
import {Redirect, useRouteMatch, Switch, Route} from "react-router-dom";
import {API_ROUTE} from "../../constants";
import FeedForm from "../FeedForm/FeedForm";
import FeedView from "../FeedView/FeedView";
import RssFeedIcon from '@material-ui/icons/RssFeed';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    title: {
        flexGrow: 1
    }
}));

function ResponsiveDrawer(props) {
    const {window} = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isAuthenticate, setIsAuthenticate] = React.useState(true);
    const [feeds, setFeeds] = React.useState([]);
    let {path, url} = useRouteMatch();

    const loadFeeds = async () => {
        const token = getLoginToken();
        try {
            const request = await fetch(API_ROUTE + '/feed/', {
                method: 'get',
                headers: new Headers({
                    'Authorization': 'Bearer ' + token,
                })
            });
            if (request.ok) {
                const res = await request.json();
                setFeeds(res.data);
            }
        } catch (e) {
            console.log(e);
        }

    }

    useEffect(() => {
        setIsAuthenticate(checkLogin());
        loadFeeds();
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const onLogout = () => {
        localStorage.clear();
        props.history.push('/');
    }

    const drawer = (
        <div>
            <div className={classes.toolbar}/>
            <Divider/>
            <ListItem button onClick={() => props.history.push(`${path}/feed`)}>
                <ListItemIcon><AddIcon/></ListItemIcon>
                <ListItemText primary="Añadir Feed"/>
            </ListItem>
            <Divider/>
            <Typography align="center" color="primary" variant="h5" style={{marginTop: "1rem"}}>
                Feeds
            </Typography>
            <List>
                {feeds.map((item, index) => (
                    <ListItem button key={index} onClick={() => props.history.push(`${path}/feed/${item.id}`)}>
                        <ListItemIcon><RssFeedIcon/></ListItemIcon>
                        <ListItemText primary={item.title}/>
                    </ListItem>
                ))}
                {feeds.length === 0 &&
                <Typography variant="h6" color="textSecondary" align="center">No estas suscrito a ningun
                    feed</Typography>}
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        isAuthenticate ?
            (<div className={classes.root}>
                <CssBaseline/>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            RSS Reader
                        </Typography>
                        <Button color="inherit" endIcon={<ExitToAppIcon/>} onClick={onLogout}>Salir</Button>
                    </Toolbar>
                </AppBar>
                <nav className={classes.drawer} aria-label="mailbox folders">
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Hidden smUp implementation="css">
                        <Drawer
                            container={container}
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                </nav>
                <main className={classes.content}>
                    <div className={classes.toolbar}/>
                    <Route exact path={path}>
                        <div>
                            <Typography variant="h4" align="center" color="textSecondary">
                                Selecciona o agrega un nuevo feed
                            </Typography>
                        </div>
                    </Route>
                    <Route exact path={`${path}/feed`}>
                        <FeedForm onAddFeed={feed => setFeeds([...feeds, feed])}/>
                    </Route>
                    <Route exact path={`${path}/feed/:id`}>
                        <FeedView/>
                    </Route>
                </main>
            </div>) : <Redirect to="/"/>
    );
}

ResponsiveDrawer.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default ResponsiveDrawer;