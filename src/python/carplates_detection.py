import cv2
import pytesseract
import random

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract'

image_files = ['src/python/captured_images/auto001.jpg', 'src/python/captured_images/auto003.png', 'src/python/captured_images/auto007.jpeg', 'src/python/captured_images/auto009.jpg'] 

random_image = random.choice(image_files)

placa = []
image = cv2.imread(random_image)
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
gray = cv2.blur(gray, (3, 3))
canny = cv2.Canny(gray, 150, 200)
canny = cv2.dilate(canny, None, iterations=1)

#cv2.imshow("normal",image)
#cv2.imshow("canny",canny)


cnts, _ = cv2.findContours(canny, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
for c in cnts:
    area = cv2.contourArea(c)
    x, y, w, h = cv2.boundingRect(c)
    epsilon = 0.01 * cv2.arcLength(c, True)
    approx = cv2.approxPolyDP(c, epsilon, True)

    # Calcular el tamaño relativo de la placa
    image_width = image.shape[1]
    image_height = image.shape[0]
    plate_width = w
    plate_height = h

    relative_width = plate_width / image_width
    relative_height = plate_height / image_height

    # Ajusta estos umbrales según tus necesidades
    max_relative_width = 0.3
    max_relative_height = 0.15

    if 0.01 < relative_width < max_relative_width and 0.01 < relative_height < max_relative_height or len(approx) == 4:
        #print("paso 1")
        cv2.drawContours(image, [c], 0, (0, 225, 0), 2)
        aspect_ratio = float(w) / h
        #print("aspect ratio: ",aspect_ratio)
        if aspect_ratio > 1                                                                                                         :
            #print("paso 2")
            placa = gray[y:y + h, x:x + w]
            text = pytesseract.image_to_string(placa, config='--psm 11')
            #print('text:', text)
            if len(text) >= 6:
                #print("paso 3")
                print(text)
                break

