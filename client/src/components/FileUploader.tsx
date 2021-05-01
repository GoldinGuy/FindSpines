import { useRef, useState } from "react";

const FileUploader = ({
	setResponse,
	setLoading
}: {
	setResponse: Function;
	setLoading: Function;
}) => {
	const [files, setFiles] = useState<File[]>([]);
	const [isEmpty, setEmpty] = useState(true);
	const [counter, setCount] = useState(0);

	const galleryRef = useRef<HTMLUListElement>(null);
	const overlayRef = useRef<HTMLDivElement>(null);
	const fileTemplRef = useRef<HTMLTemplateElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const emptyRef = useRef<HTMLLIElement>(null);

	const addFiles = (data: File | File[] | FileList) => {
		console.log(data);
		if ("0" in data) {
			setFiles(files.concat(Object.values(data)));
			setEmpty(false);
		} else if ("type" in data && data.type.match("image.*")) {
			setFiles([...files, data]);
			setEmpty(false);
		}
	};

	// check if a file is being dragged
	const hasFiles = ({ dataTransfer: { types = [""] } }) => {
		return types.indexOf("Files") > -1;
	};

	const dropHandler = ev => {
		ev.preventDefault();
		addFiles(ev.dataTransfer.files);
		setCount(count => count + ev.dataTransfer.files.length);
	};

	// only react to actual files being dragged
	const dragEnterHandler = e => {
		e.preventDefault();
		if (!hasFiles(e)) {
			return;
		}
		counter + 1 && overlayRef.current?.classList.add("draggedover");
	};

	const dragLeaveHandler = e => {
		1 > counter - 1 && overlayRef.current?.classList.remove("draggedover");
	};

	const dragOverHandler = e => {
		if (hasFiles(e)) {
			e.preventDefault();
		}
	};

	const addRandomImg = () => {
		let len = 6;
		let n = Math.floor(Math.random() * 205) + 1;
		let fileName = (new Array(len + 1).join("0") + n).slice(-len);
		fetch(`../assets/test/img/${fileName}.jpg`).then(response => {
			response.blob().then(blob => {
				let file = new File([blob], `${fileName}.jpg`, { type: "image/jpeg" }); //{ type: blob.type });
				addFiles(file);
			});
		});
	};

	const handleFileSubmit = () => {
		// var data = new FormData();
		// for (const file of files) {
		// 	data.append("file", file);
		// }
		const data = new FormData();
		data.append("file", files[0]);
		fetch("http://127.0.0.1:5000/annotate_spines", {
			method: "POST",
			body: data
		}).then(response => {
			response.json().then(body => {
				setResponse(response);
			});
			setLoading(false);
		});
		console.log(files[0]);
	};

	return (
		<>
			<div className="bg-grayer h-screen w-screen sm:px-8 md:px-16 sm:py-8">
				<main className="container mx-auto max-w-screen-lg h-full">
					{/* <!-- file upload modal --> */}
					<article
						aria-label="File Upload Modal"
						className="relative h-full flex flex-col bg-white shadow-xl rounded-md"
						onDrop={e => dropHandler(e)}
						onDragOver={e => dragOverHandler(e)}
						onDragLeave={e => dragLeaveHandler(e)}
						onDragEnter={e => dragEnterHandler(e)}
					>
						{/* <!-- overlay --> */}
						<div
							id="overlay"
							ref={overlayRef}
							className="w-full h-full absolute top-0 left-0 pointer-events-none z-50 flex flex-col items-center justify-center rounded-md"
						>
							<i>
								<svg
									className="fill-current w-12 h-12 mb-3 text-teal-700"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
								>
									<path d="M19.479 10.092c-.212-3.951-3.473-7.092-7.479-7.092-4.005 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408zm-7.479-1.092l4 4h-3v4h-2v-4h-3l4-4z" />
								</svg>
							</i>
							<p className="text-lg text-teal-700">Drop files to upload</p>
						</div>

						{/* <!-- scroll area --> */}
						<section className="h-full overflow-auto p-8 w-full h-full flex flex-col">
							<header className="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
								<p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
									<span>Drag and drop your</span>&nbsp;
									<span>images anywhere</span>
								</p>
								<input
									id="hidden-input"
									type="file"
									multiple
									className="hidden"
									ref={fileInputRef}
									onChange={e => {
										if (e?.target?.files) addFiles(e.target.files);
									}}
								/>
								<div className="inline">
									<button
										id="button"
										onClick={() => {
											fileInputRef.current?.click();
										}}
										className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none mr-2"
									>
										Upload file(s)
									</button>
									<button
										id="button"
										onClick={() => {
											addRandomImg();
										}}
										className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
									>
										Add random test file
									</button>
								</div>
							</header>

							<h1 className="pt-8 pb-3 font-semibold sm:text-lg text-gray-900">
								To Be Annotated
							</h1>

							<ul
								id="gallery"
								ref={galleryRef}
								className="flex flex-1 flex-wrap -m-1"
							>
								{files.map((file, idx) => {
									return (
										<li
											className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24"
											id={URL.createObjectURL(file)}
											key={idx}
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
																let newFiles = files.splice(idx - 1, 1);
																setFiles(newFiles);
																if (newFiles.length < 1) setEmpty(true);
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
								{isEmpty && (
									<li
										id="empty"
										ref={emptyRef}
										className="h-full w-full text-center flex flex-col items-center justify-center items-center"
									>
										<img
											className="mx-auto w-32"
											src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
											alt="no data"
										/>
										<span className="text-small text-gray-500">
											No files selected
										</span>
									</li>
								)}
							</ul>
						</section>

						{/* <!-- sticky footer --> */}
						<footer className="flex justify-end px-8 pb-8 pt-4">
							<button
								id="submit"
								onClick={() => handleFileSubmit()}
								className=" px-3 py-1 rounded-md  bg-teal-500 hover:bg-teal-400 text-white focus:shadow-outline focus:outline-none"
							>
								Annotate Images
							</button>
							<button
								id="cancel"
								onClick={() => {
									setFiles([]);
									setEmpty(true);
								}}
								className="ml-3 rounded-md  px-3 py-1  hover:bg-gray-300 focus:shadow-outline focus:outline-none"
							>
								Cancel
							</button>
						</footer>
					</article>
				</main>
			</div>

			{/* <!-- using two similar templates for simplicity in js code --> */}
			<template id="file-template" ref={fileTemplRef}>
				<li className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24">
					<article
						tabIndex={0}
						className="group w-full h-full rounded-md focus:outline-none focus:shadow-outline elative bg-gray-100 cursor-pointer relative shadow-sm"
					>
						<img
							alt="upload preview"
							className="img-preview hidden w-full h-full sticky object-cover rounded-md bg-fixed"
						/>

						<section className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
							<h1 className="flex-1 group-hover:text-teal-800"></h1>
							<div className="flex">
								<span className="p-1 text-teal-800">
									<i>
										<svg
											className="fill-current w-4 h-4 ml-auto pt-1"
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
										>
											<path d="M15 2v5h5v15h-16v-20h11zm1-2h-14v24h20v-18l-6-6z" />
										</svg>
									</i>
								</span>
								<p className="p-1 size text-xs text-gray-700"></p>
								<button className="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md text-gray-800">
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
			</template>
		</>
	);
};
export default FileUploader;
