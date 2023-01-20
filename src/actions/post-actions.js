import axios from 'axios';
import { ADD_LIST, ADD_COMMENT, UPDATE_DESCRIPTION, UPDATE_MEMBERS } from './types';
import { BASE_URL } from '../helpers/base-url';

export const postList = (boardId, description, order) => dispatch => {
  const list = {
    boardId,
    order,
    description,
    id: null,
  }

  dispatch({
    type: ADD_LIST,
    payload: list,
  })

  axios.post(
    `${BASE_URL}api/org/:orgId/user/:userId/boards/${boardId}/lists`,
    {
      description,
      order
    }
  )
    .then(response => {
      //here we could also handle server errors in posting (ie status === 400)
      dispatch({
        type: ADD_LIST,
        payload: response.data,
      })
      console.log("New list recieved")
    })
    .catch(e =>  {
    console.error('Error in posting list', e);
    throw e;
  })
}

//POST comment
export const postComment = (userId, cardId, commentToPost) => dispatch => {
  console.log('action was called')
  dispatch({
    type: ADD_COMMENT,
    payload: commentToPost,
  })

  axios.post(
    `${BASE_URL}api/org/:orgId/user/${userId}/boards/:boardId/lists/:listId/cards/${cardId}/comments`,
    {
      text: commentToPost,
    }
  )
    .then(response => {
      dispatch({
        type: ADD_COMMENT,
        payload: response.data,
      })
      console.log("New comment recieved")
    })
    .catch(e =>  {
    console.error('Error in posting comment', e);
    throw e;
  })
}

//POST description
export const updateDescription = (cardId, newDescription) => dispatch => {
  console.log('action was called')
  dispatch({
    type: UPDATE_DESCRIPTION,
    payload: newDescription,
  })

  axios.put(
    `${BASE_URL}api/org/:orgId/user/:userId/boards/:boardId/lists/:listId/cards/${cardId}`,
    {
    description: newDescription,
    }
  )
    .then(response => {
      dispatch({
        type: UPDATE_DESCRIPTION,
        payload: response.data.description,
      })
      console.log("New description recieved")
    })
    .catch(e =>  {
    console.error('Error in posting description', e);
    throw e;
  })
}


//POST members
export const updateMembers = (cardId, newMembers) => dispatch => {
  console.log('action was called')
  dispatch({
    type: UPDATE_MEMBERS,
    payload: newMembers,
  })

  axios.put(
    `${BASE_URL}api/org/:orgId/user/:userId/boards/:boardId/lists/:listId/cards/${cardId}`,
    {
      members: newMembers,
    }
  )
    .then(response => {
      dispatch({
        type: UPDATE_MEMBERS,
        payload: response.data.members,
      })
      console.log("New members recieved")
    })
    .catch(e =>  {
    console.error('Error in posting members', e);
    throw e;
  })
}

