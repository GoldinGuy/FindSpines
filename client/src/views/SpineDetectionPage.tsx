import React, { useEffect, useState } from "react";
import { FileUploader } from "../components";
import PropagateLoader from "react-spinners/PropagateLoader";
import { downloadAllFiles } from "../utils/gen";

const SpineDetectionPage = () => {
	const [responseFiles, setResponse] = useState<File[]>([]);
	const [loading, setLoading] = useState(false);

	// useEffect(() => {
	// 	console.log(responseFiles);
	// }, [responseFiles]);

	const handleAnnotateSpines = (toAnnotate: File[]) => {
		if (toAnnotate.length > 0) {
			setLoading(true);
			for (let i = 0; i < toAnnotate.length; i++) {
				const data = new FormData();
				data.append("file", toAnnotate[i]);
				fetch("http://127.0.0.1:5000/annotate_spines", {
					method: "POST",
					body: data
				}).then(response => {
					// console.log("response: ", response);
					response.blob().then(blob => {
						// console.log("blob: ", blob);
						let file = new File([blob], `file${i}`, {
							type: blob.type
						});
						setResponse(response => [...response, file]);
						if (i >= toAnnotate.length - 1) {
							setLoading(false);
						}
					});
				});
			}
		}
	};

	return (
		<div className="bg-grayer text-center m-auto">
			{!loading && responseFiles.length === 0 && (
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
					<FileUploader handleAnnotateSpines={handleAnnotateSpines} />
				</>
			)}
			{responseFiles.length > 0 && (
				<div>
					<div className="flex content-evenly">
						{responseFiles.map((file, idx) => {
							// console.log(file.name);
							return (
								<img
									src={URL.createObjectURL(file)}
									alt={file.name}
									title={file.name}
									key={idx}
									className="m-auto rounded-sm"
								/>
							);
						})}
					</div>
					<button
						id="submit"
						onClick={() => {
							downloadAllFiles(responseFiles);
						}}
						className="my-10 mx-4 px-3 py-2 rounded-md  bg-teal-500 hover:bg-teal-400 text-white focus:shadow-outline focus:outline-none"
					>
						Download Files
					</button>
					<button
						id="submit"
						onClick={() => {
							setResponse([]);
						}}
						className="my-10 mx-4 m px-3 py-2 rounded-md bg-gray-400 hover:bg-gray-300 text-white focus:shadow-outline focus:outline-none"
					>
						Find More Spines
					</button>
				</div>
			)}
			{loading && (
				<div className="m-auto mt-10 ">
					<PropagateLoader color={"#14b8a6"} loading={loading} size={25} />
				</div>
			)}
		</div>
	);
};
export default SpineDetectionPage;
