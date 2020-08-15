from flask_restx import Api
from flask import Blueprint
from .main.controller.user_controller import api as user_ns
from .main.controller.auth_controller import api as auth_ns
from .main.controller.feed_controller import api as source_ns

blueprint = Blueprint('api', __name__)

api = Api(blueprint, title='API RSS READER APP', version='1.0')

api.add_namespace(user_ns)
api.add_namespace(auth_ns)
api.add_namespace(source_ns)
