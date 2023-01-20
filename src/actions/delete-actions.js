import axios from 'axios';
import { BASE_URL } from '../helpers/base-url';
import { DELETE_LIST, DELETE_CARD, DELETE_COMMENT, REMOVE_MEMBER } from './types';

export const deleteList = (listId, listOrder) => dispatch => {
  dispatch({
    type: DELETE_LIST,
    payload: {listId, listOrder}
  })

  axios.delete(
    `${BASE_URL}api/org/:orgId/user/:userId/boards/:boardId/lists/${listId}`
  )
    .then(response => {
      //this is where we could handle a delete error
    })
    .catch(e => {
      console.error('Error in deleting list', e);
      throw e;
    });
};

export const deleteCard = (cardId, cardOrder) => dispatch => {
    dispatch({
      type: DELETE_CARD,
      payload: {cardId, cardOrder}
    })

    axios.delete(
      `${BASE_URL}api/org/:orgId/user/:userId/boards/:boardId/lists/:listId/cards/${cardId}`
    )
    .then(response => {
      // this is where we could handle a delte error
    })
 .catch(e => {
     console.error('Error in deleting card', e);
     throw e;
 })
}

export const deleteComment = (commentId) => dispatch => {
  dispatch({
    type: DELETE_COMMENT,
    payload: commentId
  })

  axios.delete(
    `${BASE_URL}api/org/:orgId/user/:userId/boards/:boardId/lists/:listId/cards/:cardId/comments/${commentId}`
  )
  .then(response => {
  })
.catch(e => {
   console.error('Error in deleting comment', e);
   throw e;
})
}

//REMOVE members
export const removeMember = (cardId, newMembers) => dispatch => {
  console.log('remove member was called for', newMembers)
  dispatch({
    type: REMOVE_MEMBER,
    payload: newMembers,
  })

  axios.put(
    `${BASE_URL}api/org/:orgId/user/:userId/boards/:boardId/lists/:listId/cards/${cardId}`,
    {
      members: newMembers,
    }
  )
    .then(response => {
      console.log('in action', response.data)
      dispatch({
        type: REMOVE_MEMBER,
        payload: response.data.members,
      })
      console.log("REMOVE member recieved")
    })
    .catch(e =>  {
    console.error('Error in removing member', e);
    throw e;
  })
}


