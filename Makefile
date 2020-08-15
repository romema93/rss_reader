.ONESHELL:

install-server:
	virtualenv venv; \
	. venv/bin/activate; \
	pip install -r requirements.txt;

install-client:
	cd frontend; \
	yarn install;

tests:
	. venv/bin/activate; \
	python manage.py test

server:
	. venv/bin/activate; \
	python manage.py run

client:
	cd frontend; \
	yarn start