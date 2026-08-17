class Niveau {
    constructor(f, x_left, y_top, x_right, y_bottom, rules = null, map_image = null, min_value = 0, max_value = 255) {
        this.f = f; 
        this.x_left = x_left; // position de départ
        this.y_top = y_top; // position de départ
        this.x_right = x_right; // position de fin
        this.y_bottom = y_bottom; // position de fin
        this.min_value = min_value;
        this.max_value = max_value;

        this.rules = rules;
        this.positions = [];
        this.map_image = map_image;
    }

    update_niveaux() {
        this.positions = [];
        let rules = this.rules.get_all_rules();
        let largeur = ((this.x_right - this.x_left)/rules.length);
        let seuils = this.map_image.get_seuils();
        let hauteur_max = this.y_bottom - this.y_top;
        
        for (let i = 0; i < rules.length; i++) {
            // Positions de base pour les coins inférieurs (fixes)
            let x_bottom_left = this.f.map(i, 0, rules.length, this.x_left, this.x_right);
            let x_bottom_right = this.f.map(i+1, 0, rules.length, this.x_left, this.x_right);
            
            // Positions de base pour les coins supérieurs à hauteur maximale
            let x_max_top_left = this.f.int(this.f.map(seuils[i], this.min_value, this.max_value, this.x_left, this.x_right));
            let x_max_top_right = this.f.int(this.f.map(seuils[i+1], this.min_value, this.max_value, this.x_left, this.x_right));
            
            // Calcul de la hauteur actuelle
            let hauteur = this.f.int(this.f.map(rules[i], this.rules.rules_min, this.rules.rules_max, 0, hauteur_max));
            
            // Facteur d'interpolation (0 quand hauteur = 0, 1 quand hauteur = hauteur_max)
            let factor = hauteur / hauteur_max;
            
            // Interpoler les positions x pour suivre les diagonales
            let x_top_left = this.f.lerp(x_bottom_left, x_max_top_left, factor);
            let x_top_right = this.f.lerp(x_bottom_right, x_max_top_right, factor);
            
            let y_top = this.y_bottom - hauteur;
            let y_bottom = this.y_bottom;
            
            // Dessin de la forme avec les nouvelles coordonnées
            this.f.noStroke();
            this.f.fill(55); // La couleur du rectangle est basée sur la valeur de la règle
            this.f.beginShape();
            this.f.vertex(x_top_left, y_top);      // Coin supérieur gauche (suit la diagonale)
            this.f.vertex(x_top_right, y_top);     // Coin supérieur droit (suit la diagonale)
            this.f.vertex(x_bottom_right, y_bottom); // Coin inférieur droit (fixe)
            this.f.vertex(x_bottom_left, y_bottom);  // Coin inférieur gauche (fixe)
            this.f.endShape(this.f.CLOSE);
            
            // Tracer les lignes diagonales
            this.f.stroke(0); // Blanc semi-transparent
            this.f.strokeWeight(0.5); // Ligne fine
            // Diagonale gauche
            this.f.line(x_bottom_left, y_bottom, x_max_top_left, this.y_top);
            // Diagonale droite
            this.f.line(x_bottom_right, y_bottom, x_max_top_right, this.y_top);
            this.f.noStroke(); // Remettre noStroke pour la suite
            
            // Calculer le centre approximatif pour le texte
            let center_x = (x_top_left + x_top_right + x_bottom_left + x_bottom_right) / 4;
            let center_y = (y_top + y_bottom) / 2;
            
            // Inscrire le nombre de particules dans la forme
            this.f.fill(255); // Couleur du texte (blanc)
            this.f.textAlign(this.f.CENTER, this.f.CENTER);
            this.f.textSize(12);
            this.f.text(rules[i], center_x, center_y);

            this.positions.push({x: x_top_left, y: y_top, largeur: x_top_right - x_top_left, hauteur: hauteur});
        }
    }  

    get_position(){
        return this.positions;
    }
}