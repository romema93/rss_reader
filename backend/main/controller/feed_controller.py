from flask import request
from flask_restx import Resource
from backend.main.model.article import Article
from backend.main.model.feed import Feed
from backend.main.model.feed_subscription import FeedSubscription
from backend.main.model.user import User
from backend.main.service.log_service import WriteException
from backend.main.util.decorator import token_required
from backend.main.util.dto import FeedDto
from backend.main.service import feed_service

api = FeedDto.api
_feed = FeedDto.feed
_feed_response = FeedDto.feed_response


@api.route('/')
class FeedRootController(Resource):
    """
        Feed Resource
    """

    @api.doc('Obtener los feeds de un usuario')
    @token_required
    @api.marshal_list_with(_feed_response, envelope='data')
    def get(self):
        """ Get a user's feeds """
        try:
            user = User.query.filter_by(id=request.user['user_id']).first()
            return [x.feed for x in user.feeds]
        except Exception as e:
            WriteException()
            response_object = {
                'status': 'error',
                'message': 'Algio salio mal, intentalo mas tarde'
            }
            return response_object, 401

    @api.expect(_feed, validate=True)
    @api.doc('Agregar un nuevo feed')
    @token_required
    def post(self):
        """ Subscribe to a new feed, if the feed does not exist we will create it """
        try:
            url = request.json.get("url")
            feed_temp = Feed.query.filter_by(url=url).first()
            user_id = request.user['user_id']
            if not feed_temp:
                # The new feed is registered in the database
                parsed = feed_service.parse(url)
                if not parsed:
                    response_object = {
                        'status': 'fail',
                        'message': 'No se pudo obtener el feed'
                    }
                    return response_object
                feed = feed_service.get_feed(parsed)
                feed['url'] = url
                new_feed = Feed.create(feed)
                # Add to the subscriber
                subscriber = FeedSubscription(
                    user_id=user_id
                )
                new_feed = Feed.add_subscriber(new_feed, subscriber)
                feed_articles = feed_service.get_articles(parsed)
                Article.insert_from_feed(new_feed.id, feed_articles)
                response_object = {
                    'status': 'success',
                    'data': {
                        'feed': {
                            'id': new_feed.id,
                            'title': new_feed.title,
                            'subtitle': new_feed.subtitle
                        }
                    }
                }
                return response_object, 201
            else:
                # checked if the user is already subscribed to the feed
                subscriptor = FeedSubscription.query.filter_by(user_id=user_id, feed_id=feed_temp.id).first()
                if subscriptor:
                    return_object = {
                        "status": "fail",
                        "message": "Ya estas suscrito al feed"
                    }
                    return return_object, 409
                else:
                    new_subscriber = FeedSubscription(
                        user_id=user_id
                    )
                    Feed.add_subscriber(feed_temp, new_subscriber)
                    response_object = {
                        'status': 'success',
                        'data': {
                            'feed': {
                                'id': feed_temp.id,
                                'title': feed_temp.title,
                                'subtitle': feed_temp.subtitle
                            }
                        }
                    }
                    return response_object, 201
        except Exception:
            WriteException()
            response_object = {
                'status': 'error',
                'message': 'Algo salio mal, intentalo mas tarde'
            }
            return response_object, 401


@api.route('/<id>')
class FeedDetailController(Resource):
    """
        Feed Detail Resource
    """

    @api.doc('Obtener los articulos de un feed')
    @token_required
    def get(self, id):
        """ Get articles from a feed """
        try:
            feed_subscriber = FeedSubscription.query.filter_by(user_id=request.user['user_id'], feed_id=id).first()
            if feed_subscriber:
                feed = Feed.query.filter_by(id=id).first()
                articles = feed.articles
                response_object = {
                    'status': 'success',
                    'data': {
                        'articles': [{'id': x.id, 'title': x.title, 'body': x.body, 'link': x.link,
                                      'date_published': x.date_published.strftime('%Y/%m/%d %H:%M:%S')} for x in
                                     articles]
                    }
                }
                return response_object
            else:
                response_object = {
                    'status': 'fail',
                    'message': 'No esta suscrito al feed'
                }
                return response_object, 401
        except Exception:
            WriteException()
            response_object = {
                'status': 'error',
                'message': 'Algo salio mal, intentalo mas tarde'
            }
            return response_object, 401
