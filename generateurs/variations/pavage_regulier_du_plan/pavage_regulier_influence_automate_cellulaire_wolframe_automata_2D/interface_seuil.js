


function init_interface_seuil() {
    let seuil_vertical = function(v) {
        let seuils = [];
        let selected_slider = -1;
        let direction = [];

        let x_start, y_start, x_end, y_end;

        let width, height;


        v.setup = function() {
            let container = document.getElementById("seuil-vertical");
            let a = container.offsetWidth;
            let c = container.offsetHeight;

            let cnv = v.createCanvas(a, c);
            cnv.parent(container);
            v.background(240);

            width = v.width;
            height = v.height;
            direction = [1,0, 1,1];

            x_start = direction[0] * width;
            y_start = direction[1] * height;
            x_end = direction[2] * width;
            y_end = direction[3] * height;

            update_sliders(v, map_image_vertical,  width, height, direction);
        };

        v.mousePressed = function() {
            seuils = map_image_vertical.get_seuils();
            for (let i = 1; i < seuils.length - 1; i++) {
                let y = v.map(seuils[seuils.length - 1 - i], 255, 0, y_start, y_end);
                let x = v.map(seuils[seuils.length - 1 - i], 255, 0, x_start, x_end);
                if (
                    v.mouseY >= y - 5 &&
                    v.mouseY <= y + 5 &&
                    v.mouseX >= x - 5 &&
                    v.mouseX <= x + 5
                ) {
                    selected_slider = [seuils.length - 1 - i];
                    break;
                }
            }
        };

        v.mouseDragged = function() {
            if (selected_slider !== -1) {
                let y_clamped = v.constrain(v.mouseY, y_start, y_end);
                let value = v.map(y_clamped, y_start, y_end, 255, 0);
                value = v.int(value);
                map_image_vertical.change_one_seuil(selected_slider, value);
            }

            v.background(240);
          
            update_sliders(v, map_image_vertical,  width, height, direction);
            if (img_miniature_vertical) {
                update_image_seuil(v, map_image_vertical, img_miniature_vertical, width, height, direction);
                update_lignes(v, map_image_vertical, img_miniature_vertical,  width, height, direction);
            }
            
            
        }
        
        v.mouseReleased = function() {
            selected_slider = -1;

            
            v.background(240);
            update_sliders(v, map_image_vertical,  width, height, direction);
            if (img_miniature_vertical) {
                update_image_seuil(v, map_image_vertical, img_miniature_vertical, width, height, direction);
                update_lignes(v, map_image_vertical, img_miniature_vertical,  width, height, direction);
            }
            
            
        };

        
    }
    new p5(seuil_vertical);

    let seuil_horizontal= function(v) {
        let seuils = [];
        let selected_slider = -1;
        let direction = [];

        let x_start, y_start, x_end, y_end;

        let width, height;


        v.setup = function() {
            let container = document.getElementById("seuil-horizontal");
            let a = container.offsetWidth;
            let c = container.offsetHeight;

            let cnv = v.createCanvas(a, c);
            cnv.parent(container);
            v.background(240);

            width = v.width;
            height = v.height;
            direction = [0,1, 1,1];

            x_start = direction[0] * width;
            y_start = direction[1] * height;
            x_end = direction[2] * width;
            y_end = direction[3] * height;

            update_sliders(v, map_image_horizontal,  width, height, direction);
        };

        v.mousePressed = function() {
            seuils = map_image_horizontal.get_seuils();
            for (let i = 1; i < seuils.length - 1; i++) {
                let y = v.map(seuils[seuils.length - 1 - i], 255, 0, y_start, y_end);
                let x = v.map(seuils[seuils.length - 1 - i], 255, 0, x_start, x_end);
                if (
                    v.mouseX >= x - 5 &&
                    v.mouseX <= x + 5 &&
                    v.mouseY >= y - 5 &&
                    v.mouseY <= y + 5
                ) {
                    selected_slider = [seuils.length - 1 - i];
                    break;
                }
            }
        };

        v.mouseDragged = function() {
            if (selected_slider !== -1) {
                let x_clamped = v.constrain(v.mouseX, x_start, x_end);
                let value = v.map(x_clamped, x_start, x_end, 255, 0);
                value = v.int(value);
                map_image_horizontal.change_one_seuil(selected_slider, value);
            }

            v.background(240);
          
            update_sliders(v, map_image_horizontal,  width, height, direction);
            if (img_miniature_horizontal) {
                update_image_seuil(v, map_image_horizontal, img_miniature_horizontal, width, height, direction);
                update_lignes(v, map_image_horizontal, img_miniature_horizontal,  width, height, direction);
            }
            
            
        }
        
        v.mouseReleased = function() {
            selected_slider = -1;

            
            v.background(240);
            update_sliders(v, map_image_horizontal,  width, height, direction);
            if (img_miniature_horizontal) {
                update_image_seuil(v, map_image_horizontal, img_miniature_horizontal, width, height, direction);
                update_lignes(v, map_image_horizontal, img_miniature_horizontal,  width, height, direction);
            }
            
        };

        
    }
    new p5(seuil_horizontal);
};









