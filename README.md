<h1 align="center">
            ShopIT
</h1>
ShopIT is an application designed for gathering sellers and buyers into a common marketplace. Use ShopIT to find intriguing goods, or find buyers for your niche merchandise. This repository serves as the client for the application.

## 🚀Getting started


### Requirements

To run the client you need the following installed:

- Vue
- Node

### ⚙️Setup

1. Clone the repository

```
git clone git@github.com:vildemvikan/shopit_frontend.git
```

If you don't have SSH keys use:
```
git clone https://github.com/vildemvikan/shopit_frontend.git
```

2. Navigate to project root folder
```
cd shopit_frontend
```

### 🚗Running the client
1. Download dependencies:
```
npm i
```
2: Run the client (NOTE: make sure Docker is running)
```
npm run dev
```

The application is now running on localhost on port [5173](http://localhost:5173).

NOTE: if you don't have make installed, use the following command instead:

##### Exiting the application

To exit the application, use CTRL + C.

### 🧪 Test data
The application is packaged with three pre-configured users. You can log in with the following credentials:

**User 1**
- Email: ```test@fant.org```
- Password: ```password```

**User 2**
- Username: ```JohnDoe@mail.com```
- Password: ```password```

**User 3**
- Username: ```alicesmith@mail.com```
- Password: ```password```

### 📋 Running tests
To run unit tests:
```
npm run test:unit
```

To run unit tests with coverage:
```
npm run coverage
```

To run end-to-end tests:
> **_NOTE_**: The server must always be running during e2e tests!

```
npm run test:e2e:dev
```
