//On mappe des valeur d'une image selon des seuils

class MapImage {
  constructor({ nb_value= 8, min= 0, max = 255} = {}) {
    //nombre de valeur de la map et espacement des valeurs à mapper
    this.nb_value = nb_value;
    this.max = max;
    this.min = min;

    //valuer necessaire pour la value_map
    this.stepsize;
    this.img;
    
    this.seuils = [];
    this.value_map = [];
    

    // Créer des seuils par défault
    this.reset_seuils();
  }

  // Créer des seuils par défault
  reset_seuils() {
    for (let i = 0; i < 10; i++) {
      let value = int(map(i,  0,9, this.min, this.max));
      this.seuils.push(value);
    }
    console.log('reset_seuils: seuils de la map:',this.seuils);
  }
  // Créer la brightness map en fonction de l'image et du stepsize(nombre de cases de la map)
  make_value_map(img, stepsize) {
    this.stepsize = stepsize;
    this.img = img;
    this.img.loadPixels();
    for (let x = 0; x < this.img.width / this.stepsize; x++) {
      this.value_map[x] = [];
      for (let y = 0; y < this.img.height / this.stepsize; y++) {
        let brightnessSum = 0;
        let count = 0;

        for (let dx = 0; dx < this.stepsize; dx++) {
          for (let dy = 0; dy < this.stepsize; dy++) {
            let px = x * this.stepsize + dx;
            let py = y * this.stepsize + dy;

            if (px >= this.img.width || py >= this.img.height) continue;

            let index = 4 * (px + py * this.img.width);
            let r = this.img.pixels[index];
            let g = this.img.pixels[index + 1];
            let b = this.img.pixels[index + 2];
            let brightness = (r + g + b) / 3;

            brightnessSum += brightness;
            count++;
          }
        }

        let avgBrightness = brightnessSum / count;
        let value = this.rescale_value_by_seuil(avgBrightness);
        this.value_map[x][y] = value;
      }
    }
    console.log('make_value_map: value_map:',this.value_map);
    return this.value_map;
  }
  //renvoie la brigtness map
  get_value_map() {
    console.log('get_value_map: value_map:',this.value_map);
    return this.value_map;
  }
  //renvoie les seuils
  get_seuils() {
    return this.seuils;
  }
  //permet de changer la valeur d'un seuil spécifique
  change_one_seuil(num_seuil, new_value){
    this.seuils[num_seuil]  = new_value;
    console.log('change_one_seuil: seuils:',this.seuils);
  }
  //fonction pour connaitre une valeur en fonction des seuils
  rescale_value_by_seuil(n) {
    for (let i = 1; i < 9; i++) {
      if (n < this.seuils[i]) {
        return 9-i;
      }
    }
    return 0 ; // fallback: n dépasse tous les seuils
  }
  //dessine l'échelle sur laquelle inscrire les carrés

}



