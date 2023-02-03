import axios from "axios";

export const fetchEvents = async () => {
  // var myHeaders = new Headers();
  // myHeaders.append("Content-Type", "application/json");
  // var requestOptions = {
  //     method: "get",
  //     headers: myHeaders,
  //     redirect: "follow",
      
  // };
  
  const data = await axios(`https://vindel.vercel.app/api/events`, {
    method: "GET",
  })
  
  
  return data
}

