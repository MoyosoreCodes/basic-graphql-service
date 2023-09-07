import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { config } from "dotenv";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

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
  login(email: String!, password: String!): String
}
`);

const root = {
  signUp: ({ username, email, password }) => {
    // Hash the password (you should salt and hash securely in production)
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user
    const user = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
    };
    users.push(user);

    return user;
  },
  login: ({ email, password }) => {
    const user = users.find((u) => u.email === email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error("Invalid email or password");
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    return token;
  },
};

// app.use("/graphql", (req, res, next) => {
//   const token = req.header("Authorization");

//   if (!token) {
//     req.userId = null;
//     return next();
//   }

//   jwt.verify(token, JWT_SECRET, (err, decoded) => {
//     if (err) {
//       req.userId = null;
//     } else {
//       req.userId = decoded.userId;
//     }
//     next();
//   });
// });

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
