import {
	faCircleUser,
	faAngleDown,
	faTicket,
	faRightFromBracket,
	faAngleUp,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import githubSvg from '../assets/github-icon.svg'
import userIcon from '../assets/user-ico.svg'

function Navbar({userDetails}) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const navigate = useNavigate();
	const menuRef = useRef(null);
	const triggerRef = useRef(null);

	// Toggle menu
	const toggleMenu = () => setIsMenuOpen((prev) => !prev);

	// Close menu when clicking outside of it
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target) &&
				triggerRef.current &&
				!triggerRef.current.contains(event.target)
			) {
				setIsMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div
			className="fixed top-0 z-50 w-[100vw] h-[80px] bg-gray-100 flex justify-between drop-shadow-md items-center sm:px-0 md:px-8 lg:px-6 text-gray-700">
			<div
				onClick={() => navigate("/home")}
				className="text-lg md:text-xl pl-3 font-bold cursor-pointer flex items-center gap-3"
			>   
                <a className="hover:animate-pulse" target="_blank" href="https://github.com/Archshinde/MovieEase"><img width={40} height={40} src={githubSvg} alt="github-icon" /></a>
				<h3 className="hover:text-gray-900">MoviEase</h3>
			</div>
            
			<div
				ref={triggerRef}
				onClick={toggleMenu}
				className={`userMenu rounded-[60px] group relative h-[60%] px-[1.5rem] flex items-center gap-3 cursor-pointer select-none
                ${
					isMenuOpen
						? "bg-gray-400 text-gray-700"
						: "hover:bg-gray-300 hover:text-gray-700"
				}`}
			>
				{/* <FontAwesomeIcon className="text-lg md:text-xl" icon={faCircleUser}/> */}
                <img src={userIcon} alt="user-icon" />
				<h1 className="text-base md:text-md font-medium hidden sm:block">
					{userDetails ? userDetails.name.toUpperCase() : "Login"}
				</h1>
				{isMenuOpen ? (
					<FontAwesomeIcon
						icon={faAngleUp}
						className="arrow text-xl md:text-xl transition-all duration-300 ease-in-out"
					/>
				) : (
					<FontAwesomeIcon
						icon={faAngleDown}
						className="arrow text-xl md:text-xl transition-all group-hover:pt-3 group-hover:animate-bounce duration-500 ease-in-out"
					/>
				)}

				<div
					ref={menuRef}
					className={`absolute right-0 top-[67px] z-10 w-[220px] md:w-[245px] bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-200 ease-in-out
  ${isMenuOpen ? "max-h-[200px] py-2" : "max-h-0"}`}
				>
					<ul className="px-2">
						<li
							onClick={() => navigate("/bookedShows")}
							className="leading-[2.5] px-3 rounded-lg hover:bg-slate-300 hover:bg-opacity-20 cursor-pointer"
						>
							<FontAwesomeIcon className="text-gray-600" icon={faTicket}/>
							<span className="ml-3 text-gray-950">Booked Shows</span>
						</li>
						<li
							onClick={() => {
								localStorage.removeItem("token");
								navigate("/");
							}}
							className="leading-[2.5] px-3 rounded-lg hover:bg-slate-300 hover:bg-opacity-20 cursor-pointer"
						>
							<FontAwesomeIcon
								className="text-gray-600 pr-[2px]"
								icon={faRightFromBracket}
							/>
							<span className="ml-3 text-gray-950">Log Out</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

export default Navbar;
