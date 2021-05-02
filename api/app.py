# TO RUN: export FLASK_APP=app.py, flask run
import io
import numpy as np
import tensorflow.compat.v1 as tf
from object_detection.utils import visualization_utils as vis_util
from object_detection.utils import label_map_util
from object_detection.utils import ops as utils_ops
from flask import Flask, request, send_file
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from PIL import Image

LABELS_PATH = './assets/spines_label_map.pbtxt'
MODEL_PATH = './assets/frozen_inference_graph.pb'

app = Flask(__name__)
CORS(app)
api = Api(app)


class status(Resource):
    def get(self):
        try:
            return {'data': 'Api live'}
        except:
            return {'data': 'An error occurred when fetching Api'}


api.add_resource(status, '/')

print("App starting")

if __name__ == "__main__":
    app.run()


def get_num_classes():
    # return num of category indices
    from object_detection.utils import label_map_util
    label_map = label_map_util.load_labelmap(LABELS_PATH)
    cats = label_map_util.convert_label_map_to_categories(
        label_map, max_num_classes=90, use_display_name=True)
    cat_index = label_map_util.create_category_index(cats)
    return len(cat_index.keys())


def load_image_into_numpy_array(image):
    # turn img into numpy array
    (im_width, im_height) = image.size
    return np.array(image.getdata()).reshape(
        (im_height, im_width, 3)).astype(np.uint8)


def run_inference_for_single_image(image, graph):
    # fit model on img
    with graph.as_default():
        with tf.Session() as sess:
            # obtain handles for input/output tensors
            ops = tf.get_default_graph().get_operations()
            all_tensor_names = {
                output.name for op in ops for output in op.outputs}
            tensor_dict = {}
            for key in [
                'num_detections', 'detection_boxes', 'detection_scores',
                'detection_classes', 'detection_masks'
            ]:
                tensor_name = key + ':0'
                if tensor_name in all_tensor_names:
                    tensor_dict[key] = tf.get_default_graph().get_tensor_by_name(
                        tensor_name)
            if 'detection_masks' in tensor_dict:
                # For a single img, process it w/ model
                detection_boxes = tf.squeeze(
                    tensor_dict['detection_boxes'], [0])
                detection_masks = tf.squeeze(
                    tensor_dict['detection_masks'], [0])
                # reframe necessary to translate mask from box coordinates to img coordinates and fit img size
                real_num_detection = tf.cast(
                    tensor_dict['num_detections'][0], tf.int32)
                detection_boxes = tf.slice(detection_boxes, [0, 0], [
                                           real_num_detection, -1])
                detection_masks = tf.slice(detection_masks, [0, 0, 0], [
                                           real_num_detection, -1, -1])
                detection_masks_reframed = utils_ops.reframe_box_masks_to_image_masks(
                    detection_masks, detection_boxes, image.shape[0], image.shape[1])
                detection_masks_reframed = tf.cast(
                    tf.greater(detection_masks_reframed, 0.5), tf.uint8)
                # add back batch dimension
                tensor_dict['detection_masks'] = tf.expand_dims(
                    detection_masks_reframed, 0)
            image_tensor = tf.get_default_graph().get_tensor_by_name('image_tensor:0')
            # find spines in img
            output_dict = sess.run(tensor_dict,
                                   feed_dict={image_tensor: np.expand_dims(image, 0)})
            # outputs are float32 numpy arrays, convert types as necessary
            output_dict['num_detections'] = int(
                output_dict['num_detections'][0])
            output_dict['detection_classes'] = output_dict[
                'detection_classes'][0].astype(np.uint8)
            output_dict['detection_boxes'] = output_dict['detection_boxes'][0]
            output_dict['detection_scores'] = output_dict['detection_scores'][0]
            if 'detection_masks' in output_dict:
                output_dict['detection_masks'] = output_dict['detection_masks'][0]
    return output_dict


def serve_pil_image(pil_img, filename):
    # return img response
    img_io = io.BytesIO()
    pil_img.save(img_io, 'JPEG', quality=70)
    img_io.seek(0)
    return send_file(img_io, mimetype='image/jpeg', attachment_filename=filename)


# create detection graph & init vars
detection_graph = tf.Graph()
with detection_graph.as_default():
    od_graph_def = tf.GraphDef()
    with tf.gfile.GFile(MODEL_PATH, 'rb') as fid:
        serialized_graph = fid.read()
        od_graph_def.ParseFromString(serialized_graph)
        tf.import_graph_def(od_graph_def, name='')

num_classes = get_num_classes()
label_map = label_map_util.load_labelmap(LABELS_PATH)
categories = label_map_util.convert_label_map_to_categories(
    label_map, max_num_classes=num_classes, use_display_name=True)
category_index = label_map_util.create_category_index(categories)


@app.route('/annotate_spines', methods=['POST'])
# on POST request from React app, attempt to find spines
def fileUpload():
    try:
        file = request.files['file']
        print(file)
        image = Image.open(file)
        # array based representation of img will be used later in order to prepare result w/  boxes & labels
        image_np = load_image_into_numpy_array(image)
        # expand dims since the model expects images to have shape: [1, None, None, 3]
        image_np_expanded = np.expand_dims(image_np, axis=0)
        # find spines in img
        output_dict = run_inference_for_single_image(
            image_np, detection_graph)
        # annotate dendritic spines
        vis_util.visualize_boxes_and_labels_on_image_array(
            image_np,
            output_dict['detection_boxes'],
            output_dict['detection_classes'],
            output_dict['detection_scores'],
            category_index,
            instance_masks=output_dict.get('detection_masks'),
            use_normalized_coordinates=True,
            line_thickness=1,
            skip_scores=True,
            skip_labels=True,
        )
        # return img as response
        return serve_pil_image(Image.fromarray(image_np), str("annotated_" + file.filename))
    except Exception as e:
        print(e)
