import cv2
from ultralytics import YOLO
import numpy as np

# --- Configuration ---
model = YOLO('yolov8n.pt') 

INTERESTED_OBJECTS = [
    'chair', 'sofa', 'bed', 'tv', 'laptop', 
    'clock',  # Proxy for 'outlet'
    'potted plant', 'bottle', 'cup', 'book', 'backpack', 'handbag',
    'dining table', 'toilet', 'sink', 'refrigerator', 'oven', 'microwave', 'toaster',
]

# --- Video Processing ---
def main(video_input_path):
    print(f"Loading video: {video_input_path}")
    
    cap = cv2.VideoCapture(video_input_path)
    if not cap.isOpened():
        print(f"Error: Could not open video file {video_input_path}")
        return [] # Return an empty list on error

    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    object_detections = {}

    print("AI model loaded. Starting object detection...")
    frame_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break 

        frame_count += 1
        # Process every 5th frame to speed things up
        if frame_count % 5 != 0: 
            continue
        
        # Print progress, but less often
        if frame_count % 30 == 0:
            print(f"Processing frame {frame_count}...")
        
        results = model(frame, stream=True, verbose=False)

        for result in results:
            class_names = result.names
            for box in result.boxes:
                class_id = int(box.cls[0])
                class_name = class_names[class_id]
                
                if class_name in INTERESTED_OBJECTS:
                    x1, y1, x2, y2 = box.xyxy[0]
                    # Calculate center of the box
                    cx = (x1 + x2) / 2
                    cy = (y1 + y2) / 2
                    
                    # Store the center point
                    if class_name not in object_detections:
                        object_detections[class_name] = []
                    object_detections[class_name].append((cx, cy))

    cap.release()
    cv2.destroyAllWindows()
    print("\n--- ✅ Processing Complete ---")

    # --- Create the Final Blueprint Data ---
    blueprint_data = []
    
    # Rename 'clock' to 'outlet' for the frontend
    if 'clock' in object_detections:
        object_detections['outlet'] = object_detections.pop('clock')

    for object_name, coords_list in object_detections.items():
        # Calculate the average position for this object
        avg_x = np.mean([c[0] for c in coords_list])
        avg_y = np.mean([c[1] for c in coords_list])
        
        # Normalize coordinates (from 0.0 to 1.0)
        norm_x = avg_x / frame_width
        norm_y = avg_y / frame_height
        
        blueprint_data.append({
            'name': object_name,
            # --- THE FIX IS HERE ---
            # We must convert the NumPy float32 to a standard Python float
            'x': float(norm_x), 
            'y': float(norm_y)  
            # -----------------------
        })

    print(f"Sending blueprint data: {blueprint_data}")
    return blueprint_data # <-- THE MOST IMPORTANT CHANGE!

if __name__ == "__main__":
    # This part lets you still run 'python detect.py' to test it
    data = main('videos/ProjectVideo.mp4')
    print("Test run complete. Detected objects:")
    print(data)