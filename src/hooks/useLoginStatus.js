import { useState, useEffect } from "react";
import axios from "axios";

const useLoginStatus = () => {
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const getLoginStatus = () => {
        axios
        .get("https://fcfootball.azurewebsites.net/api/v1/followed-leagues",{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => setStatus(true))
        .catch((err) => setStatus(false));
    };
    getLoginStatus();
  });

  return status;
};

export default useLoginStatus;