import { useState, useEffect } from "react";

const RE_JWT = /^(?:[\w-]*\.){2}[\w-]*$/

const useLoginStatus = () => {
  const [status, setStatus] = useState(false);
  useEffect(() => {
    const getLoginStatus = () => {
      if (localStorage.getItem("token").match(RE_JWT)) setStatus(true);
      else setStatus(false);
    };
    getLoginStatus();
    console.log(status)
  });
  return status;
};

export default useLoginStatus;