import { useState, useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

const useUserRoleStatus = (roleToCheck) => {
    const [status, setStatus] = useState(false);
    let roles = useLocalStorage("roles")
    
    useEffect(() => {
        try {
            JSON.parse(roles[0]).includes(roleToCheck) ? setStatus(true) : setStatus(false)
        } catch {
            setStatus(false)
        }
    })

  return status;
};

export default useUserRoleStatus
