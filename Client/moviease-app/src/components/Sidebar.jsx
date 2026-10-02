import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faRightFromBracket, faTicket } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar, userDetails }) => {
  console.log(userDetails);
  
  return (
    <aside
      className={`fixed top-0 right-0 h-full bg-gray-800 text-white w-64 transform transition-transform duration:500 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } z-50`}
    >
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Hello, {userDetails.name.split(" ")[0]}</h2>
        <ul>
          <li className="leading-[2.5]">
            <FontAwesomeIcon icon={faHouse} />
            <Link className="m-3" to="/home">Home</Link>
          </li>
          <li className="leading-[2.5]">
            <FontAwesomeIcon icon={faTicket} />
            <Link className="m-3" to="/home">Booked Shows</Link>
          </li>
          <li onClick={() => {
            toggleSidebar(!isOpen)
            localStorage.removeItem("token");
          }} className="leading-[2.5]">
            <FontAwesomeIcon icon={faRightFromBracket} />
            <Link className="m-3" to="/">Log Out</Link>
          </li>
        </ul>
        <button
          onClick={toggleSidebar}
          className="h-[4px] mt-4 px-[50px] bg-zinc-600 hover:bg-red-700 rounded"
        >
          Close
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
