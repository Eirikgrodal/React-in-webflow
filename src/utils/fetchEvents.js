import axios from "axios";

export const fetchEvents = async () => {
  try {
    const res = await axios(`https://vindel.vercel.app/api/events`, {
      method: "GET",
    })
    const data = await res.json()
    return data;
  }
  catch (error) {
    console.log(error)
  }
}

