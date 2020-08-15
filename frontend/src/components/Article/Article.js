import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        width: "100%",
        marginBottom: "1rem"
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    body: {
        maxWidth: "100%",
        overflow: "scroll",
        position: "relative",
        maxHeight: "15rem"
    }
});

export default function Article(props) {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography variant="h5">
                    {props.item.title}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                    {props.item.date_published}
                </Typography>
                <div className={classes.body} dangerouslySetInnerHTML={{__html: props.item.body}}/>
            </CardContent>
            <CardActions>
                <Button size="small" variant="outlined" color="primary"
                        onClick={() => window.open(props.item.link, "_blank")}>Leer
                    mas</Button>
            </CardActions>
        </Card>
    );
}