function update_sliders(f, objet_map,  width, height, direction) {
    let slider_size = 10;
    let seuils = objet_map.get_seuils(); // mise à jour dynamique
    f.fill(100);

    x_start = direction[0] * width;
    y_start = direction[1] * height;
    x_end = direction[2] * width;
    y_end = direction[3] * height;

    f.line(x_start, y_start, x_end, y_end);

    for (let i = 1; i < seuils.length - 1; i++) {
        let y = f.map(seuils[seuils.length-1-i], 255, 0, y_start, y_end);
        let x = f.map(seuils[seuils.length-1-i], 255, 0, x_start, x_end);
        f.rect(x - slider_size / 2, y - slider_size / 2, slider_size, slider_size);
    }
}

function update_image_seuil(f, objet_map, img, width, height, direction) {

    // on decla ela ligne 
    x_start = (1-direction[2]) * width;
    y_start = (1- direction[3] )* height;
    x_end = (1- direction[0]) * width;
    y_end = (1- direction[1]) * height;




    for (let i = 0; i< 9; i++){
        let minLum = objet_map.get_seuils()[8-i];
        let maxLum = objet_map.get_seuils()[9-i];
        let miniature_seuil = make_seuil_on_miniature(img, minLum, maxLum);

        let x = (x_end-x_start)/9 * i;
        let y = (y_end-y_start)/9 * i;


        f.image(miniature_seuil, x, y);
    }
}


function update_lignes(f, objet_map, img, width, height, direction) {
    let seuils = objet_map.get_seuils();
 
    x_start = direction[0] * width;
    y_start = direction[1] * height;
    x_end = direction[2] * width;
    y_end = direction[3] * height;

    let y_add = (img.height * ((direction[0] - direction[2])*(direction[0] - direction[2])))
    let x_add = (img.width * ((direction[3] - direction[1])*(direction[3] - direction[1])))

    




    
    for (let i = 1; i < seuils.length - 1; i++) {
        let y = f.map(seuils[seuils.length-1-i], 255, 0, y_start, y_end);
        let x = f.map(seuils[seuils.length-1-i], 255, 0, x_start, x_end);



        let x2 = ((x_end-x_start)/9 * i) + x_add;
        let y2 = ((y_end-y_start)/9 * i) + y_add;



        console.log('y:', y, 'x:', x, 'y2:', y2, 'x2:', x2);

        f.line(x, y, x2, y2);



       
     }
}





// fonction pour afficher les seuil sur les miniatures
function make_seuil_on_miniature(image, minLum, maxLum) {

    let imgResultat = image.get();
    imgResultat.loadPixels();

    for (let y = 0; y < imgResultat.height; y++) {
        for (let x = 0; x < imgResultat.width; x++) {
        let index = 4 * (y * imgResultat.width + x);
        let r = imgResultat.pixels[index];
        let g = imgResultat.pixels[index + 1];
        let b = imgResultat.pixels[index + 2];
        
        let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        
        if (luminance >= minLum && luminance <= maxLum) {
            imgResultat.pixels[index] = 255;
            imgResultat.pixels[index + 1] = 0;
            imgResultat.pixels[index + 2] = 0;
        }
        }
    }

    imgResultat.updatePixels();
    return imgResultat;
}


// fonction pour crer les miniatures
function make_miniatures( ){
    let hauteurSeuilVertical = document.getElementById("seuil-vertical").offsetHeight;
    let largeurSeuilHorizontal = document.getElementById("seuil-horizontal").offsetWidth;


    img_miniature_vertical = img.get();
    img_miniature_horizontal = img.get();

    let largeur_miniature_vertical = (hauteurSeuilVertical/ 9) * (img.width / img.height);
    let hauteur_miniature_horizotal = (largeurSeuilHorizontal/ 9) * (img.height/img.width);

    img_miniature_vertical.resize(largeur_miniature_vertical, 0);
    let img_miniature_vertical_gris = convertirEnGris(img_miniature_vertical);
    img_miniature_vertical = img_miniature_vertical_gris;
    

    img_miniature_horizontal.resize(0, hauteur_miniature_horizotal); 
    let img_miniature_horizontal_gris = convertirEnGris (img_miniature_horizontal);
    img_miniature_horizontal = img_miniature_horizontal_gris;

    console.log('img_miniature_vertical:', img_miniature_vertical);
    console.log('img_miniature_horizontal:', img_miniature_horizontal);
}

//  fonction pour convertir l'image en gris
function convertirEnGris(image) {
let imgGris = image.get(); 
imgGris.loadPixels();

for (let i = 0; i < imgGris.pixels.length; i += 4) {
    let r = imgGris.pixels[i];
    let g = imgGris.pixels[i + 1];
    let b = imgGris.pixels[i + 2];

    let gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    imgGris.pixels[i] = gray;
    imgGris.pixels[i + 1] = gray;
    imgGris.pixels[i + 2] = gray;
}

imgGris.updatePixels();
return imgGris;
}