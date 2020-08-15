import os
import time
import unittest
from threading import Thread
from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager
from backend import blueprint
from backend.main import create_app, db
from backend.main.service.feed_updater import update_feeds

app = create_app(os.getenv('BOILERPLATE_ENV') or 'dev')
app.register_blueprint(blueprint, url_prefix='/api/v1')

app.app_context().push()


def update_loop():
    while True:
        with app.app_context():
            update_feeds()
        time.sleep(60 * 10)


manager = Manager(app)

migrate = Migrate(app, db)

manager.add_command('db', MigrateCommand)  # Add flask_migrate commands to Manager


@manager.command
def run():
    """Ejecuta el servidor Flask."""
    thread = Thread(target=update_loop)
    thread.start()
    app.run()


@manager.command
def test():
    """Ejecuta las pruebas unitarias."""
    tests = unittest.TestLoader().discover('backend/test', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    return 1


if __name__ == '__main__':
    manager.run()
