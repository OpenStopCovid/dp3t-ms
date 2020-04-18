# dp3t-ms

> An efficient backend architecture for _decentralized contact tracing_.

- **High performance**
- **Microservice-based**
- **Modular**
- **Compatible with [DP-3T](https://github.com/DP-3T/documents)**

## Available microservices

- **Exposed keys microservice**
- **Codes microservice**

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
