from backend.main import db
import datetime


class Feed(db.Model):
    """ Modelo Feed para almacenar las fuentes rss """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.Text, nullable=False)
    subtitle = db.Column(db.Text, nullable=False)
    link = db.Column(db.Text, nullable=False)
    url = db.Column(db.String(255), nullable=False, unique=True)
    create_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now)

    @classmethod
    def create(cls, feed_source):
        """ Create a new feed """
        link = feed_source['link']
        url = feed_source['url']
        title = feed_source['title']
        subtitle = feed_source['subtitle']
        feed = Feed(link=link, title=title, subtitle=subtitle, url=url)
        db.session.add(feed)
        db.session.commit()
        return feed

    @classmethod
    def add_subscriber(cls, feed, subscription):
        """ Add a new subscriber """
        feed.subscribers.append(subscription)
        db.session.add(feed)
        db.session.commit()
        return feed
