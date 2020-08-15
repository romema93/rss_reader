from functools import wraps
from flask import request
from backend.main.service.auth_helper import Auth


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        data, status = Auth.get_logged_in_user(request)
        user = data.get('data')
        request.user = user
        if not user:
            return data, status
        return f(*args, **kwargs)

    return decorated
