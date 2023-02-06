import axios from "axios";

export const fetchEvents = async () => {
  const res = await axios(`https://vindel.vercel.app/api/events`, {
    method: "GET",
  })
  const data = await res.json()
  console.log(data)
  return data;
}

