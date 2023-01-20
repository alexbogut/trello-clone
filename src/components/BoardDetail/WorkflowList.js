import CardLocation from './CardLocation'
import { useDrag } from 'react-dnd'
import _ from 'lodash';
import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Backspace, Trash3Fill } from 'react-bootstrap-icons';
import { postCard } from '../../helpers/postData'
import { deleteList } from '../../actions/delete-actions';
import { addCard, reOrderLists } from '../../actions';

function WorkflowList({ description, listOrder, id, setIsPostingCardDetails, setListId, boardId, lists }) {
  const dispatch = useDispatch();
  const cards = useSelector((state) => state?.boardDetails?.cards)
  const [newCard, setNewCard] = useState('')
  const [newCardOrder, setNewCardOrder] = useState(0)
  const [isComposingCard, setIsComposingCard] = useState(false)

  async function postNewCard() {
    try {
      // setIsPostingCardDetails(true)

      const numCardsInList = cards.reduce((count, card) => {
        if (card.listId === id) { count++ };
        return count;
      }, 0)
      dispatch(addCard(id, newCard, boardId, numCardsInList))
      //use redux-thunk to first dispatch the created card, 
      //then make POST to api, then dispatch again
    }
    catch (e) {
      console.error(e)
    }
    finally {
      setNewCard('')
      setIsComposingCard(false)
      // setIsPostingCardDetails(false)
    }
  }

  function deleteThisList() {
    try {
      setIsPostingCardDetails(true)

      let newLists = _.remove(lists, (list => {
        //this makes it so that we have a new array of lists without the delted list
        //so that we can call reOrderLists later
        if (list.order > listOrder) {
          list.order -= 1;
        }
        return list.id !== id;
      }))

      dispatch(deleteList(id, listOrder));
      
      if (newLists.length > 0) {
        //when lists are deleted they get re-ordered
        dispatch(reOrderLists(newLists, id))
      }
    }
    catch (e) {
      console.error(e)
    }
    finally {
      // setIsPostingCardDetails(false)
    }
  }



  // const emptyArr = []
  // for (let i = 0; i < cards?.length; i++) {
  //   emptyArr.push(i)
  //   // if(cards[i].listId===id) {
  //   //   setNewCardOrder(newCardOrder+1)
  //   // }
  // }

  // console.log(newCardOrder)


  //make list draggable
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: 'list',
      item: { id, description, listOrder },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1
      })
    }),
    []
  )

  //  console.log('cards', cards)
  return (
    <div ref={dragRef} className="workflow-item">
      <div className='workflow-wrapper'>
        <h5>{description}</h5>
        <Trash3Fill onClick={() => deleteThisList()} className="icn delete-list-icn" />
        <ul className="list-ul" >
          {cards?.map((element, index) => {
            return <CardLocation key={element.id} index={index} listName={description} setIsPostingCardDetails={setIsPostingCardDetails} listId={id} boardId={boardId} />
          })}
        </ul>
      </div>
      <div className="add-card-section" >
        <div className='add-card-btn' style={{ display: isComposingCard ? 'none' : 'block' }} onClick={() => setIsComposingCard(true)}>+ Add a card</div>
        <div className='card-composer' style={{ display: isComposingCard ? 'block' : 'none' }}>
          <input type="text" placeholder='Enter a title for this card' value={newCard} onChange={(e) => setNewCard(e.target.value)}></input>
          <button className='btn btn-primary' onClick={() => postNewCard()}>Add card</button>
          <Backspace className="close-composer" onClick={() => setIsComposingCard(false)} />
        </div>
      </div>
    </div>
  );
}

export default WorkflowList;