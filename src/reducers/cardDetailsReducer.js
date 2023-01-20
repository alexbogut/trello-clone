import { STORE_CARD_DETAILS, ADD_COMMENT, UPDATE_DESCRIPTION, UPDATE_MEMBERS, DELETE_COMMENT, REMOVE_MEMBER } from '../actions/types';
import _ from 'lodash';

const DEFAULT_STATE = {}

const cardDetailsReducer = function (state = DEFAULT_STATE, action) {
    switch(action.type){
        case STORE_CARD_DETAILS:
            return action.payload;
        case ADD_COMMENT:
            return {...state, comments: [...state.comments, action.payload]};
        case UPDATE_DESCRIPTION:
            return {...state, description: action.payload}
        case UPDATE_MEMBERS:
            return {...state, members: action.payload}
        case REMOVE_MEMBER:
            return {...state, members: action.payload}
        case DELETE_COMMENT:
                const newComments = _.remove(state.comments, (comment => {
                    return comment.id !== action.payload
                }))
                return { ...state, comments: newComments}
            default:
                return state;
    }
}

export default cardDetailsReducer;