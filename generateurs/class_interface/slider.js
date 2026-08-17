class SliderBar {
    constructor(f, x_start, y_start, x_end, y_end, map_image = null, min_value = 0, max_value = 255) {
        this.f = f; 
        this.x_start = x_start; // position de départ
        this.y_start = y_start; // position de départ
        this.x_end = x_end; // position de fin
        this.y_end = y_end; // position de fin
        this.min_value = min_value;
        this.max_value = max_value;
        this.map_image = map_image;
        this.value = 0;

        this.positions = [];
    }

    
    make_bar() {
        this.f.stroke(0);
        this.f.strokeWeight(1);
        this.f.line(this.x_start, this.y_start, this.x_end, this.y_start); 

    }

    update_sliders() {
        this.positions = [];
        let seuils = this.map_image.get_seuils();
        for (let i =0; i < seuils.length; i++){
            
            let x = this.f.int(this.f.map(seuils[i], this.min_value, this.max_value, this.x_start, this.x_end));
            let y = this.f.int(this.f.map(seuils[i], this.min_value, this.max_value, this.y_start, this.y_end));
            this.f.strokeWeight(2);
            this.f.stroke(0);
            this.f.fill(255); // Ne pas remplir le carré
            // this.f.rect(x - 4, y - 4, 8, 8); // Dessiner un carré vide de 8x8 centré sur (x, y)
            this.f.line(x - 4, y - 4, x + 4, y + 4); // Ligne diagonale de la croix (haut-gauche à bas-droite)
            this.f.line(x + 4, y - 4, x - 4, y + 4); // Ligne diagonale de la croix (haut-droite à bas-gauche)
            
            // Ajouter le texte du seuil
            this.f.push(); // Sauvegarder l'état actuel des styles et transformations

            this.f.textSize(12);
            let text_content = String(seuils[i]);
            let text_width = this.f.textWidth(text_content);
            let text_height = this.f.textAscent() + this.f.textDescent();

            let padding = 2.5;
            // Dimensions de la boîte de texte si le texte était horizontal
            let box_width_unrotated = text_width + padding * 3.5;
            let box_height_unrotated = text_height + padding * 1;

            let space_from_cross_edge = 5;

            // Calculer la position du centre de la boîte de texte pivotée.
            // Le bord droit de la boîte pivotée doit être à gauche de la croix.
            // La largeur de la boîte pivotée est l'ancienne hauteur (box_height_unrotated).
            let rotated_box_right_x = (x - 4) - space_from_cross_edge;
            let rotated_box_center_x = rotated_box_right_x - (box_height_unrotated / 2);
            let rotated_box_center_y = y; // Centré verticalement avec la croix

            this.f.push(); // Sauvegarder l'état actuel des styles et transformations

            // Déplacer l'origine au centre de la boîte de texte pivotée
            this.f.translate(rotated_box_center_x, rotated_box_center_y);
            // Pivoter de 90 degrés dans le sens anti-horaire (le texte se lira de bas en haut)
            this.f.rotate(-this.f.HALF_PI);

            // Définir le mode de dessin des rectangles sur CENTER pour dessiner à partir du centre
            this.f.rectMode(this.f.CENTER);

            // Dessiner le fond gris du cadre
            this.f.noStroke();
            this.f.fill(200);
            this.f.rect(27, 18, box_width_unrotated, box_height_unrotated);

            // Dessiner le cadre noir
            this.f.stroke(0);
            this.f.strokeWeight(1);
            this.f.noFill();
            this.f.rect(27, 18, box_width_unrotated, box_height_unrotated);

            // Dessiner le texte
            this.f.fill(0);
            this.f.noStroke();
            this.f.textAlign(this.f.CENTER, this.f.CENTER);
            this.f.text(text_content, 27, 18);

            // Restaurer le mode de dessin des rectangles par défaut (CORNER)
            this.f.rectMode(this.f.CORNER);

            this.f.pop(); // Restaurer l'état précédent



            

            this.positions.push({x: x, y: y});
        }
        this.make_bar();
    }

    get_position(){
        return this.positions;
    }

    
}