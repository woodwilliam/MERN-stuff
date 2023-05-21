const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express')
const { signToken } = require('../utils/auth');


const resolvers = {
  Query: {
    getSingleUser: async (parent, args, context) => {
        if (context.user) {
            const userInfo = await User.findOne({
                _id: context.user._id
            }) .select(-'__v -password')

            return userInfo;
        } throw new AuthenticationError('not logged in');
    },
},

    Mutation: {
        createUser: async (parent, { username, email, password }) => {
            const nUser = await User.create({ username, email, password });
            const token = signToken(nUser);
            return { token, nUser };
          },
          login: async (parent, { email, password }, context) => {
            const cUser = await User.findOne({ email });     
            if (!cUser) {
              throw new AuthenticationError('No meng by that name');
            }
      
            const passwordPass = await cUser.isCorrectPassword(password);
      
            if (!passwordPass) {
              throw new AuthenticationError('Wrong Password!');
            }
      
            const token = signToken(cUser);
      
            return { token, cUser };
          }
    },
};
module.exports = resolvers;