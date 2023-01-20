import axios from 'axios';

import { ADD_LIST } from './types';
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