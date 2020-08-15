import React, {useEffect, useState} from "react";
import {
    useParams
} from "react-router-dom";
import {getLoginToken} from "../../service/login.service";
import {API_ROUTE} from "../../constants";
import Article from "../Article/Article";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function FeedView() {
    let {id} = useParams();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        loadArticles();
    }, [id]);
    const loadArticles = async () => {
        const token = getLoginToken();
        try {
            const request = await fetch(API_ROUTE + '/feed/' + id, {
                method: 'get',
                headers: new Headers({
                    'Authorization': 'Bearer ' + token,
                })
            });
            const res = await request.json();
            setArticles(res.data.articles);
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <div>
            {!loading && articles.map((item, index) => <Article item={item}/>)}
            {loading && <CircularProgress/>}
        </div>
    )
}