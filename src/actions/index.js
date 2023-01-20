import {
  STORE_BOARD_DETAILS,
  STORE_HOMESCREEN,
  STORE_CARD_DETAILS,
  REORDER_CARDS,
  AUTH_ERROR,
  AUTH_USER,
  GET_USER,
  REMOVE_USER,
  REORDER_LISTS,
  UPDATE_TITLE,
  ADD_CARD
} from './types';
import axios from 'axios';
import { BASE_URL } from "../helpers/base-url";

export const localLogin = (event, callback) => dispatch => {
  event.preventDefault();
  const email = event.currentTarget[0].value
  const password = event.currentTarget[1].value

  axios
    .post(`${BASE_URL}auth/login`, {
      email,
      password,
    })
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      dispatch({
        type: AUTH_USER,
        payload: response.data,
      });
      callback();
    })
    .catch((error) => {
      dispatch({
        type: AUTH_ERROR,
        payload: error.response.status,
      });
    });
}

export const logout = () => dispatch => {
  localStorage.removeItem('token');
  dispatch({ type: REMOVE_USER })
}

export const fetchUser = (errorCb) => dispatch => {
  const config = {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    }
  };
  axios
    .get(`${BASE_URL}auth/current_user`, config)
    .then((response) => {
      dispatch({ type: GET_USER, payload: response.data });
    })
    .catch((err) => {
      console.log(err);
      errorCb();
    });
}

export const storeBoardDetails = (boardDetails) => {
  return {
    type: STORE_BOARD_DETAILS,
    payload: boardDetails,
  }
}

export const storeHomescreen = (homescreen) => {
  return {
    type: STORE_HOMESCREEN,
    payload: homescreen,
  }
}

export const storeCardDetails = (cardDetails) => {
  return {
    type: STORE_CARD_DETAILS,
    payload: cardDetails,
  }
}

export const reOrderCards = (newCards, boardId) => dispatch => {
  dispatch({
    type: REORDER_CARDS,
    payload: newCards,
  });

  axios.put(
    `${BASE_URL}api/org/:orgId/user/:userId/boards/${boardId}?reordercards=1`,
    {
      newCards
    }
  )
    .then(response => {
      dispatch({
        type: REORDER_CARDS,
        payload: response.data,
      })
    })
    .catch(err => {
      console.error('Error in updating card', err);
      throw err;
    })
}

export const reOrderLists = (newLists, boardId) => dispatch => {
  dispatch({
    type: REORDER_LISTS,
    payload: newLists,
  });

  axios.put(
    `${BASE_URL}api/org/:orgId/user/:userId/boards/${boardId}?reorderlists=1`,
    {
      newLists
    }
  )
    .then(response => {
      dispatch({
        type: REORDER_LISTS,
        payload: response.data,
      })
    })
    .catch(err => console.log(err))
}

export const updateBoardTitle = (newTitle) => {
  return {
    type: UPDATE_TITLE,
    payload: newTitle,
  }
}

export const addCard = (listId, cardToPost, boardId, order) => dispatch => {
  dispatch({
    type: ADD_CARD,
    payload: {
      boardId,
      description: null,
      label: null,
      listId,
      members: [],
      order,
      title: cardToPost
    }
  })

  axios
    .post(
      `${BASE_URL}api/org/:orgId/user/:userId/boards/${boardId}/lists/${listId}/cards`,
      {
        title: cardToPost,
        order,
      }
    )
    .then((response) => dispatch({ type: ADD_CARD, payload: response.data }));
}
