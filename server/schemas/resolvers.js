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
          },
          saveBook: async (parent, { body }, context) => {
            const { user } = context;
            try {
              const updatedUser = await User.findOneAndUpdate(
                    {_id: user._id},
                    { $addToSet: { savedBooks: body } },
                    { new: true, runValidators: true }
                    );

                return updatedUser;
              } catch (err) {
                console.log(err);
                throw new Error('book not saved');
              }
            },
            
          deleteBook: async (parent, { bookId }, context) => {
            const { user } = context;
              const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: { bookId: bookId } } },
                { new: true }              
              );
              if (!updatedUser) {
                throw new Error('user not found');
              }
              return updatedUser;
          }
    },
};
module.exports = resolvers;