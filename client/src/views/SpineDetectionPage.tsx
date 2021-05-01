import React, { FormEvent, useRef, useState } from "react";
import { ImagePanel, FileUploader } from "../components";
import PropagateLoader from "react-spinners/PropagateLoader";

const SpineDetectionPage = () => {
	const [responseFiles, setResponse] = useState<any>();

	const [loading, setLoading] = useState(false);

	const handleAnnotateSpines = (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		// const data = new FormData();
		// if (uploadInputRef.current?.files && fileNameRef.current?.value) {
		// 	data.append("file", uploadInputRef.current.files[0]);
		// 	data.append("filename", fileNameRef.current.value);
		// }

		fetch("http://127.0.0.1:5000/annotate_spines", {
			method: "POST",
			body: file
		}).then(response => {
			response.json().then(body => {
				setFile(`http://localhost:8000/${body.file}`);
			});
			setLoading(false);
		});
	};

	return (
		<div className="bg-grayer text-center m-auto">
			<ImagePanel handleAnnotateSpines={handleAnnotateSpines} />
			{!loading && (
				<>
					<div className="text-center">
						<h2 className="text-3xl text-grayest font-bold">
							Find Dendritic Spines In Images
						</h2>
						<p className="text-xl text-grayest mx-8 sm:mx-28 md:mx-40 my-6">
							Quickly annotate dendritic spines in two-photon microscopy images
							using the power of <br />
							<strong>Faster Recurrent Convoluntional Neural Networks</strong>
						</p>
					</div>
					<FileUploader setResponse={setResponse} />
					{/* <form onSubmit={(e: FormEvent) => handleAnnotateSpines(e)}>
						<label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-white">
							<svg
								className="w-8 h-8"
								fill="currentColor"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
							>
								<path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
							</svg>
							<span className="mt-2 text-base leading-normal">
								Select a file
							</span>
							<input
								ref={uploadInputRef}
								onChange={e => {
									if (e?.target?.files) {
										setFile(URL.createObjectURL(e.target.files[0]));
									}
								}}
								type="file"
								className="hidden"
							/>
						</label>

						<div>
							<button>Upload</button>
						</div>
						{file && <img className="m-auto" src={file} alt="img" />}
					</form> */}
				</>
			)}
			<div className="m-auto mt-10 ">{/* <ReadImg /> */}</div>
			<div className="m-auto mt-10 ">
				<PropagateLoader color={"#14b8a6"} loading={loading} size={25} />
			</div>
		</div>
	);
};
export default SpineDetectionPage;
