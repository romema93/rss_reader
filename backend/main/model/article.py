import datetime
from time import mktime
from backend.main import db


class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text)
    body = db.Column(db.Text)
    link = db.Column(db.Text)
    guid = db.Column(db.String(255))
    feed_id = db.Column(db.Integer, db.ForeignKey('feed.id'), nullable=False)
    feed = db.relationship('Feed', backref=db.backref('articles', lazy=True))
    create_date = db.Column(db.DateTime, default=datetime.datetime.now)
    date_published = db.Column(db.DateTime)
    __table_args__ = (
        db.UniqueConstraint('feed_id', 'guid', name='uc_feed_guid'),
    )
    __mapper_args__ = {
        "order_by": db.desc(date_published)
    }

    @classmethod
    def insert_from_feed(cls, feed_id, feed_articles):
        """ insert articles from a registered feed """
        stmt = Article.__table__.insert()
        articles = []
        for article in feed_articles:
            articles.append({
                'title': article['title'],
                'body': article['summary'],
                'link': article['link'],
                'guid': article['id'],
                'feed_id': feed_id,
                'date_published': datetime.datetime.fromtimestamp(mktime(article['published'])) if article[
                    'published'] else '',
            })
        db.engine.execute(stmt, articles)
