# About

BE for H2 CH7

## Installation


```bash
npm install
```

## Usage

To initialize database run

```bash
node initDb.js
```
In output you should see

```bash
INITIALIZING DATABASE
recreating table Account
adding data...
recreating table ContactType
adding data...
recreating table Contact
adding data...
recreating table Event
adding data...
recreating table Ability
adding data...
recreating table AbilityAccount
adding data...
recreating table AbilityEvent
adding data...
recreating table Registration
adding data...
recreating table AbilityRegistration
adding data...
DONE
```

To start BE run
```bash
node server.js
```

To see how each request should look like you can check `test.http`
