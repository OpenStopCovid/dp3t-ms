# API

## Exposed keys microservice

This API is fully compatible with the [DP-3T](https://github.com/DP-3T) mobile SDKs.

---

`POST /exposed`: Enpoint used to publish the SecretKey

Request:

```json
{
  "key": "QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpBQkNERUY=",
  "onset": "2020-04-10",
  "authData": {
    "type": "qrcode",
    "code": "fb604540-9f1f-4c9b-b51b-6b69bbd4ed62"
  }
}
```

=> Response: `204`

---

`GET /exposed/:dayDate` (example: `/exposed/2020-04-17`): Endpoint used to retrieve all exposed keys of a day

 => Response: `200`

```json
{
  "exposed": [
    {
      "key": "AZERTYUIOPSDFGHJKLSDFGHJSDFGH=",
      "onset": "2020-04-03"
    },
    ...
    {
      "key": "YBFKGG43IBFJSLHF84VFQJFLFHBSVFJJ=",
      "onset": "2020-04-03"
    }
  ]
}
```

---

## Codes microservice

---

`POST /create-code`: Enpoint used to create a new code

Request:

```json
{
  "emitter": "doctor",
  "type": "qrcode",
  "extras": {...}
}
```

=> Response: `200`

```json
{
  "type": "qrcode",
  "code": "49f38a3f-c0ab-4127-8e16-ccfd1fb7772e",
  "expireAt": "2020-04-17T13:21:01.995Z",
  "ttl": 3600
}
```

---

`POST /get-code-status`: Endpoint used to get actual code status

Request:

```json
{
  "code": "49f38a3f-c0ab-4127-8e16-ccfd1fb7772e",
  "type": "qrcode"
}
```

=> Response: `200`

```json
{
  "code": "49f38a3f-c0ab-4127-8e16-ccfd1fb7772e",
  "type": "qrcode",
  "active": true
}
```

---

`POST /use-code`: Endpoint used to use a code (called by the "exposed keys" microservice)

Request:

```json
{
  "code": "49f38a3f-c0ab-4127-8e16-ccfd1fb7772e",
  "type": "qrcode"
}
```

=> Response: `200`

```json
{
  "extras": {...}
}
```

=> Response: `403` if the given code does not exists or has expired

---
