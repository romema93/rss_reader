from flask import request
from flask_restx import Resource
from backend.main.service.auth_helper import Auth
from backend.main.service.log_service import WriteException
from backend.main.util.dto import AuthDto

api = AuthDto.api
user_auth = AuthDto.user_auth


@api.route('/login')
class UserLogin(Resource):
    """
        User Login Resource
    """

    @api.doc('user login')
    @api.expect(user_auth, validate=True)
    def post(self):
        # get the post data
        try:
            post_data = request.json
            return Auth.login_user(data=post_data)
        except Exception:
            WriteException()
            response_object = {
                'status': 'error',
                'message': 'Algo salio mal, intentalo mas tarde'
            }
            return response_object, 401
