import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicroscope } from "@fortawesome/free-solid-svg-icons";
const HeaderComp = () => {
	return (
		<>
			<div>
				<header className="z-30 w-full px-3  py-4 sm:px-4 bg-white shadow-sm">
					<div className="container flex items-center justify-between mx-auto">
						<Link to="/" className="flex items-center">
							<FontAwesomeIcon
								icon={faMicroscope}
								className="h-9 text-teal-500"
								size="lg"
							/>
							<strong className="text-teal-500 pl-3 text-lg">FindSpines</strong>
						</Link>
						<div className="flex items-center md:inline-flex">
							<a
								target="_blank"
								rel="noreferrer"
								className="ml-4 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-teal-500 to-teal-500 hover:from-teal-500 hover:to-teal-500 hover:text-grayest"
								href="https://github.com/GoldinGuy/ReadMe"
							>
								Star FindSpines On GitHub 🌟
							</a>
						</div>
					</div>
				</header>
			</div>
		</>
	);
};
export default HeaderComp;
