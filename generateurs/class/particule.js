class Particule {
    // Liste statique de toutes les particules
    static allParticules = [];
    
    constructor({
        x = 0, y = 0, angle = 0, height = 3, width_ellipse = 1, height_ellipse = 1,  
        detail = 0, brightness = 0 } = {}) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.height = height;       
        this.width_ellipse = width_ellipse;
        this.height_ellipse = height_ellipse;


        this.detail = detail;
        this.brightness = brightness;

        
        // Ajouter automatiquement cette particule à la liste statique
        Particule.allParticules.push(this);
    }


    // Méthode statique pour obtenir toutes les particules
    static get_all_particules() {
        return Particule.allParticules;
    }
    
    // Méthode statique pour vider la liste de particules
    static resetAllParticules() {
        Particule.allParticules = [];
    }
    
    // Méthode statique pour changer le noise_angle_level de toutes les particules
    static setNoiseAngleLevelAll(level) {
        Particule.allParticules.forEach(particule => {
            particule.noise_angle_level = level;
        });
        console.log(`✅ Niveau de bruit mis à jour pour ${Particule.allParticules.length} particules (${level})`);
    }

    rotate_noise(noise_level = null) {
        // Utilise le paramètre s'il est fourni, sinon utilise la propriété de l'instance
        const level = noise_level !== null ? noise_level : this.noise_angle_level;
        let noiseVal = noise(this.x * level, this.y * level);
        let angleOffset = map(noiseVal, 0, 1, -PI, PI);
        this.angle = degrees(angleOffset);
    }

    rotate_brightness(map_image_brightness) {
        // Normaliser la luminosité (0-255) vers un angle (0-180 degrés)
        let normalizedBrightness = map(this.brightness,  0, map_image_brightness.nb_value, 0, 1);
        // L'angle est directement lié à la luminosité normalisée, sans bruit
        // L'angle varie de 0 à PI radians (0 à 180 degrés) en fonction de la luminosité
        let angleOffset = normalizedBrightness * PI;
        this.angle = degrees(angleOffset);
    }

    rotate_detail(map_image_detail) {
        let normalizedDetail = map(this.detail, 0, map_image_detail.nb_value, 0, 1);
        // L'angle est directement lié au détail normalisé, sans bruit.
        // L'angle varie de 0 à PI radians (0 à 180 degrés) en fonction du détail.
        let angleOffset = normalizedDetail * PI;
        this.angle = degrees(angleOffset);
    }

    draw_ellipse(buffer) {
        buffer.push();
        buffer.translate(this.x, this.y);
        buffer.rotate(radians(this.angle)); // Conversion en radians
        buffer.fill(0);
        buffer.noStroke();
        buffer.ellipse(0, 0, this.width_ellipse, this.height_ellipse);
        buffer.pop();
    }

    draw_rectangle(buffer) {
        buffer.push();
        buffer.translate(this.x, this.y);
        buffer.rotate(radians(this.angle)); // Conversion en radians
        buffer.fill(0);
        buffer.noStroke();
        buffer.rect(0, 0, this.width_ellipse, this.height_ellipse);
        buffer.pop();
    }
}
