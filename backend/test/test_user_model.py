import unittest

import datetime

from backend.main import db
from backend.main.model.user import User
from backend.test.base import BaseTestCase


class TestUserModel(BaseTestCase):

    def test_encode_auth_token(self):
        """ Test encode auth token """
        user = User(
            first_name='juan',
            last_name='tenorio',
            email='juan@gmail.com',
            password='123456'
        )
        db.session.add(user)
        db.session.commit()
        auth_token = User.encode_auth_token(user.id)
        self.assertTrue(isinstance(auth_token, bytes))

    def test_decode_auth_token(self):
        """ Test decode auth token """
        user = User(
            first_name='juan',
            last_name='tenorio',
            email='juan@gmail.com',
            password='123456'
        )
        db.session.add(user)
        db.session.commit()
        auth_token = User.encode_auth_token(user.id)
        self.assertTrue(isinstance(auth_token, bytes))
        self.assertTrue(User.decode_auth_token(auth_token.decode("utf-8")) == 1)


if __name__ == '__main__':
    unittest.main()
