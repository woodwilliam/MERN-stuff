const express = require('express');
// Import the ApolloServer class
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers
});
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

// // if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }


db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
})
};
