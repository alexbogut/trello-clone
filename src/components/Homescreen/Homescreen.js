
import HomeHeader from "./HomeHeader";
import BoardList from "./BoardList";
import { useSelector, useDispatch } from "react-redux";
import { fetchHomescreen } from '../../helpers/fetchData';
import { storeHomescreen } from '../../actions';
import { useEffect, useState } from "react";


const Homescreen = () => {
  const { userId } = useSelector(state => state.auth)
  const [isLoading, setIsLoading] = useState(true)
  const [isPosting, setIsPosting] = useState(0)
  const data = useSelector((state) => state.homescreen)
  const dispatch = useDispatch()
  
  useEffect(() => {
    if(userId) {
      async function fetchData() {
        try {
          const homescreen = await fetchHomescreen(userId)
          dispatch(storeHomescreen(homescreen))
        }
        catch (error) {
          console.log(error)
        } finally {
          setIsLoading(false);
        }
      }
      fetchData()
    }
  }, [isPosting, userId])




  if (isLoading) {
    return <div>Loading..</div>
  }
  return (
    <div>
      <HomeHeader title={data?.org?.name} />
      <BoardList boards={data?.org?.boards} userId={userId} setIsPosting={setIsPosting} />
    </div>
  );
}

export default Homescreen;
