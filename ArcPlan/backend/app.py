import os
from flask import Flask, request, jsonify
from detect import main as run_yolo_detection 

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

@app.route('/upload', methods=['POST'])
def upload_video():
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        
        print(f"File saved successfully: {filepath}")
        
        # --- RUN YOLO AND GET DATA BACK ---
        print(f"Starting YOLO processing on {filepath}...")
        try:
            # 1. CATCH THE RETURNED DATA
            blueprint_data = run_yolo_detection(filepath) 
            print("YOLO processing finished.")
        except Exception as e:
            print(f"Error during YOLO processing: {e}")
            return jsonify({'error': 'Failed during video processing'}), 500
        # --------------------------------
        
        # 2. SEND THE BLUEPRINT DATA TO REACT
        return jsonify({
            'message': 'File processed successfully',
            'blueprint': blueprint_data  # <-- HERE IS THE DATA
        }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)