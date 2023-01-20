import { useDrag } from 'react-dnd'
import _ from 'lodash';
import { Pencil, Backspace, Chat, Trash3Fill } from 'react-bootstrap-icons'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CardDetail from './CardDetail/CardDetail'
import { deleteCard } from '../../actions/delete-actions'
import { updateCard } from '../../helpers/postData'
import { ThreeDots } from 'react-loader-spinner'
import { reOrderCards, storeBoardDetails, storeHomescreen } from '../../actions'
import { fetchBoardDetails } from '../../helpers/fetchData';
import { fetchHomescreen } from '../../helpers/fetchData'

const Card = ({ order, title, cardId, listId, description, listName, boardId, cardMembers, comments }) => {
  const dispatch = useDispatch();
  const [cardTitle, setCardTitle] = useState(title)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [existsTitleToChange, setExistsTitleToChange] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState(null)
  const [existsDataToRender, setExistsDataToRender] = useState(false)
  const [membersWithColors, setMembersWithColors] = useState([])
  const memberColors = ['bisque', 'darkcyan', 'darkgoldenrod', 'darkolivegreen' ]
  const userId = useSelector((state)=> state?.auth?.userId)
  const members = useSelector((state) => state.homescreen.org?.members)
  const {cards} = useSelector((state) => state.boardDetails)

  console.log(cardMembers)
  useEffect(()=>{
    if(!members) return
    const membersToColors = members.map((i, index)=>{
      return {...i, color: memberColors[index]}
    })
    setMembersWithColors(membersToColors)
    },[members])

  function lookUpColor(name){
      if(!name) return
      if(membersWithColors===[]) return
      const user = membersWithColors.find((i)=> i.name === name)
      if(!user) return
      const userColor = user.color
      return userColor
    }

  useEffect(()=>{
    async function fetchData() {
      try{
        if(userId){
        const homescreen = await fetchHomescreen(userId)
        dispatch(storeHomescreen(homescreen))
        }
      }
      catch (error) {
        console.log(error)
    } finally {
        console.log('done')
    }
  }
    fetchData()
  },[])

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

  useEffect(() => {
    const getData = async () => {
      try{
          const boardDetails = await fetchBoardDetails(boardId)
          dispatch(storeBoardDetails(boardDetails))
      }
      catch(e){
        console.error(e)
      }
      finally{
        setExistsDataToRender(false)
      }
    }
    if(!existsDataToRender) return 
    getData();
    return;
  }, [existsDataToRender]);

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
      setIsDeleting(false)
    }
  }

  //UPDATE card title
  useEffect(() => {
    async function postData() {
      try {
        setIsUpdating(true)
        await updateCard(cardId, cardTitle)
      }
      catch (e) {
        console.error(e)
      }
      finally {
        setIsEditingTitle(false)
        setIsUpdating(false)
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
        <div className='open-card-detail-target' onClick={(e) =>
          setSelectedCardId(cardId)}>
          <div  >
            {cardTitle}
          </div>
          {cardMembers!==[] ? <div className='card-circles-container'>
            {cardMembers.map((i)=>{
              const [firstName, lastName] = i.split(" ");
              const initials = firstName[0] + lastName[0];
              return <span  className="initials-circle-card" style={{backgroundColor: lookUpColor(i)}}>{initials}</span>
            })}
          </div> : null}
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
          <div className='comments-length'><Chat /><span>{comments?.length}</span></div>
        </div>
      </div>
      {selectedCardId===cardId ? <CardDetail setExistsDataToRender={setExistsDataToRender} setSelectedCardId={setSelectedCardId} selectedCardId={selectedCardId} listId={listId} cardId={cardId} listName={listName} boardId={boardId} /> : null}
      <div className='card-title-editor' style={{ display: isEditingTitle ? 'flex' : 'none', }}>
        <input type="text" value={cardTitle} onChange={(e) => setCardTitle(e.target.value)}></input>
        <button className='btn btn-primary' onClick={() => setExistsTitleToChange(true)}>Save</button>
        <Backspace className="close-title-editor" onClick={() => setIsEditingTitle(false)} />
      </div>
    </div>
  );
}


export default Card;