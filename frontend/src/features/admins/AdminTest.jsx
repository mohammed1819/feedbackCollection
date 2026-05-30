import { useEffect, useState } from "react"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"

const AdminTest = () => {

    const axiosPrivate = useAxiosPrivate()
    const [message, setmessage] = useState('')

    useEffect(()=>{
        const fetchAdmin = async () =>{
            try{
                const response = await axiosPrivate.get('/test')
                if(response){
                    setmessage(response?.data?.message)
                }
            }catch(err){
                console.log(err?.response || err)
            }
        } 
        fetchAdmin()
    },[message])

  return (
    <div>
      {
        message ? <p>Yes there are companies</p> : <p>Loading...</p>
      }
    </div>
  )
}

export default AdminTest
