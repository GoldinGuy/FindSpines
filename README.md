# Dendrite Spine Identification System

Automating annotating dendritic spines in images using Faster Recurrent Convolutional Neural Networks (Faster RCNNs) & TensorFlow Object Detection. This repo contains the final project for _PSB 4916-001: Honors Directed Ind Research_.

![image](https://user-images.githubusercontent.com/47064842/114794952-82faee80-9d5b-11eb-9221-2cac37f014a0.png)

## How It Works

The FindSpines Dendrite Spine Identification System uses Faster RCNNs to annotate images. More info coming soon... (whenever I get a chance to write more here)

![image](https://user-images.githubusercontent.com/47064842/116799861-03df1780-aaca-11eb-98df-ac11c2dbdf30.png)

<!-- ### Data Collection

This project uses 10000 books from [GoodBooks10k](https://github.com/zygmuntz/goodbooks-10k) and [Amazon](https://nijianmo.github.io/amazon/index.html), as well as a combined 14 million ratings. The data was downloaded and then cleaned in the `preprocessing` stage. Each of the following notebooks contain much slightly altered code from several of the sources in the `citations` section.

### Preprocessing

Preprocessing can be viewed in the [Preprocessing Jupyter Notebook](). In this file, GoodReads & Amazon data was imported, cleaned, and pickled. This includes cleaning html and removeing undesired characters in metadata, generating mappings of book titles and ids, comparing and merging the datasets, saving a cleaned dataframe to a pickle file, and fixing broken links.

### Networking

Networking can be viewed in the [Networking Jupyter Notebook](). In this file, two matrixes were generated: an [SVD](https://en.wikipedia.org/wiki/Singular_value_decomposition) collaborative-filtering ratings-based matrix, and a content-based feature matrix. These matrixes were then trained & fitted on the book data processed in the previous step and combined into a single dual hybrid system. The models were saved for use by the API.

### Recommendations

Sample recommendations can be viewed in the [Recommendations Jupyter Notebook](). In this file is a sample recommendations function using the model created in the previous step that generates recommendations for an input book.

```py
def make_book_recs(book_title, books, indices, weights, similarities):
```

The function accepts a book, the books dataframe pickled in the preprocessing step, a mapping of book_titles and book_ids, and the model from the networking stage after being entered into a cosine function to determine the similarity rankings between books. This function is taken directly from the `Books2Rec` project, because (as I also mention in the citations section), it's awesome and I used much of it as essentially a tutorial for ReadMe. -->

### Web App

The front-end for this project was built with [React](https://reactjs.org/) and [Typescript](https://www.typescriptlang.org/). The interface was created using [TailwindCSS](https://tailwindcss.com/). The user simply inputs any images via a drag & drop panel or by clicking on an input button, and then clicks _Annotate Spines_. This makes a **POST** request to the FindSpines api in the following format:

```ts
const data = new FormData();
data.append("file", FILE_TO_ANNOTATE);
fetch("https://API_URL/annotate_spines", {
	method: "POST",
	body: data
}).then(response => console.log(response));
```

The user is then displayed a page of the returned images with annotations. They may download them individually or as a zipped file if so desired.

![image](https://user-images.githubusercontent.com/47064842/116799890-4dc7fd80-aaca-11eb-8b3d-b2c8626ac6d5.png)

### API

The API for this application is built with [Flask](https://flask.palletsprojects.com/en/1.1.x/) and hosted on [Heroku](https://www.heroku.com/).

It accepts `POST` requests in the format discussed above, converts the attached image to a numpy array and then makes use of Tensorflow Object Detection, a `spines_label_map`, and a `frozen_inference_graph` to make annotations.

The API returns a response in the following format:

```json
{
	"author": "Kristin Hannah",
	"description": "Despite their differences, sisters Vianne and Isabelle have always been close. Younger, bolder Isabelle lives in Paris while Vianne is content with life in the French countryside with her husband Antoine and their daughter. But when the Second World War strikes, Antoine is sent off to fight and Vianne finds herself isolated so Isabelle is sent by their father to help her. As the war progresses, the sisters' relationship and strength are tested. With life changing in unbelievably horrific ways, Vianne and Isabelle will find themselves facing frightening situations and responding in ways they never thought possible as bravery and resistance take different forms in each of their actions.",
	"image_url": "https://images.gr-assets.com/books/1451446316m/21853621.jpg",
	"popular_shelves": " historical-fiction",
	"tags": " historical-fiction",
	"title": "The Nightingale",
	"url": "https://www.goodreads.com/book/show/21853621-the-nightingale"
}
```

## Development setup

### Client

Simply clone the repository, then run

```
npm install
```

Then to test the app, enter the `client` directory and run

```
npm start
```

### API

To build the Flask app, navigate to the `api` directory and run the following commands:

```
    export FLASK_APP=app.py
    flask run
```

This will start the server running on `localhost:5000`

## Contributing

1. Fork FindSpines [here](https://github.com/GoldinGuy/FindSpines/fork)
2. Create a feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

## References & Citations

This work is heavily based on the following projects. Credit and gratitude to all who worked on the below:

- [Deep Learning For Dendritic Spines Detection](https://github.com/ily-R/Deep-Learning-for-Dendritic-Spines-Detection/blob/master/report.pdf)
- [Faster R-CNN: Towards Real-Time Object Detection with Region Proposal Networks](https://arxiv.org/abs/1506.01497)
- [Automated dendritic spine detection using convolutional neural networks on maximum intensity projected microscopic volumes](https://web.stanford.edu/group/rubinlab/pubs/Xiao-2018-Automated.pdf)
- [Object Detection Demo](https://github.com/Tony607/object_detection_demo)
- [Google Object Detection Tutorial](https://github.com/tensorflow/models/blob/master/research/object_detection/colab_tutorials/object_detection_tutorial.ipynb)
- [Tensorflow Object Detection Tutorial](https://awesomeopensource.com/project/pythonlessons/TensorFlow-object-detection-tutorial)
- [@datitran's Object Detection Project](https://github.com/datitran/object_detector_app/blob/master/object_detection_app.py)
- [Image Object Detection Using Tensorflow-trained Classifier](https://github.com/EdjeElectronics/TensorFlow-Object-Detection-API-Tutorial-Train-Multiple-Objects-Windows-10/blob/master/Object_detection_image.py)
- [Zero to Hero: Guide to Object Detection using Deep Learning: Faster R-CNN,YOLO,SSD](https://cv-tricks.com/object-detection/faster-r-cnn-yolo-ssd/)
- [Dendritic Spine Analysis Dataset](https://github.com/mughanibu/Dendritic-Spine-Analysis-Dataset)

## Meta

This project was developed by [@GoldinGuy](https://github.com/GoldinGuy)

Distributed under the GNU AGPLv3 license. See [LICENSE](https://github.com/GoldinGuy/FindSpines/blob/master/LICENSE) for more information.

To test the project, simply run this [notebook](https://github.com/GoldinGuy/SpineObjectDetection/blob/master/dendrite_indentification.ipynb)
