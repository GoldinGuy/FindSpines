import React, { FormEvent, useRef, useState } from "react";
import { ImagePanel, FileUploader } from "../components";
import PropagateLoader from "react-spinners/PropagateLoader";

const SpineDetectionPage = () => {
	const [responseFiles, setResponse] = useState<any>();
	const [loading, setLoading] = useState(false);

	// const handleAnnotateSpines = (e: FormEvent) => {
	// 	e.preventDefault();
	// 	setLoading(true);
	// 	const data = new FormData();
	// 	if (uploadInputRef.current?.files && fileNameRef.current?.value) {
	// 		data.append("file", uploadInputRef.current.files[0]);
	// 		data.append("filename", fileNameRef.current.value);
	// 	}
	// };

	return (
		<div className="bg-grayer text-center m-auto">
			<ImagePanel handleAnnotateSpines={() => {}} />
			{!loading && (
				<>
					<div className="text-center">
						<h2 className="text-3xl text-grayest font-bold">
							Find Dendritic Spines In Images
						</h2>
						<p className="text-xl text-grayest mx-4 sm:mx-28 md:mx-40 my-6">
							Quickly annotate dendritic spines in two-photon microscopy images
							using the power of <br />
							<strong>Faster Recurrent Convoluntional Neural Networks</strong>
						</p>
					</div>
					<FileUploader setResponse={setResponse} setLoading={setLoading} />
				</>
			)}
			<div className="m-auto mt-10 ">
				<PropagateLoader color={"#14b8a6"} loading={loading} size={25} />
			</div>
		</div>
	);
};
export default SpineDetectionPage;
