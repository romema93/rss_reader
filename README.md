## RSS READER

- Framework frontend: `React`

- Framework backend: `Flask`

Nota: tener instalado `yarn`,`pip` y `virtualenv`
### Ejecución con `make`
Instalar el servidor

    > make install-server
    
Instalar el cliente

    > make install-client
    
Migrar la base de datos SQLite
    
    > source venv/bin/activate
    
    > python manage.py db init

    > python manage.py db migrate

    > python manage.py db upgrade
    
Ejecutar el servidor
    
    > make server
    
Ejecutar el cliente
    
    > make client

Ejecutar las pruebas unitarias

    > make tests
    
### Ejecución manual
Crear el entorno virtual

    > virtualenv venv

    > source venv/bin/activate
    
Instalar las librerias python

    > pip install -r requirements.txt
    
Ejecutar la migracion de la base de datos Sqlite

    > python manage.py db init

    > python manage.py db migrate
    
    > python manage.py db upgrade
    
Instalar las dependencias del cliente
    
    > cd frontend
    
    > yarn install
    
Ejecutar el servidor

    > python manage.py run

Ejecutar el cliente

    > cd frontend
    
    > yarn start
    
Ejecutar las pruebas unitarias del servidor

    > python manage.py test
