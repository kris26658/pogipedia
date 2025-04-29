from gimpfu import *

def resize_all_images(image, drawable):
    for img in gimp.image_list():
        width, height = img.width, img.height
        new_width = int(width * 0.25)
        new_height = int(height * 0.25)
        print("Resizing image ID {} from {}x{} to {}x{}".format(img.ID, width, height, new_width, new_height))
        pdb.gimp_image_scale(img, new_width, new_height)
        gimp.displays_flush()

register(
    "python_fu_resize_all_images",
    "Resize All Opened Images to 25%",
    "Resizes all opened images to 25% of their original size.",
    "Your Name",
    "Your Name",
    "2025",
    "<Image>/Image/Resize All Images to 25%",
    "*",
    [],
    [],
    resize_all_images
)

main()