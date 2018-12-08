# Blockchain Web API Service - Part 1

Utilizing RESTful framework for Node.js is a great way to add an interface to our private blockchain. 


### Prerequisites

[Node.js](https://nodejs.org/)

### Getting started

1. Clone repository
2. Within a terminal session, navigate to repository directory
3. npm install
4. node index


The project utilizes [Hapi.js](https://hapijs.com/), a RESTful web API framework for Node.js.
Connectivity for the API web service is configured on port 8000 with localhost -> http://localhost:8000

#### Post Block
```
curl -X "POST" "http://localhost:8000/block" \
		 -H 'Content-Type: application/json' \
		 -d $'{
	"body": "Block body data"
}'
```

#### Get Block
```
curl "http://localhost:8000/block/0"
```

