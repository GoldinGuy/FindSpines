import React, { useState } from "react";
import { FileUploader } from "../components";
import PacmanLoader from "react-spinners/PacmanLoader";
import { downloadAllFiles } from "../utils/gen";

const SpineDetectionPage = () => {
	const [responseFiles, setResponse] = useState<File[]>([]);
	const [loading, setLoading] = useState(false);
	const [numAnnotated, setNumAnnotated] = useState(0);
	const [numToAnnotate, setToAnnotate] = useState(0);

	// useEffect(() => {
	// 	console.log(responseFiles);
	// }, [responseFiles]);

	const timeDelay = async (i: number) => {
		if (i % 2 === 0) {
			setTimeout(() => {
				console.log("delay to avoid crashing app");
			}, 5000);
		}
	};

	const handleAnnotateSpines = async (toAnnotate: File[]) => {
		if (toAnnotate.length > 0) {
			setNumAnnotated(0);
			setToAnnotate(toAnnotate.length);
			setLoading(true);
			for (let i = 0; i < toAnnotate.length; i++) {
				await timeDelay(i);
				const data = new FormData();
				data.append("file", toAnnotate[i]);
				await fetch("https://find-spines-api.herokuapp.com/annotate_spines", {
					//"http://127.0.0.1:5000/annotate_spines",
					method: "POST",
					body: data
				}).then(response => {
					// console.log("response: ", response);
					response.blob().then(blob => {
						// console.log("blob: ", blob);
						let file = new File([blob], `file${i}`, {
							type: blob.type
						});
						setNumAnnotated(numAnnotated => numAnnotated + 1);
						setResponse(response => [...response, file]);
						setTimeout(() => {
							if (i >= toAnnotate.length - 1) {
								setLoading(false);
							}
						}, 4000);
					});
				});
				console.log(i);
			}
		}
	};

	return (
		<div className="bg-grayer text-center m-auto">
			{!loading && responseFiles.length === 0 && (
				<>
					<div className="text-center">
						<h2 className="text-3xl text-grayest font-bold mx-4">
							Find Dendritic Spines In Images
						</h2>
						<p className="text-xl text-grayest mx-4 sm:mx-28 md:mx-40 my-6">
							Quickly annotate dendritic spines in two-photon microscopy images
							using the power of <br />
							<strong>Faster Recurrent Convolutional Neural Networks</strong>
						</p>
					</div>
					<FileUploader handleAnnotateSpines={handleAnnotateSpines} />
				</>
			)}
			{loading && (
				<div className="flex justify-center pb-10 -ml-16">
					<PacmanLoader color={"#14b8a6"} loading={loading} size={32} />
				</div>
			)}
			<div>
				<div className="overflow-y-hidden py-3 px-8 w-full h-full flex flex-col">
					{numToAnnotate > 0 && (
						<div className="pb-10">
							<h1 className="py-2 font-semibold sm:text-lg text-gray-900">
								{!loading
									? "All Annotated!"
									: `${numAnnotated} of ${numToAnnotate}`}
							</h1>
							{!loading && (
								<p className="text-sm">(Double Click to open Image)</p>
							)}
						</div>
					)}
					{responseFiles.length > 0 && (
						<ul
							id="gallery"
							className="flex flex-1 flex-wrap -m-1 justify-center content-evenly"
						>
							{responseFiles.map((file, idx) => {
								return (
									<li
										className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-32 lg:h-44 xl:h-48"
										id={URL.createObjectURL(file)}
										key={idx}
										onDoubleClick={() =>
											window.open(URL.createObjectURL(file), "_blank")
										}
									>
										<article
											tabIndex={0}
											className="group hasImage w-full h-full rounded-md focus:outline-none focus:shadow-outline bg-gray-100 cursor-pointer relative text-transparent hover:text-white shadow-sm"
										>
											<img
												alt="upload preview"
												className="img-preview w-full h-full sticky object-cover rounded-md bg-fixed"
												src={URL.createObjectURL(file)}
											/>

											<section className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
												<h1 className="flex-1">{file.name}</h1>
												<div className="flex">
													<span className="p-1">
														<i>
															<svg
																className="fill-current w-4 h-4 ml-auto pt-"
																xmlns="http://www.w3.org/2000/svg"
																width="24"
																height="24"
																viewBox="0 0 24 24"
															>
																<path d="M5 8.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5zm9 .5l-2.519 4-2.481-1.96-4 5.96h14l-5-8zm8-4v14h-20v-14h20zm2-2h-24v18h24v-18z" />
															</svg>
														</i>
													</span>

													<p className="p-1 size text-xs">
														{file.size > 1024
															? file.size > 1048576
																? Math.round(file.size / 1048576) + "mb"
																: Math.round(file.size / 1024) + "kb"
															: file.size + "b"}
													</p>
													<button
														className="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md"
														onClick={() => {
															setResponse(files =>
																files.filter((file, i) => {
																	return idx !== i;
																})
															);
														}}
													>
														<svg
															className="pointer-events-none fill-current w-4 h-4 ml-auto"
															xmlns="http://www.w3.org/2000/svg"
															width="24"
															height="24"
															viewBox="0 0 24 24"
														>
															<path
																className="pointer-events-none"
																d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z"
															/>
														</svg>
													</button>
												</div>
											</section>
										</article>
									</li>
								);
							})}
						</ul>
					)}
				</div>
				{responseFiles.length > 0 && (
					<>
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
								setToAnnotate(0);
							}}
							className="my-10 mx-4 m px-3 py-2 rounded-md bg-gray-400 hover:bg-gray-300 text-white focus:shadow-outline focus:outline-none"
						>
							Find More Spines
						</button>
					</>
				)}
			</div>
		</div>
	);
};
export default SpineDetectionPage;
