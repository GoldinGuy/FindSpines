import JSZip from "jszip";
import { saveAs } from "file-saver";

export function boldQuery(str: string, query: string) {
	const cleanStr = str.replaceAll(".", ". ").replaceAll("  ", " ");

	const n = cleanStr.toUpperCase();
	const q = query.toUpperCase();
	const x = n.indexOf(q);
	if (!q || x === -1) {
		return cleanStr;
	}
	const l = q.length;
	return [
		cleanStr.substr(0, x),
		<b>{cleanStr.substr(x, l)}</b>,
		cleanStr.substr(x + l)
	];
}

export function downloadAllFiles(imgFiles: File[]) {
	var zip = new JSZip();
	zip.file(
		"README.txt",
		"Unzip this folder to access annotated images of dendritic spines\n"
	);
	var img = zip.folder("dendrite_spines");
	for (let file of imgFiles) {
		img?.file(`${file.name}.jpg`, file.arrayBuffer(), { base64: true });
	}
	zip.generateAsync({ type: "blob" }).then(content => {
		saveAs(content, "dendrite_spines.zip");
	});
}
