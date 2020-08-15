from flask import request
from flask_restx import Resource
from backend.main.model.user import User
from backend.main.util.dto import UserDto

api = UserDto.api
_user = UserDto.user


@api.route('/')
class UserController(Resource):
    """
        User create Resource
    """

    @api.expect(_user, validate=True)
    @api.doc('crear un nuevo usuario')
    def post(self):
        """ Create a new user """
        try:
            data = request.json
            user = User.query.filter_by(email=data['email']).first()
            if not user:
                new_user = User.create(data)
                auth_token = User.encode_auth_token(new_user.id)
                response_object = {
                    'status': 'success',
                    'data': {
                        'token': auth_token.decode()
                    }
                }
                return response_object, 201
            else:
                response_object = {
                    'status': 'fail',
                    'data': {
                        'email': 'el usuario ya existe'
                    },
                }
                return response_object, 409
        except Exception as e:
            response_object = {
                'status': 'error',
                'message': 'Some error occurred. Please try again.'
            }
            return response_object, 401
