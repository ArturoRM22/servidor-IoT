import os

def eliminar_imagen(ruta_carpeta, nombre_imagen):
    ruta_imagen = os.path.join(ruta_carpeta, nombre_imagen)
    try:
        os.remove(ruta_imagen)
        print(f"La imagen {nombre_imagen} ha sido eliminada correctamente.")
    except FileNotFoundError:
        print(f"La imagen {nombre_imagen} no fue encontrada en la carpeta.")
    except Exception as e:
        print(f"Error al eliminar la imagen {nombre_imagen}: {e}")

# Ejemplo de uso
ruta_carpeta = "src\python\captured_images"  # Reemplaza con la ruta de tu carpeta
nombre_imagen = "captured_image0.png"  # Reemplaza con el nombre de tu imagen

eliminar_imagen(ruta_carpeta, nombre_imagen)
