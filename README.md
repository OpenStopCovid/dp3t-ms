# dp3t-ms

> An efficient backend architecture for _decentralized contact tracing_.

- High performance
- Microservice-based
- Modular
- Compatible with DP-3T

## Available microservices

- Exposed keys microservice
- Codes microservice

## Prerequisites

- [Node.js](https://nodejs.org) LTS (12 and above)
- [Redis](https://redis.io)
- [Yarn](https://yarnpkg.com) (optional)

## Development

### Installation

```bash
yarn
```

### Run

```bash
# To run the exposed keys microservice
yarn dev:exposed-keys

# To run the codes microservice
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
# To run the exposed keys microservice
yarn start:exposed-keys

# To run the codes microservice
yarn start:codes
```

## License

MIT
