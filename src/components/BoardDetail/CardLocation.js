import Card from './Card';
import {useDrop} from 'react-dnd'
import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {reOrderCards} from '../../actions'

function CardLocation ({index, listId, listName, boardId}){

  const {cards, id} = useSelector((state) =>state?.boardDetails)
  const dispatch = useDispatch();

  const [, drop] = useDrop({
    accept: 'card',
    drop: (card) => {
      const fromOrder = card.order;
      const fromListId = card.listId;
      const selected = card.title;
      let highestOrder = cards
        .filter(i => i.listId === listId)
        .map(i => i.order)
        .sort((a, b) => b - a)[0];
      if (!highestOrder) highestOrder = -1;
      const nextCards = cards.map(i => {
          if (i.title === selected) {
              return {
                ...i,
                listId: listId,
                order: index > highestOrder + 1 ? highestOrder + 1 : index
              };
          }
          //reorder within same list
          else if(i.listId===fromListId && i.title !== selected && fromListId===listId){
            if(i.order>index){
                if(i.order>fromOrder) return i
                if(i.order<fromOrder) return {...i, order: i.order+1}
            }
            if(i.order<index) {
               if(i.order<fromOrder) return i
               if(i.order>fromOrder) return {...i, order: i.order-1}
            }
            if(i.order===index){
                if(i.order>fromOrder) return {...i, order: i.order-1}
                if(i.order<fromOrder) return {...i, order: i.order+1}
                else return i
            }
            else return i
        }
        //decrement items in the fromList
        else if(i.listId === fromListId && fromListId !== listId){
          if(i.order>fromOrder) return {...i, order: i.order-1}
          else return i
        }
        //from different list
        else if(i.listId !== fromListId && i.title !== selected && i.listId === listId){
          if(i.order >= index) return {...i, order: i.order+1}
          return i
        }
        else return i
    })
    const orders = nextCards.map((i)=>i.order)
    console.log(orders)    
    dispatch(reOrderCards(nextCards))
    },
});

    


return (
    <div ref={drop} className='card-location' id={index}>
    {cards?.map((i) => {
      if (i?.listId === listId && i?.order === index) {
        return <Card cardMembers={i.members} order={index} key={i.id} title={i.title} cardId={i.id} listId={i.listId} description={i.description} listName={listName} comments={i.comments} boardId={boardId}/>
      }
      if(i?.order === index){
      return <div className='empty-div'></div>
      }
    })}
  </div>
)
}

export default CardLocation