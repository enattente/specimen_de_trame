class Area{
  constructor({ x = 0, y = 0, width =10 , height=10, 
    color = 0, detail = 0, nb_particules = 0,   nb_childs = 0, divisions = 0, value_aleatoire = 0,
    particule_size_width = 1, particule_size_height = 1, line_thickness = 1, state = 0} = {}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.line_thickness = line_thickness;

    this.detail = detail;
    this.divisions = divisions;
    this.color = color;
    this.nb_particules = nb_particules; 
    this.state = state;

    this.nb_childs = nb_childs;

    this.particule_size_width = particule_size_width; // 1 = 1 pixel
    this.particule_size_height = particule_size_height; // 1 = 1 pixel

    this.value_aleatoire = value_aleatoire;

  }

  // Dessine des particules selon la taille et le nombre de particules
  draw_on_buffer_particule_pixels(buffer) {
    let colorVal = 0; // Utilise la couleur de l'instance de Portion

    // Calcule la plage maximale pour le placement aléatoire des particules
    let random_x_range = Math.max(0, this.width - this.particule_size_width + 1);
    let random_y_range = Math.max(0, this.height - this.particule_size_height + 1);

    for (let i = 0; i < this.nb_particules; i++) {
      // Génère une position de départ aléatoire (coin supérieur gauche) pour la particule.
      let px = Math.floor(this.x + Math.random() * random_x_range);
      let py = Math.floor(this.y + Math.random() * random_y_range);

      // Vérifie si une partie de la particule est visible dans le buffer.
      if (px < buffer.width && py < buffer.height &&
          px + this.particule_size_width > 0 && py + this.particule_size_height > 0) {

        // Dessine chaque pixel de la particule, de taille this.particle_size x this.particle_size
        for (let dx = 0; dx < this.particule_size_width; dx++) {
          for (let dy = 0; dy < this.particule_size_height; dy++) {
            let drawX = px + dx;
            let drawY = py + dy;

            // Vérifie que le pixel courant est dans les limites du buffer
            if (drawX >= 0 && drawX < buffer.width && drawY >= 0 && drawY < buffer.height) {
              let index = 4 * (drawX + drawY * buffer.width);
              buffer.pixels[index + 0] = colorVal; // Composante Rouge
              buffer.pixels[index + 1] = colorVal; // Composante Verte
              buffer.pixels[index + 2] = colorVal; // Composante Bleue
              buffer.pixels[index + 3] = 255;      // Composante Alpha (opaque)
            }
          }
        }
      }
    }
  }

  // Dessine une couleur uniforme sur le buffer
  draw_on_buffer_applat_couleur(buffer) {
    let colorVal = this.color; // Utiliser la valeur de la case comme intensité RVB
    for (let dx = 0; dx < this.width; dx++) {
      for (let dy = 0; dy < this.height; dy++) {
        let px = this.x + dx;
        let py = this.y + dy;

        if (px < buffer.width && py < buffer.height) {
          let index = 4 * (px + py * buffer.width);
          buffer.pixels[index + 0] = colorVal; // R
          buffer.pixels[index + 1] = colorVal; // G
          buffer.pixels[index + 2] = colorVal; // B
          buffer.pixels[index + 3] = 255;      // Alpha (opaque)
        }
      }
    }
  }

  // Dessine une croix diagonale sur le buffer
  draw_on_buffer_cross_diagonal(buffer) {
    if (this.state == 1) {
      for (let dx = 0; dx < this.width; dx++) {
        for (let dy = 0; dy < this.height; dy++) {
          let px = this.x + dx;
          let py = this.y + dy;

          // Vérifier si nous sommes sur les diagonales pour dessiner la croix
          // dx/width ≈ dy/height (diagonale principale) ou dx/width ≈ (height-dy)/height (diagonale secondaire)
          let diagonalThickness = this.line_thickness; // Épaisseur des lignes de la croix
          let onMainDiagonal = Math.abs(dx / this.width - dy / this.height) <= diagonalThickness / Math.max(this.width, this.height);
          let onSecondaryDiagonal = Math.abs(dx / this.width - (this.height - dy) / this.height) <= diagonalThickness / Math.max(this.width, this.height);

          if (px < buffer.width && py < buffer.height) {
            let index = 4 * (px + py * buffer.width);
            
            if (onMainDiagonal || onSecondaryDiagonal) {
              // Dessine en noir pour les diagonales (la croix)
              buffer.pixels[index + 0] = 0; // R
              buffer.pixels[index + 1] = 0; // G
              buffer.pixels[index + 2] = 0; // B
              buffer.pixels[index + 3] = 255; // Alpha (opaque)
            } 
          }
        }
      }
    }
  }
  
  // Dessine une croix droite sur le buffer
  draw_on_buffer_cross_droite(buffer) {
    if (this.state == 1) {
      for (let dx = 0; dx < this.width; dx++) {
        for (let dy = 0; dy < this.height; dy++) {
          let px = this.x + dx;
          let py = this.y + dy;

          // Vérifier si nous sommes sur les lignes droites (horizontale et verticale) pour dessiner la croix
          const lineThickness = this.line_thickness; // Épaisseur des lignes de la croix
          const midX = Math.floor(this.width / 2);
          const midY = Math.floor(this.height / 2);
          const halfThickness = Math.floor(lineThickness / 2);

          // Condition pour la ligne verticale
          const onVerticalLine = dx >= midX - halfThickness && dx < midX - halfThickness + lineThickness;
          // Condition pour la ligne horizontale
          const onHorizontalLine = dy >= midY - halfThickness && dy < midY - halfThickness + lineThickness;

          if (px < buffer.width && py < buffer.height) {
            let index = 4 * (px + py * buffer.width);
            
            if (onVerticalLine || onHorizontalLine) {
              // Dessine en noir pour les lignes (la croix droite)
              buffer.pixels[index + 0] = 0; // R
              buffer.pixels[index + 1] = 0; // G
              buffer.pixels[index + 2] = 0; // B
              buffer.pixels[index + 3] = 255; // Alpha (opaque)
            }
          }
        }
      }
    }
  }

  // Dessine des ellipses sur le buffer
  draw_on_buffer_ellipse(buffer) {
    buffer.noStroke();
    buffer.fill(0); // Couleur noire

    for (let i = 0; i < this.nb_particules; i++) {
      let px = this.x + Math.random() * this.width;
      let py = this.y + Math.random() * this.height;

      // Dessine un point de taille (dotWidth x dotHeight)
      noSmooth();
      buffer.ellipse(px, py, this.particule_size_width, this.particule_size_height);
    }
  }

  draw_on_buffer_ellipse_oriente(buffer) {
    buffer.noStroke();
    buffer.fill(0); // Couleur noire

    for (let i = 0; i < this.nb_particules; i++) {
      let px = this.x + Math.random() * this.width;
      let py = this.y + Math.random() * this.height;

      let particule = new Particule({
        x: px,
        y: py,
        width_ellipse: this.particule_size_width,
        height_ellipse: this.particule_size_height,
        detail: this.detail,
        brightness: this.color,
      });
      
      // Appliquer une rotation immédiatement en fonction du détail

      
      particule.draw_ellipse(buffer);
    }
  }

  draw_on_buffer_rectangle_oriente(buffer) {
    buffer.noStroke();
    buffer.fill(0); 

    for (let i = 0; i < this.nb_particules; i++) {
      let px = this.x + Math.random() * this.width;
      let py = this.y + Math.random() * this.height;

      let particule = new Particule({
        x: px,
        y: py,
        width_ellipse: this.particule_size_width,
        height_ellipse: this.particule_size_height,
        detail: this.detail,
        brightness: this.color,
      });
      
      // Appliquer une rotation immédiatement en fonction du détail

      
      particule.draw_rectangle(buffer);
    }
  }




  get_nb_childs() {
    return this.nb_childs;
  }

  get_detail() {
    return this.detail;
  }

  get_position() {
    return { x: this.x, y: this.y };
  }
  
}
