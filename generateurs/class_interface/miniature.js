class Miniatures {
    constructor(f, x_left, y_top, x_right, y_bottom,  nb_rules = 3, map_image = null, rules = null, slider = null, min_value = 0, max_value = 255) {
        this.f = f; 
        this.x_left = x_left; // position de départ
        this.y_top = y_top; // position de départ
        this.x_right = x_right; // position de fin
        this.y_bottom = y_bottom; // position de fin
        this.min_value = min_value;
        this.max_value = max_value;

        this.rules = rules;
        this.map_image = map_image;
        this.nb_rules = nb_rules;
        this.slider = slider; // Référence au slider pour les lignes de connexion
        
        
        
        this.img = null;
        this.miniature_gris = null;
        this.miniatures_red =[];
    }

    


    make_miniature(img) { 
        this.miniature_gris = null;

        let rules = this.rules.get_all_rules()
        let number_of_images = rules.length;

        this.img = img; 
        this.miniatures = [];  
        let largeur = this.x_right - this.x_left;
        let width_miniature = this.f.int(largeur/number_of_images);
        this.img.resize(width_miniature, 0);
        this.miniature_gris = this.convertirEnGris(this.img);
    }   

    update_red() {
        let rules = this.rules.get_all_rules();
        let number_of_images = rules.length;

        this.miniatures_red = [];
        let seuils = this.map_image.get_seuils();
        for (let i = 0; i< number_of_images; i++){
            let miniature_red = this.make_seuil_on_miniature(this.miniature_gris, seuils[i], seuils[i+1]);
            this.miniatures_red.push(miniature_red);
        }
    }

    update_detail() {
        let rules = this.rules.get_all_rules();
        let number_of_images = rules.length;

        this.miniatures_red = [];
        let seuils = this.map_image.get_seuils();
        for (let i = 0; i< number_of_images; i++){
            let miniature_red = this.make_seuil_detail_on_miniature(this.miniature_gris, seuils[i], seuils[i+1]);
            this.miniatures_red.push(miniature_red);
        }
    }
    

    draw_miniature(){
        let seuils = this.map_image.get_seuils();
        
        for (let i = 0; i < this.miniatures_red.length; i++) {
            // Dessiner la miniature
            let x = this.f.map(i, 0, this.miniatures_red.length, this.x_left, this.x_right);
            let y = this.y_top;
            this.f.image(this.miniatures_red[i], x, y);
            
            // Si le slider est défini, dessiner une ligne verticale du bas de la miniature au slider
            if (this.slider) {
                // Calculer les positions des sliders correspondant aux seuils
                let sliderX1 = this.f.int(this.f.map(seuils[i], this.min_value, this.max_value, this.slider.x_start, this.slider.x_end));
                let sliderX2 = this.f.int(this.f.map(seuils[i+1], this.min_value, this.max_value, this.slider.x_start, this.slider.x_end));
                
                // Dessiner la ligne de connexion pour le seuil inférieur
                this.f.stroke(0); // Couleur noire
                this.f.strokeWeight(0.5); // Ligne fine
                
                // Coordonnées des points de connexion
                let miniatureBottomY = y + this.miniature_gris.height;
                
                // Dessiner la ligne depuis le bas gauche de la miniature jusqu'au slider
                this.f.line(x, miniatureBottomY, sliderX1, this.slider.y_start);
                
                // Dessiner la ligne depuis le bas droit de la miniature jusqu'au slider
                if (i === this.miniatures_red.length - 1) {
                    // Pour la dernière miniature, dessiner aussi la ligne droite
                    this.f.line(x + this.miniature_gris.width, miniatureBottomY, sliderX2, this.slider.y_start);
                }
            }
        }
    }





    make_seuil_on_miniature(image, minLum, maxLum) {
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

    make_seuil_detail_on_miniature(image, targetRuleIndexMin, targetRuleIndexMax) {
        let imgResultat = image.get();
        imgResultat.loadPixels();
        let w = imgResultat.width;
        let h = imgResultat.height;
    
        // Parcours par blocs de 2x2 pixels
        for (let y = 0; y < h - 3; y += 4) {
            for (let x = 0; x < w - 3; x += 4) {
                let values = [];
    
                // Collecte des 4 pixels
                for (let dy = 0; dy < 4; dy++) {
                    for (let dx = 0; dx < 4; dx++) {
                        let px = x + dx;
                        let py = y + dy;
                        let index = 4 * (py * w + px);
    
                        // On utilise la luminosité comme valeur
                        let r = imgResultat.pixels[index];
                        let g = imgResultat.pixels[index + 1];
                        let b = imgResultat.pixels[index + 2];
                        let value = (r + g + b) / 3;
                        values.push(value);
                    }
                }
    
                // Moyenne et écart-type
                let mean = values.reduce((a, b) => a + b, 0) / values.length;
                let variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
                let stdDev = Math.sqrt(variance);
    
                // Seuil
                if (stdDev >= targetRuleIndexMin && stdDev <= targetRuleIndexMax) {
                    for (let dy = 0; dy < 4; dy++) {
                        for (let dx = 0; dx < 4; dx++) {
                            let px = x + dx;
                            let py = y + dy;
                            let index = 4 * (py * w + px);
                            imgResultat.pixels[index] = 255;     // Rouge
                            imgResultat.pixels[index + 1] = 0;   // Vert
                            imgResultat.pixels[index + 2] = 0;   // Bleu
                        }
                    }
                }
            }
        }
    
        imgResultat.updatePixels();
        return imgResultat;
    }
    


    convertirEnGris(image) {
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
}