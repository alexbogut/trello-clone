import { Backspace, CardText, CardList, CaretRightSquare, Trash3Fill } from "react-bootstrap-icons";
import { useState, useEffect } from 'react'
import { useSelector, useDispatch  } from 'react-redux'
import { fetchCardDetails, fetchHomescreen } from '../../../helpers/fetchData'
import { postComment, updateDescription, updateMembers } from '../../../actions/post-actions';
import { deleteComment, removeMember } from '../../../actions/delete-actions';
import {storeCardDetails, storeHomescreen} from '../../../actions'
import { ThreeDots } from 'react-loader-spinner'
import _ from 'lodash';


function CardDetail({ setSelectedCardId, selectedCardId, setExistsDataToRender, cardId, listName, listId, boardId }) {

  const [currentComment, setCurrentComment] = useState('')
  const [isPostingComment, setIsPostingComment] = useState(false)
  const [isEditingComment, setIsEditingComment] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [isAddingMembers, setIsAddingMembers] = useState(false)
  const [isRemovingMembers, setIsRemovingMembers] = useState(false)
  const [membersWithColors, setMembersWithColors] = useState([])
  const [commentId, setCommentId] = useState('')
  const userId = useSelector((state)=> state?.auth?.userId)
  const cardDetails = useSelector((state)=> state?.cardDetails)
  const comments = useSelector((state)=> state?.cardDetails?.comments)
  const desc = useSelector((state)=> state?.cardDetails?.description)
  const members = useSelector((state) => state.homescreen.org?.members)
  const cardMembers = useSelector((state)=> state?.cardDetails?.members)
  const memberColors = ['bisque', 'darkcyan', 'darkgoldenrod', 'darkolivegreen' ]
  const [description, setDescription] = useState(desc)
  const dispatch = useDispatch()

useEffect(()=>{
if(!members) return
const membersToColors = members.map((i, index)=>{
  return {...i, color: memberColors[index]}
})
setMembersWithColors(membersToColors)
},[members])

//GET card details
useEffect(()=>{
  async function fetchData() {
    try{
      const cardDetails = await fetchCardDetails(cardId, listId, boardId)
      dispatch(storeCardDetails(cardDetails))
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
},[selectedCardId])

//POST comment
async function postNewComment(){
  try{
    await dispatch(postComment(userId, cardId, currentComment)) 
    }
  catch(e) {
      console.error(e)
    }
  finally{
      setCurrentComment('')
      setIsEditingComment(false)
    }
  }


//POST description
async function postDescription(){
  console.log('post description called')
  console.log('this is the descrit', description)
  try{
    dispatch(updateDescription(cardId, description)) 
    }
  catch(e) {
      console.error(e)
    }
  finally{
      setIsEditingDescription(false)
    }
  }

//POST member
async function postMember(member){
  if(cardMembers.includes(member)) return
  const newMembers = [...cardMembers, member]
  try{
     dispatch(updateMembers(cardId, newMembers)) 
    }
  catch(e) {
      console.error(e)
    }
  finally{
      setIsAddingMembers(false)
    }
  }

//REMOVE member
async function removeMember(selectedMember){
  console.log('selected member', selectedMember)
  const newMembers = _.remove(cardMembers, (member => {
    return member !== selectedMember
}))
  try{
     dispatch(updateMembers(cardId, newMembers)) 
    }
  catch(e) {
      console.error(e)
    }
  finally{
    setIsRemovingMembers(false)
  }
  }

//DELETE comment
  useEffect(()=>{
   async function deleteData(){
    try{
       dispatch(deleteComment(commentId))
    }
    catch(e){
      console.error(e)
    }
    finally{
      setCommentId('')
    }
   }
   if(commentId?.length<2)return 
   deleteData()
  },[commentId])

  function getUserById(id){
    if(!members) return 
    const user = members.find((i) => i.id === id);
    const userName = user ? user.name : null;   
    if(userName===null) return 
    const [firstName, lastName] = userName.split(" ");
    const initials = firstName[0] + lastName[0]; 
    return initials
  }

  function lookUpColor(name){
    if(!name) return
    if(membersWithColors===[]) return
    const user = membersWithColors.find((i)=> i.name === name)
    if(!user) return
    const userColor = user.color
    return userColor
  }


  function lookUpColorById(id){
    if(!id) return
    if(membersWithColors===[]) return
    const user = membersWithColors.find((i)=> i.id === id)
    if(!user) return
    const userColor = user.color
    return userColor
  }


function closeHandler(){
  setExistsDataToRender(true)
  setSelectedCardId(null)
}


    return (
      <div className="card-detail-box">
        <h5><CaretRightSquare className="card-icons"/>{cardDetails.title}</h5>
        <p>in list <span className="card-detail-workflow">{listName}</span></p>
        <div className="add-members-box">
        <div className="members-info-section">
        <label>Members:</label>
        <div className="card-detail-circles">
          {cardMembers?.length>0 ? cardMembers?.map((i, index)=>{
            const [firstName, lastName] = i.split(" ");
            const initials = firstName[0] + lastName[0];
          return <><div className="card-detail-members" style={{backgroundColor: lookUpColor(i)}} onClick={()=>setIsRemovingMembers(true)}>{initials}</div>
            {isRemovingMembers ? <div className="remove-members-box">
              <Backspace onClick={()=>setIsRemovingMembers(false)} className="close-remove-members icn"/>
              <button className="btn btn-danger" onClick={()=>removeMember(i)}>Remove Member</button>
              </div> : null}</>
        })
            : null}
          <div className="card-detail-add-members icn" onClick={()=>setIsAddingMembers(true)}>+</div>
          </div>
          </div>
        {isAddingMembers ? <div className="list-of-members">
          <Backspace onClick={()=>setIsAddingMembers(false)} className="close-members-list icn"/>
          <ul>
            <li>Members</li>
            <hr></hr>
          {members?.map((member, index)=> {
            const [firstName, lastName] = member.name.split(" ");
            const initials = firstName[0] + lastName[0];
          return <li onClick={()=>postMember(member.name)}><span className="initials-circle" style={{backgroundColor: memberColors[index]}}>{initials}</span><span>{member.name}</span></li> })}
          </ul>
        </div> : null}
        </div>
        <Backspace className="close-card-detail icn" onClick={()=>closeHandler()}/>
        <h5><CardText className="card-icons"/>Description
        <button className="btn edit-description-button" onClick={()=>setIsEditingDescription(true)}>Edit</button></h5>
        <p className="card-description" style={{display: isEditingDescription ? 'none' : 'block'}}>{desc}</p>
        <div className="description-editor" style={{display: isEditingDescription ? 'block' : 'none'}}>
        <textarea value={description} onChange={(e)=>setDescription(e.target.value)}></textarea>
        <button className="save-description btn btn-success" onClick={()=>postDescription()}>Save</button>
        </div>
        <h5><CardList className="card-icons"/>Activity</h5>
        <div className="comment-editor">
          <textarea placeholder="Write a comment.." value={currentComment} onChange={(e)=>setCurrentComment(e.target.value)} onFocus={()=>setIsEditingComment(true)}>
          </textarea>
          <button className="save-comment btn" onClick={()=>postNewComment()} style={{display: isEditingComment ? 'block' : 'none',}}>
            {isPostingComment ? null : <span>Save</span>}{isPostingComment ? <div className='loader'><ThreeDots color="black"/></div> : null}</button>
        </div>
        {comments?.length>0 ? comments?.map((i, index)=>{
          if (!i.text) return
          return <div className="comment" key={i.id}>
          <span  className="initials-circle-comment" style={{backgroundColor: lookUpColorById(i.userId)}}>{getUserById(i.userId)}</span>
          <span>{i.text}</span>
          <span data-key={i.id} className="delete-comment icn" onClick={(e)=>setCommentId(e.currentTarget.dataset.key)}>
            <Trash3Fill/></span></div>}): null}
      </div>
    );
  }
  
  export default CardDetail;
  