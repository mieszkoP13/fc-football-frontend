// import React, { useState } from "react";
// import axios from "axios";
// import "./DeleteLeague.css";
// import PopUp from "./PopUp";

// const DeleteLeague = ({leagueId}) => {
//   const [showPopUp, setShowPopUp] = useState(true);

//   const deleteLeague = () => {
//     axios
//       .delete(
//         `https://fcfootball.azurewebsites.net/api/v1/leagues/${leagueId}`)
//       .then((res) => {
//         console.log(res)
//       })
//       .catch((err) => console.log(err));
//   };

//   return (
//     <>
//       {showPopUp ? (
//           <PopUp setShow={setShowPopUp} customFunction={deleteLeague} customFunctionBtnText="Delete" defaultBtnText="Cancel">
//             <h1 className="sign-in-err-h1">
//               Are you sure you want to delete this league?
//             </h1>
//             <span>This action is irreversible</span>
//           </PopUp>
//       ) : (<></>)}
//     </>
//   );
// };

// export default DeleteLeague