import json
import unittest
from backend.test.base import BaseTestCase
from backend.test.test_auth import register_user


def register_feed(self, token):
    return self.client.post(
        '/api/v1/feed/',
        data=json.dumps(dict(
            url='https://www.livinginperu.com/feed/',
        )),
        headers=dict(
            Authorization='Bearer ' + token
        ),
        content_type='application/json'
    )


def get_user_feeds(self, token):
    return self.client.get(
        '/api/v1/feed/',
        headers=dict(
            Authorization='Bearer ' + token
        ),
        content_type='application/json'
    )


class TestFeedBlueprint(BaseTestCase):
    def test_register_no_valid_feed(self):
        """ Test register an invalid feed """
        with self.client:
            # user registration
            res_reg_user = register_user(self)
            data = json.loads(res_reg_user.data.decode())
            self.assertTrue(data['status'] == 'success')
            self.assertTrue(data['data']['token'])
            self.assertTrue(res_reg_user.content_type == 'application/json')
            self.assertEqual(res_reg_user.status_code, 201)
            # Register feed
            res_reg_feed = self.client.post(
                '/api/v1/feed/',
                data=json.dumps(dict(
                    url='https://www.youtube.com',
                )),
                headers=dict(
                    Authorization='Bearer ' + data['data']['token']
                ),
                content_type='application/json'
            )
            data2 = json.loads(res_reg_feed.data.decode())
            self.assertTrue(data2['status'] == 'fail')
            self.assertTrue(data2['message'] == 'No se pudo obtener el feed')

    def test_registration(self):
        """ Test feed registration """
        with self.client:
            # user registration
            res_reg_user = register_user(self)
            data = json.loads(res_reg_user.data.decode())
            self.assertTrue(data['status'] == 'success')
            self.assertTrue(data['data']['token'])
            self.assertTrue(res_reg_user.content_type == 'application/json')
            self.assertEqual(res_reg_user.status_code, 201)
            # feed registration
            res_reg_source = register_feed(self, data['data']['token'])
            data = json.loads(res_reg_source.data.decode())
            self.assertTrue(data['status'] == 'success')
            self.assertTrue(data['data']['feed'])

    def test_get_feeds(self):
        """ Test get user feeds """
        with self.client:
            # user registration
            res_reg_user = register_user(self)
            data1 = json.loads(res_reg_user.data.decode())
            self.assertTrue(data1['status'] == 'success')
            self.assertTrue(data1['data']['token'])
            self.assertTrue(res_reg_user.content_type == 'application/json')
            self.assertEqual(res_reg_user.status_code, 201)
            # feed registration
            res_reg_source = register_feed(self, data1['data']['token'])
            data2 = json.loads(res_reg_source.data.decode())
            self.assertTrue(data2['status'] == 'success')
            self.assertTrue(data2['data']['feed'])
            # get feeds
            res_user_feeds = get_user_feeds(self, data1['data']['token'])
            data3 = json.loads(res_user_feeds.data.decode())
            self.assertTrue(data3['data'])
            self.assertEqual(res_user_feeds.status_code, 200)


if __name__ == '__main__':
    unittest.main()
