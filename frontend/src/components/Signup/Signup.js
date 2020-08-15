import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Link, Redirect} from "react-router-dom";
import {API_ROUTE} from "../../constants";
import {checkLogin, setLoginToken} from "../../service/login.service";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignUp() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticate, setIsAuthenticate] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        setIsAuthenticate(checkLogin());
    }, []);

    const onSignup = async (event) => {
        event.preventDefault();
        try {
            const request = await fetch(`${API_ROUTE}/user/`, {
                method: 'post',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    password,
                })
            });
            if (request.ok) {
                const data = await request.json();
                setLoginToken(data.data.token);
                setIsAuthenticate(true);
            } else {
                console.log(request);
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        !isAuthenticate ? (
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Registro
                    </Typography>
                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="fname"
                                    name="firstName"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="Nombres"
                                    autoFocus
                                    value={firstName}
                                    onChange={target => setFirstName(target.currentTarget.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Apellidos"
                                    name="lastName"
                                    autoComplete="lname"
                                    value={lastName}
                                    onChange={target => setLastName(target.currentTarget.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Correo Electronico"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={target => setEmail(target.currentTarget.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Contraseña"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={target => setPassword(target.currentTarget.value)}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={onSignup}
                        >
                            Registrarme
                        </Button>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link to="/">
                                    Ya tiene una cuenta? Inicia sesion
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>) : <Redirect to="main"/>
    );
}