const NUM_REQUIRED = 1; // 3

const ImagePanel = ({
	handleAnnotateSpines
}: {
	handleAnnotateSpines: Function;
}) => {
	/* 	const removeSelectedImg = img => {
		setselectedImgs(
			selectedImgs.filter(selected => {
				return img !== selected;
			})
		);
	}; */

	return (
		<div className="mb-8 bg-teal-400 w-screen flex items-center h-24 overflow-x-hidden shadow-md">
			{/* 		{selectedImgs.map((img, idx) => {
				return (
					<button
						className="h-full border-none outline-none focus:outline-none focus:border-0 "
						onClick={() => removeSelectedImg(img)}
						key={img.name + "-imgpanel"}
					>
						<img
							src={img.photo}
							alt="img-cover"
							className="h-full "
							title={img.name}
							key={img.name + "-imgimg"}
						/>
					</button>
				);
			})}
			{selectedImgs.length >= NUM_REQUIRED ? (
				<button
					onClick={() => handleAnnotateSpines()}
					className="rounded-md px-1.5 sm:px-6 h-14 bg-teal-500 text-md md:text-lg text-gray-50 m-auto font-bold float-right focus:outline-none focus:border-0 mr-1 md:mr-10 self-center hover:bg-teal-500"
				>
					Generate List
				</button>
			) : null} */}
		</div>
	);
};
export default ImagePanel;
