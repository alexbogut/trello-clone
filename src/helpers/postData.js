import axios from 'axios'
import { BASE_URL } from "./base-url";

axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");



  export const postCard = async (listId, cardToPost, boardId, order) => {
    try{
   await axios
     .post(
       `${BASE_URL}api/org/:orgId/user/:userId/boards/${boardId}/lists/${listId}/cards`,
       {
         title: cardToPost,
         order: order
       }
     )
     .then((response) => {
      //  console.log(response.data);
     });
  }
  catch (e) {
    console.error('Error in posting comment', e);
    throw e;
  }
}

  export const postBoard = async (userId, newBoard, orgId) => {
    try{
       const response = await axios.post(
         `${BASE_URL}api/org/${orgId}/user/${userId}/boards`,
         {
           title: newBoard,
         }
       );
    if (response.status === 200) {
      ['To Do', 'Doing', 'Done'].forEach((list, index) => {
        axios.post(
          `${BASE_URL}api/org/:orgId/user/:userId/boards/${response.data.id}/lists`,
          {
            description: list,
            order: index,
          }
        );
      })
    }
    return response.data
  }
  catch (e) {
    console.error('Error in posting board', e);
    throw e;
  }
}

export const postList = async (boardId, newList, order) => {
  try {
    const response = await axios.post(
      `${BASE_URL}api/org/:orgId/user/:userId/boards/${boardId}/lists`,
      {
        description: newList,
        order
      }
    );
    return response.data
  }
  catch (e) {
    console.error('Error in posting board', e);
    throw e;
  }
}

export const updateBoard = async (boardId, newTitle) => {
  try {
    const response = await axios.put(
      `${BASE_URL}api/org/:orgId/user/:userId/boards/${boardId}`,
      {
        title: newTitle,
      }
    );
    return response.data
  }
  catch (e) {
    console.error('Error in updating card', e);
    throw e;
  }
}

export const updateCard = async (cardId, newCard) => {
  try {
    const response = await axios.put(
      `${BASE_URL}api/org/:orgId/user/:userId/boards/:boardId/lists/:listId/cards/${cardId}`,
      {
        title: newCard,
      }
    );
    return response.data
  }
  catch (e) {
    console.error('Error in updating card', e);
    throw e;
  }
}



