# dp3t-ms

> An efficient backend architecture for _decentralized contact tracing_.

- **High performance**
- **Microservice-based**
- **Modular**
- **Compatible with [DP-3T](https://github.com/DP-3T/documents)**

## Available microservices

- **Exposed keys microservice**
- **Codes microservice**

## API

### Exposed keys microservice

This API is fully compatible with the [DP-3T](https://github.com/DP-3T) mobile SDKs.

---

`POST /exposed`: Enpoint used to publish the SecretKey

Request:

```json
{
  "key": "QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpBQkNERUY=",
  "onset": "2020-04-10"
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

### Codes microservice

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
  "type": "qr"
}
```

=> Response: `200`

```json
{
  "code": "49f38a3f-c0ab-4127-8e16-ccfd1fb7772e",
  "type": "qr",
  "active": true
}
```

---

`POST /use-code`: Endpoint used to use a code (called by the "exposed keys" microservice)

Request:

```json
{
  "code": "49f38a3f-c0ab-4127-8e16-ccfd1fb7772e",
  "type": "qr"
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

## Prerequisites

- [Node.js](https://nodejs.org) LTS (12 and above)
- [Redis](https://redis.io)
- [Yarn](https://yarnpkg.com) (optional)

## Configuration

Both microservices need a Redis database to work. You can provide the `REDIS_URL` environment variable through a `.env` file.

To run the "codes" microservice, you have to provide some code types. To start, you can just create the `config/codes.yaml` by copying the existing `config/codes.yaml.sample` file.

## Development

### Installation

```bash
yarn
```

### Run

```bash
# To run the "exposed keys" microservice (will listen en port 5001)
yarn dev:exposed-keys

# To run the "codes" microservice (will listen en port 5002)
yarn dev:codes
```

## Production

### Installation

At the moment you have to clone the repository.

```bash
yarn --prod
```

### Run

```bash
# To run the "exposed keys" microservice
yarn start:exposed-keys

# To run the "codes" microservice
yarn start:codes
```

## License

MIT
