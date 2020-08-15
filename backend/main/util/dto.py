from flask_restx import Namespace, fields


class UserDto:
    api = Namespace('user', description='user related operations')
    user = api.model('user', {
        'first_name': fields.String(required=True, description='nombres'),
        'last_name': fields.String(required=True, description='apellidos'),
        'email': fields.String(required=True, description='correo electronico'),
        'password': fields.String(required=True, description='password'),
    })


class AuthDto:
    api = Namespace('auth', description='authentication related operations')
    user_auth = api.model('auth_details', {
        'email': fields.String(required=True, description='The email address'),
        'password': fields.String(required=True, description='The user password '),
    })


class FeedDto:
    api = Namespace('feed', description='Operaciones relacionadas a las fuentes rss')
    feed = api.model('feed', {
        'url': fields.String(required=True, description="Url del recurso")
    })
    feed_response = api.model('feed', {
        'id': fields.Integer(),
        'title': fields.String(),
        'subtitle': fields.String(),
        'link': fields.String(),
        'url': fields.String()
    })
