## Bitcoin Message Validation Web Service

Simple web application running on port 5000 to validate Bitcoin signed message.

### Install Docker for Mac
So far we've just created some configuration, we haven't actually deployed anything. Our infrastructure only allows us to deploy applications that are packaged using Docker. So let's get set up with Docker.

Navigate to [https://docs.docker.com/docker-for-mac/] and install Docker for Mac.

### Build & run

```
docker build --tag udacity/bitcoin-message-validation .
```

```
docker run --name bitcoin-message-validation -i -t -p 5000:5000 --rm udacity/bitcoin-message-validation
```

From a browser, try to access localhost:5000
