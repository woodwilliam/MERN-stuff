import { gql } from '@apollo/client';

export const QUERY_SINGLEUSER = gql`
{
getSingleUser {
      _id
      username
      savedBooks {
          authors
          description
          bookId
          image
          link
          title
          }
      }
}`;