import React, {useState} from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FilledInput from "@material-ui/core/FilledInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import RssFeedIcon from '@material-ui/icons/RssFeed';
import Button from "@material-ui/core/Button";
import {API_ROUTE} from "../../constants";
import {getLoginToken} from "../../service/login.service";
import Alert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function FeedForm(props) {
    const [url, setUrl] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successAdd, setSuccessAdd] = useState(false);

    const onAddFeed = async () => {
        setLoading(true);
        const token = getLoginToken();
        try {
            const request = await fetch(API_ROUTE + '/feed/', {
                method: 'post',
                headers: new Headers({
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({"url": url})
            });
            const res = await request.json();
            if (res.status === 'success') {
                props.onAddFeed(res.data.feed);
                setLoading(false);
                setSuccessAdd(true);
            } else {
                setLoading(false);
                setError(res.message);
            }
        } catch (e) {
            setError(e.message);
        }
    }
    return (
        <div style={{textAlign: "center"}}>
            {!loading && (<>
                <FormControl fullWidth variant="filled">
                    <InputLabel htmlFor="filled-adornment-amount">Ingresar Url</InputLabel>
                    <FilledInput
                        id="filled-adornment-amount"
                        value={url}
                        onChange={target => setUrl(target.currentTarget.value)}
                        startAdornment={<InputAdornment position="start"><RssFeedIcon/></InputAdornment>}
                    />
                </FormControl>
                <Button variant="contained" color="primary" onClick={onAddFeed} style={{marginTop: "1rem"}}>
                    Agregar Feed
                </Button>
                {error && <Alert variant="filled" severity="error">
                    {error}
                </Alert>}
                {successAdd && <Alert severity="success">Feed agregado correctamente!</Alert>}
            </>)}
            {loading && <CircularProgress/>}
        </div>
    )
}