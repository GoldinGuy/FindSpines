import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicroscope } from "@fortawesome/free-solid-svg-icons";
const HeaderComp = () => {
	return (
		<>
			<div>
				<header className="z-30 w-full px-3 bg-teal-400 py-4 sm:px-4 bg-white shadow-sm mb-10">
					<div className="container flex items-center justify-between mx-auto">
						<Link to="/" className="flex items-center">
							<FontAwesomeIcon
								icon={faMicroscope}
								className="h-9 text-white"
								size="lg"
							/>
							<strong className="text-white pl-3 text-lg">FindSpines</strong>
						</Link>
						<div className="flex items-center md:inline-flex">
							<a
								target="_blank"
								rel="noreferrer"
								className="ml-4 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-teal-500 to-teal-500 hover:from-teal-500 hover:to-teal-500 hover:text-grayest"
								href="https://github.com/GoldinGuy/FindSpines"
							>
								Star FindSpines{" "}
								<span className="hidden sm:inline-block px-1"> On GitHub</span>{" "}
								🌟
							</a>
						</div>
					</div>
				</header>
			</div>
		</>
	);
};
export default HeaderComp;
