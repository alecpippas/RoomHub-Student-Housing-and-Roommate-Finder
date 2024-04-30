# Team_I_RoomHub
CS-GY 6063 Project - RoomHub

Note: A .env file needs to be configured for settings.py to pull the correct email credentials to send verification links upon registration.

Commands to run:

1. To install the dependencies, open two separate terminals (one in the "backend" directory and the other in the "frontend" directory):

In the backend terminal run:
```
pip install -r requirements.txt
```
In the frontend terminal run:
```
npm install
```


2. In your terminal, navigate to your project directory. Run the following commands to apply initial database migrations:
```
python manage.py makemigrations
python manage.py migrate
```

3. To get the server/client up and running, run the following command:

In the backend terminal:
```
python3 manage.py runserver
```

In the frontend terminal:
```
npm start
```
4. You should get a pop up in your browser to http://localhost:3000 see the frontend, which will be connected to the backend (both backend and frontend must be running simultaneously).

