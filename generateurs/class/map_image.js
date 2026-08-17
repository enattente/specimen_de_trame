/**
 * @class MapImage
 * @description Gère la cartographie des valeurs d'une image en fonction de seuils définis.
 *              Permet de transformer des valeurs brutes (ex: luminosité) en indices de règles.
 * @param {number} [options.nb_value=8] - Le nombre de valeurs (ou niveaux) distinctes que la carte peut produire.
 * @param {number} [options.valeur_source_min=0] - La valeur minimale attendue de la source (ex: luminosité d'un pixel).
 * @param {number} [options.valeur_source_max=255] - La valeur maximale attendue de la source (ex: luminosité d'un pixel).
 */

class MapImage {
  constructor({ nb_value = 8, valeur_source_min = 0, valeur_source_max = 255} = {}) {

    this.nb_value = nb_value;
    this.valeur_source_max = valeur_source_max;
    this.valeur_source_min = valeur_source_min;
    this.stepsize_width;
    this.stepsize_height;
    this.img;
    
    this.seuils = [];
    this.value_map = [];

    // Créer des seuils par défault
    this.set_by_default_seuils();
  }


  ///////////////////////////////
  // methode pour faire les maps
  ///////////////////////////////

  // Créer des seuils par défault
  set_by_default_seuils() {
    this.seuils = [];
    for (let i = 0; i < this.nb_value + 1; i++) {
      let value = int(map(i, 0, this.nb_value, this.valeur_source_min, this.valeur_source_max));
      this.seuils.push(value);
    }
    console.log('set_by_default_seuils: seuils de la map:', this.seuils);
  }

  // Méthode privée pour initialiser et préparer l'analyse d'image
  _prepare_image_analysis(img, stepsize_width, stepsize_height) {
    this.stepsize_width = stepsize_width;
    this.stepsize_height = stepsize_height;
    this.img = img;
    this.img.loadPixels();

    let rows = Math.ceil(this.img.height / this.stepsize_height); // lignes
    let cols = Math.ceil(this.img.width / this.stepsize_width);  // colonnes

    this.value_map = [];
    
    return { rows, cols };
  }

  // Méthode privée pour collecter les valeurs de luminosité d'une portion d'image
  _collect_brightness_values(x, y) {
    let brightnessValues = [];
    let brightnessSum = 0;
    let count = 0;

    for (let dy = 0; dy < this.stepsize_height; dy++) {
      for (let dx = 0; dx < this.stepsize_width; dx++) {
        let py = y * this.stepsize_height + dy;
        let px = x * this.stepsize_width + dx;

        if (py >= this.img.height || px >= this.img.width) continue;

        let index = 4 * (px + py * this.img.width);
        let r = this.img.pixels[index];
        let g = this.img.pixels[index + 1];
        let b = this.img.pixels[index + 2];
        let brightness = (r + g + b) / 3;

        brightnessValues.push(brightness);
        brightnessSum += brightness;
        count++;
      }
    }

    return { brightnessValues, brightnessSum, count };
  }

  // Méthode pour calculer la luminosité moyenne d'une portion
  _calculate_average_brightness(x, y) {
    const { brightnessSum, count } = this._collect_brightness_values(x, y);
    
    if (count > 0) {
      return brightnessSum / count;
    }
    return 0;
  }
  // Méthode pour calculer l'écart-type (standard deviation) d'une portion
  _calculate_standard_deviation(x, y) {
    const { brightnessValues } = this._collect_brightness_values(x, y);
    
    if (brightnessValues.length === 0) {
      return 0;
    }

    // Calculer la moyenne
    let sum = 0;
    for (let i = 0; i < brightnessValues.length; i++) {
      sum += brightnessValues[i];
    }
    let meanBrightness = sum / brightnessValues.length;

    // Calculer la somme des carrés des différences par rapport à la moyenne
    let sumOfSquaredDifferences = 0;
    for (let i = 0; i < brightnessValues.length; i++) {
      sumOfSquaredDifferences += Math.pow(brightnessValues[i] - meanBrightness, 2);
    }

    // Calculer la variance
    let variance = sumOfSquaredDifferences / brightnessValues.length;

    // Calculer l'écart type (standard deviation)
    return Math.sqrt(variance);
  }

  // Créer la brightness map en fonction de l'image et du stepsize(nombre de cases de la map)
  make_map_brightness(img, stepsize_width, stepsize_height) {
    const { rows, cols } = this._prepare_image_analysis(img, stepsize_width, stepsize_height);

    for (let y = 0; y < rows; y++) {
      this.value_map[y] = [];
      for (let x = 0; x < cols; x++) {
        let avgBrightness = this._calculate_average_brightness(x, y);
        let value = this.rescale_value_by_seuil(avgBrightness);
        this.value_map[y][x] = value;
      }
    }

    console.log('make_map_brightness: value_map[y][x] structure:', this.value_map);
    return this.value_map;
  }
  
  make_map_detail(img, stepsize_width, stepsize_height) {
    const { rows, cols } = this._prepare_image_analysis(img, stepsize_width, stepsize_height);

    for (let y = 0; y < rows; y++) {
      this.value_map[y] = [];
      for (let x = 0; x < cols; x++) {
        let standardDeviation = this._calculate_standard_deviation(x, y);
        let value = this.rescale_value_by_seuil(standardDeviation);
        this.value_map[y][x] = value;
      }
    }

    console.log('make_map_detail: value_map[y][x] structure:', this.value_map);
    return this.value_map;
  }

  make_map_aleatoire(img, stepsize_width, stepsize_height) {
    const { rows, cols } = this._prepare_image_analysis(img, stepsize_width, stepsize_height);

    for (let y = 0; y < rows; y++) {
      this.value_map[y] = [];
      for (let x = 0; x < cols; x++) {
        let value = random(0, this.nb_value);
        this.value_map[y][x] = value;
      }
    }
    console.log('make_map_aleatoire: value_map[y][x] structure:', this.value_map);
    return this.value_map;
  }


  //renvoie la brigtness map
  get_value_map() {
    return this.value_map;
  }

  ///////////////////////////////
  // methode concernant les seuils
  ///////////////////////////////


  // permet de changer le nombre de valeur et donc le nombre de seuils
  update_nb_value(nb_value) {
    this.value_map = [];
    this.nb_value = nb_value;  
    this.set_by_default_seuils(); 
  }

  // permet de changer une valeur d'un seuil
  change_one_seuil(num_seuil, new_value) {
    this.seuils[num_seuil] = new_value;
  }

  //renvoie les seuils
  get_seuils() {
    return this.seuils;
  }

  //renvoie la valeur d'un seuil en fonction de la valeur de la map
  rescale_value_by_seuil(n) {
    for (let i = 1; i < this.nb_value + 1; i++) {
      if (n < this.seuils[i]) {
        return i - 1;
      }
    }
    return this.nb_value - 1; // Retourne l'indice de la dernière règle si la valeur est très élevée
  }
}



