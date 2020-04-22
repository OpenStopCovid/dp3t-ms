
# MacOSX - Tutorial

## Setup

### Install Redis
```
brew update
brew install redis
```

### Start Redis
```
brew services start redis
```

### Test Redis
```
redis-cli ping
# Pong
```
### Install Postman
https://www.postman.com/downloads/

### Open Postman
Applications -> Postman

### Start DP-3T Microservices
```
yarn dev:codes
yarn dev:exposed-keys
```

## Run DP-3T

### Learn how postman works
```put raw JSON objects in Body --> Raw```
https://i.stack.imgur.com/ZDhcl.png

### Create a Code
#### Use case : as a result of your illness, the doctor creates a code for you
```
POST localhost:5002/create-code
{
  "emitter": "doctor",
  "type": "qrcode",
  "extras": {}
}
```

What is "extras"?
extras is an additional block that allows the attachment of useful metadata not yet specifically provided in the protocol.
For example, the test identifier, a health professional identifier and a date would be a guarantee, when the code is entered, of improved traceability.

What you get :
```
{
  "type": "qrcode",
  "code": "[YOUR CODE]",
  "expireAt": "2020-04-22T06:28:48.619Z",
  "ttl": 3600
}
```

### Check Code Status
#### Use case : the application wants to know if you are sick
```
POST /get-code-status
{
  "code": "[YOUR CODE]",
  "type": "qrcode"
}
```

What you get :
```
{
  "type": "qrcode",
  "code": "[YOUR CODE]",
  "isActive": true
}
```

### Use your code
#### Use case : you register as a sick person
```
POST /use-code
{
  "code": "[YOUR CODE]",
  "type": "qrcode"
}
```

What you get:
```
{
  "extras": {}
}
```
