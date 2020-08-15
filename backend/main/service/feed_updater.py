from backend.main.model.article import Article
from backend.main.model.feed import Feed
from backend.main.service import feed_service
from backend.main.service.log_service import WriteException


def update_feeds():
    query = Feed.query
    for src in query.all():
        try:
            articles = Article.query.filter_by(feed_id=src.id).all()
            article_ids = [x.guid for x in articles]
            parsed = feed_service.parse(src.url)
            feed_articles = feed_service.get_articles(parsed)
            articles_to_insert = [x for x in feed_articles if x['id'] not in article_ids]
            if articles_to_insert:
                Article.insert_from_feed(src.id, articles_to_insert)
        except Exception:
            WriteException()
