# Fitness Club app

Fitness Club app is system which helps in management of gym and fitness object. The main functionality of this app is administering of members classes in club, trainers who maintain class and users assignation tto group

## Technology stack

### Backend part

- NodeJS
- MySql

### Web part

- AngularJS
- CSS

## Functional requirements

- User can sign in, view his profile and update his data.
- User can view classes with its details.
- User can view special classes with its details.
- User can assign him to class.
- Trainer can view his classes.
- Administrator of class can add new class and update class data.

# Develop

1. You should have node and mysql installed.

1. Then you should set mysql user and password in config.js file

1. Then you should configure database with:
```
node scripts/init.js
```

1. Lastly run app with:
```
gulp dev
```
