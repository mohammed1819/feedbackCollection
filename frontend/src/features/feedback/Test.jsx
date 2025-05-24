import { useEffect,useState } from "react"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import useAuth from "../../hooks/useAuth"

const Test = () => {
  const axiosPrivate = useAxiosPrivate()
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null)
  const {auth} = useAuth()
  console.log(auth.accessToken)
  useEffect(() => {
    let isMounted = true; 

    const fetchFunction = async () => {
      try {
        const response = await axiosPrivate.get("/test");
        isMounted && setContent(response?.data?.message);
      } catch (err) {
        console.error(err?.response || err);
        isMounted && setError("Failed to fetch data");
      }
    };

    fetchFunction();

    return () => {
      isMounted = false;
    };
  }, [axiosPrivate]);

  return content
}

export default Test
