import WorkflowList from "./WorkflowList"
import {useDrop} from 'react-dnd'
import {useDispatch, useSelector} from 'react-redux'
import {reOrderLists} from '../../actions'

function ListLocation({boardId, workflows, listOrder }) {
    const dispatch = useDispatch();
    const { id } = useSelector(state => state.boardDetails)

    const [, drop] = useDrop({
        accept: 'list',
        drop: (list) => {
            console.log('this got called')
            const selected=list.id
            const fromOrder=list.listOrder
            const newLists=workflows.map((i)=>{
            if(i.id===selected){
                return {
                    ...i,
                    order: listOrder
                }
            }
            else if(i.id!==selected && i.order===listOrder){
                
                if(fromOrder>i.order) return {...i, order: i.order+1}
                if(fromOrder<i.order) return {...i, order: i.order-1}
            }
            else if (i.id!==selected && i.order!==listOrder){
                if(fromOrder>i.order&&listOrder<i.order) return {...i, order: i.order+1}
                if(fromOrder<i.order&&listOrder>i.order) return {...i, order: i.order-1}
            }
            return i
        })
        console.log('new lists', newLists)
        dispatch(reOrderLists(newLists, id))
        }
    })

return (
<div ref={drop} className="list-location">
{workflows?.map((i)=>{
if(i.order===listOrder){
 return <WorkflowList lists={workflows} listOrder={i.order} boardId={boardId} key={i.id} id={i.id} cardItems={i.cards} description={i.description}/>
}

})}
 </div>
)
}

export default ListLocation