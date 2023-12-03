import cv2
import os

def check_available_cameras():
    num_cameras = 10

    for i in range(num_cameras):
        cap = cv2.VideoCapture(i)
        try:
            if not cap.read()[0]:
                break
        except cv2.error as e:
            print(f"Error accessing camera index {i}: {e}")
            continue
        cap.release()
        print(f"Camera index {i} is available")

def capture_image():
    # Access the webcam (change the index if you have multiple webcams)
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Cannot open webcam")
        return

    ret, frame = cap.read()
    
    # Save image 
    folder_name = 'src\python\captured_images'
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)


    image_name = f"captured_image0.png"


    image_path = os.path.join(folder_name, image_name)
    cv2.imwrite(image_path, frame)
    print(f"Image saved: {image_path}")

    cap.release()
    cv2.destroyAllWindows()



#check_available_cameras()  # Uncomment this line to check available cameras

capture_image()

