;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; This program is free software; you
; can redistribute it and/or modify
; it under the terms of the GNU
; General Public License as published
; by the Free Software Foundation;
; either version 2 of the License, or
; (at your option) any later version.
; This program is distributed in the
; hope that it will be useful,
; but WITHOUT ANY WARRANTY;
; without even the implied warranty of
; MERCHANTABILITY or FITNESS
; FOR A PARTICULAR PURPOSE.
; See the GNU General Public License
;  for more details
; added section for webp - rich 2023/08/06
;;;;;;;;;;;;;;;;;;;;;;;;;; PixLab 2023/08/10 & 2023/12/06 ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; changed numbers of numbering to higger numbering  line 50 (substring "00000" (string-length and line 142 (list 0 0 9000 1 100 0 SF-SPINNER) 
; changed menu entry line 94 "<Image>/File/Save ALL As" added line 143 (script-fu-menu-register "script-fu-save-all-images" "<Image>/File/E_xport")
; 2023/12/06 changed (car (gimp-image-get-active-layer image)) to (car (gimp-layer-new-from-visible image image "export")) line 59 & now 120, changed the default directory to Desktop
; 2023/12/06 Added JPG and PNG to be customizable, changed file-webp-save to file-webp-save2 latest version + settings, commented all settings by image type (thanks to the procedure browser)

(define (script-fu-save-all-images inDir inSaveType
inFileName inFileNumber)
  (let* (
          (i (car (gimp-image-list)))
          (ii (car (gimp-image-list)))
          (image)
          (newFileName "")
          (saveString "")
          (pathchar (if (equal?
                 (substring gimp-dir 0 1) "/") "/" "\\"))
        )
    (set! saveString
      (cond
        (( equal? inSaveType 0 ) ".webp" )
        (( equal? inSaveType 1 ) ".jpg" )
        (( equal? inSaveType 2 ) ".png" )
        (( equal? inSaveType 3 ) ".tif" )
        (( equal? inSaveType 4 ) ".bmp" )
      )
    )


    (while (> i 0)
      (set! image (vector-ref (cadr (gimp-image-list)) (- i 1)))
      (set! newFileName (string-append inDir
              pathchar inFileName
              (substring "0000000" (string-length
              (number->string (+ inFileNumber i))))
              (number->string (+ inFileNumber i)) saveString))

      (cond
        ((equal? saveString ".webp")

           (file-webp-save2 RUN-NONINTERACTIVE
                      image
                      (car (gimp-layer-new-from-visible image image "export"))
                      newFileName
                      newFileName
                      1    ; preset 0=default 1=pic 2=photo 3=drawing 4=icon 5=text
                      0    ; Use lossless encoding (0/1)
                      90   ; Quality of the image (0 <= quality <= 100)
                      90   ; alpha-quality  0<>100
                      0    ; Use layers for animation (0/1)
                      0    ; Loop animation infinitely (0/1)
                      0    ; Minimize animation size (0/1)
                      0    ; Maximum distance between key-frames (>=0)
                      0    ; Toggle saving exif data (0/1)
                      0    ; Toggle saving iptc data (0/1) works only if save XMP data is also checked ?
                      0    ; Toggle saving xmp data (0/1)
                      0    ; Toggle saving thumbnail (0/1)
                      0    ; Delay to use when timestamps are not available or forced
                      0    ; Force delay on all frames (0/1)

          ))
      
         ((equal? saveString ".jpg")
           
            (file-jpeg-save RUN-NONINTERACTIVE
                      image
                      (car (gimp-layer-new-from-visible image image "export"))
                      newFileName
                      newFileName
                      0.88 ;  Float Quality of saved image (0 => quality <= 1)
                      0    ;  Float Smoothing factor for saved image (0 => smoothing <= 1)
                      1    ;  Use optimized tables during Huffman coding (0/1)
                      1    ;  Create progressive JPEG images (0/1)
                      ""   ;  String Image comment (if you want to put "Image made by me!")
                      2    ;  Sub-sampling type { 0, 1, 2, 3 } 0 == 4:2:0 (chroma quartered), 1 == 4:2:2 Horizontal (chroma halved), 2 == 4:4:4 (best quality), 3 == 4:2:2 Vertical (chroma halved)
                      1    ;  Force creation of a baseline JPEG (non-baseline JPEGs can't be read by all decoders) (0/1)
                      0    ;  Interval of restart markers (in MCU rows, 0 = no restart markers)
                      2    ;  DCT method to use { INTEGER (0), FIXED (1), FLOAT (2) }
          ))
          
        ((equal? saveString ".png")

           (file-png-save2 RUN-NONINTERACTIVE
                      image
                      (car (gimp-layer-new-from-visible image image "export"))
                      newFileName
                      newFileName
                      1    ; Use Adam7 interlacing? (0/1)
                      9    ; Deflate Compression factor (0--9)
                      1    ; Write bKGD chunk? (0/1)
                      0    ; Write gAMA chunk? (0/1)
                      0    ; Write oFFs chunk? (0/1)
                      0    ; Write pHYs chunk? (0/1)
                      1    ; Write tIME chunk? (0/1)
                      0    ; Write comment?
                      0    ; Preserve color of transparent pixels? (0/1)

          ))
          
        ((equal? saveString ".tif")

           (file-tiff-save RUN-NONINTERACTIVE
                      image
                      (car (gimp-layer-new-from-visible image image "export"))
                      newFileName
                      newFileName
                      3    ; Compression type: { NONE (0), LZW (1), PACKBITS (2), DEFLATE (3), JPEG (4), CCITT G3 Fax (5), CCITT G4 Fax (6) }

          ))

        (else

          (gimp-file-save RUN-NONINTERACTIVE
                      image
                      (car (gimp-layer-new-from-visible image image "export"))
                      newFileName
                      newFileName
          ))
      )

      (gimp-image-clean-all image)
      (set! i (- i 1))


 )))

(script-fu-register "script-fu-save-all-images"
 "Export All Images As..."
 "Save all opened images as webp, jpg, png, tif or bmp\n\nIf multiple layers it export from a new from visible"
 "Lauchlin Wilkinson (& Saul Goode)"
 "Lauchlin Wilkinson (& Saul Goode)"
 "2014/04/21"
 ""
 SF-DIRNAME    "Save Directory" "Desktop"
 SF-OPTION     "Save File Type" (list "WebP" "JPG" "PNG" "TIFF" "BMP")
 SF-STRING     "Save File Base Name" "IMAGE-"
 SF-ADJUSTMENT "Save File Start Number"
      (list 0 0 999999 1 100 0 SF-SPINNER)
 )
 (script-fu-menu-register "script-fu-save-all-images" "<Image>/File/E_xport")
