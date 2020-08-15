from backend.main import db


class FeedSubscription(db.Model):
    """ FeedSubscription Model for storing user subscription to feed """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    create_date = db.Column(db.DateTime)
    feed_id = db.Column(db.Integer, db.ForeignKey('feed.id'), nullable=False)
    feed = db.relationship('Feed', backref=db.backref('subscribers', lazy=True))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('feeds', lazy=True))
