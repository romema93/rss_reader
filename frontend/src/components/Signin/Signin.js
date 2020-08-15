import React, {useEffect, useState} from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Link, Redirect} from "react-router-dom";
import {API_ROUTE} from "../../constants";
import {checkLogin, setLoginToken} from "../../service/login.service";
import Alert from "@material-ui/lab/Alert";

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
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function Signin(props) {
    const initialErrors = {email: "", password: ""}
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticate, setIsAuthenticate] = useState(false);
    const [errors, setErrors] = useState(initialErrors);
    const classes = useStyles();
    useEffect(() => {
        const temp = checkLogin();
        setIsAuthenticate(temp);
    }, []);

    const validateForm = () => {
        let valid = true
        let errors_temp = initialErrors;
        if (email === "") {
            valid = false;
            errors_temp.email = "El correo es obligatorio";
        }
        if (password === "") {
            valid = false;
            errors_temp.password = "El password es requerido";
        }
        setErrors({...errors, ...errors_temp});
        return valid;
    }

    const onSignin = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            return false;
        }
        try {
            const request = await fetch(API_ROUTE + '/auth/login', {
                method: 'post',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({email, password}),

            });
            const res = await request.json();
            if (res.status === 'success') {
                setLoginToken(res.data.token);
                props.history.push('/main');
            } else if (res.message) {
                setErrors({...errors, login: res.message});
            }
        } catch (e) {
            console.log(e);
        }
    }
    return (
        !isAuthenticate ?
            (<Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Iniciar Sesion
                    </Typography>
                    <form className={classes.form}>
                        <TextField
                            error={!!errors.email}
                            autoComplete='off'
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Correo"
                            name="email"
                            autoFocus
                            value={email}
                            helperText={errors.email}
                            onChange={target => setEmail(target.currentTarget.value)}
                        />
                        <TextField
                            error={!!errors.password}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            helperText={errors.password}
                            onChange={target => setPassword(target.currentTarget.value)}
                        />
                        {errors.login && <Alert variant="filled" severity="error">
                            {errors.login}
                        </Alert>}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={onSignin}
                        >
                            Iniciar Sesion
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link to="/signup" variant="body2">
                                    {"No tiene una cuenta? Registrarse"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>) : <Redirect to="/main"/>
    )
}

export default Signin;