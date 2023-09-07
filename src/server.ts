import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { config } from "dotenv";

config();
const app = express();
const PORT = process.env.PORT || 3123;
const JWT_SECRET = process.env.JWT_SECRET || "asjnasniwjndsajdnasknd";
app.use(express.json());

const users = [];

const schema = buildSchema(`
type User {
  id: ID!
  username: String!
  email: String!
}

type Mutation {
  signUp(username: String!, email: String!, password: String!): User
  login(email: String!, password: String!): User
}

type Query {
  getUser(email: String): User
}
`);

const root = {
  signUp: ({ username, email, password }) => {
    const user = {
      id: users.length + 1,
      username,
      email,
      password,
    };
    users.push(user);

    return user;
  },
  login: ({ email, password }) => {
    const user = users.find((u) => u.email === email);

    if (!user || password !== user?.password) {
      throw new Error("Invalid email or password");
    }

    return user;
  },
};


app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
