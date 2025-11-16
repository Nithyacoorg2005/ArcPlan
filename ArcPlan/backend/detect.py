import cv2
from ultralytics import YOLO

# --- Configuration ---
# 1. Load a pre-trained YOLO model (we're using 'yolov8n.pt' - 'n' is for 'nano')
model = YOLO('yolov8n.pt') 

# 2. Define the video files
# VIDEO_INPUT_PATH is removed. It will be passed into main()
VIDEO_OUTPUT_PATH = 'output_with_boxes.mp4' # The file we will create

# 3. What objects are we interested in?
INTERESTED_OBJECTS = [
    'chair', 
    'sofa', 
    'bed', 
    'tv', 
    'laptop', 
    'clock',  # This is our proxy for 'outlet'
    'potted plant',
    'bottle',
    'cup',
    'book',
    'backpack',
    'handbag',
    'dining table',
    'toilet',
    'sink',
    'refrigerator',
    'oven',
    'microwave',
    'toaster',
    # Note: 'kitchen sink', 'stove', 'faucet' are not in the default 80 classes.
    # 'sink' is the correct class name. 'oven' is also correct.
]

# --- Video Processing ---
def main(video_input_path): # <-- IT NOW ACCEPTS AN ARGUMENT
    print(f"Loading video: {video_input_path}")
    
    # 1. Open the video file
    cap = cv2.VideoCapture(video_input_path) # <-- USES THE ARGUMENT
    if not cap.isOpened():
        print(f"Error: Could not open video file {video_input_path}")
        return # We change this to 'return' instead of 'exit'

    # 2. Get video properties (width, height, fps)
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    
    # 3. Create a video writer object to save the new video
    fourcc = cv2.VideoWriter_fourcc(*'mp4v') # Codec for .mp4
    out = cv2.VideoWriter(VIDEO_OUTPUT_PATH, fourcc, fps, (frame_width, frame_height))
    
    print("AI model loaded. Starting object detection...")
    print(f"This may take a few minutes depending on your video length.")
    print(f"Saving results to: {VIDEO_OUTPUT_PATH}")

    frame_count = 0
    while cap.isOpened():
        # 4. Read one frame from the video
        ret, frame = cap.read()
        if not ret:
            break # We've reached the end of the video

        frame_count += 1
        # Process every frame
        if frame_count % 30 == 0: # Print a message every 30 frames (about 1 second)
            print(f"Processing frame {frame_count}...")
        
        # 5. Run the AI model on the frame
        results = model(frame, stream=True, verbose=False) # verbose=False cleans up the output

        for result in results:
            # 6. Get the names of the classes
            class_names = result.names
            
            # 7. Loop through all detected boxes
            for box in result.boxes:
                # Get the class ID (e.g., 0 for 'person')
                class_id = int(box.cls[0])
                class_name = class_names[class_id]
                
                # 8. Check if this is an object we care about
                if class_name in INTERESTED_OBJECTS:
                    # Get box coordinates
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    
                    # Get confidence score
                    confidence = float(box.conf[0])
                    
                    # Draw the box
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    
                    # Draw the label
                    label = f"{class_name}: {confidence:.2f}"
                    cv2.putText(frame, label, (x1, y1 - 10), 
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        # 9. Write the processed frame to our output video
        out.write(frame)

    # 10. Clean up
    cap.release()
    out.release()
    cv2.destroyAllWindows()
    print("\n--- ✅ Processing Complete ---")
    print(f"Video saved successfully to {VIDEO_OUTPUT_PATH}")

if __name__ == "__main__":
    # This part lets you still run 'python detect.py' to test it
    # It will use a default video.
    main('videos/ProjectVideo.mp4')