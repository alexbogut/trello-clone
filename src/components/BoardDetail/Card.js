import { useDrag } from 'react-dnd'
import _ from 'lodash';
import { Pencil, Backspace, Chat, Trash3Fill } from 'react-bootstrap-icons'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CardDetail from './CardDetail/CardDetail'
import { deleteCard } from '../../actions/delete-actions'
import { updateCard } from '../../helpers/postData'
import { ThreeDots } from 'react-loader-spinner'
import { reOrderCards } from '../../actions'


const Card = ({ order, title, cardId, listId, description, listName, setIsPostingCardDetails, boardId }) => {
  const dispatch = useDispatch();
  const [cardTitle, setCardTitle] = useState(title)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [existsTitleToChange, setExistsTitleToChange] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [thisCardId, setThisCardId] = useState('')
  const { cards } = useSelector(state => state.boardDetails)

  //make card draggable
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: 'card',
      item: { title, cardId, listId, description, order },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1
      })
    }),
    []
  )

  // DELETE card
  const handleCardDelete = (cards) => {
    try {
      const newCards = _.remove(cards, (card => {
        //removes the deleted card from the list
        if (card.order > order && card.listId === listId) {
          //decrements all card orders after deleted card in that list
          card.order -= 1;
        }
        return card.id !== cardId
      }));

      setIsPostingCardDetails(true)
      setIsDeleting(true)

      dispatch(deleteCard(cardId, order));

      if (newCards.length > 1) {
        //cards get re-ordered if deleted
        dispatch(reOrderCards(newCards, boardId))
      }
    }
    catch (e) {
      console.error(e)
    }
    finally {
      setIsPostingCardDetails(false)
      setIsDeleting(false)
    }
  }

  //UPDATE card title
  useEffect(() => {
    async function postData() {
      try {
        setIsPostingCardDetails(true)
        setIsUpdating(true)
        await updateCard(cardId, cardTitle)
      }
      catch (e) {
        console.error(e)
      }
      finally {
        setIsEditingTitle(false)
        setIsUpdating(false)
        setIsPostingCardDetails(false)
        setExistsTitleToChange(false)
      }
    }
    if (cardTitle.length < 1) return
    if (!existsTitleToChange) return
    postData()
  }, [existsTitleToChange])


  return (
    <div className="card-item" ref={dragRef} style={{ opacity }}>
      <div style={{ display: isEditingTitle ? 'none' : 'block', }}>
        <div className='open-card-detail-target' onClick={() => setIsOpen(true)}>
          <div  >
            {cardTitle}
          </div>
          {isDeleting || isUpdating ? null : <div>
            <Pencil onClick={(e) => {
              e.stopPropagation();
              setIsEditingTitle(true)
            }} className="icn edit-card-icn card-icn" />
            <Trash3Fill onClick={(e) => {
              e.stopPropagation();
              handleCardDelete(cards)
            }} className="icn delete-card-icn card-icn" />
          </div>}
          {isDeleting || isUpdating ? <div className='loader'><ThreeDots color="black" /></div> : null}
          <div className='comments-length'><Chat /><span></span></div>
        </div>
      </div>
      <CardDetail listId={listId} isOpen={isOpen} setIsOpen={setIsOpen} cardId={cardId} listName={listName} boardId={boardId} />
      <div className='card-title-editor' style={{ display: isEditingTitle ? 'flex' : 'none', }}>
        <input type="text" value={cardTitle} onChange={(e) => setCardTitle(e.target.value)}></input>
        <button className='btn btn-primary' onClick={() => setExistsTitleToChange(true)}>Save</button>
        <Backspace className="close-title-editor" onClick={() => setIsEditingTitle(false)} />
      </div>
    </div>
  );
}


export default Card;