// import React, { useState } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

import { DELETE_BOOK } from '../utils/mutations';
import { QUERY_SINGLEUSER } from '../utils/queries';
import { useMutation, useQuery } from '@apollo/client';


import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
const { loading, data } = useQuery(QUERY_SINGLEUSER)
const userData = data?.getSingleUser || []
console.log(userData);
//deletes book using the mutation DELETE_BOOK
const [removeBook] = useMutation(DELETE_BOOK, {
  updated(cache, { data: removeBook }) {
    try {
      cache.writeQuery({
        query: QUERY_SINGLEUSER,
        data: { getSingleUser: removeBook }
      })
    } catch (e) {
      console.error(e);
    }
  }
})

//delete book function by book id
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }
    try {
      await removeBook({
        variables: { bookId }
      });
      console.log(userData);
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };
    

  // loading screen
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks?.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant= 'top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;