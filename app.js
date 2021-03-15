const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const schema = require('./schema/schema');

const app = express();


const port = 4000;

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
}));

app.listen(port, ()=> {
    console.log("Listening for requests on my awesome port 4000");

})