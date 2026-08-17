// les varibales sur lequelle on intervient
let nb_bits = 8;
let stepsize = 10;
let img = null;
let scale_factor = 1;

// interfaces
let img_miniature_horizontal = null;
let img_miniature_vertical = null;

//les objets de classes
let rules;
let cases = [];
let map_image_vertical;

let rules_horizontal;
let cases_representation_2D;
let map_image_horizontal;

let value_map_vertical;
let value_map_horizontal;

//les variables d'organisationn du programme
let i = 0;
let first_generation = [];
let prev_generation = [];
let actuelle_generation = [];
let buffer;
let width_buffer_in_canva;
let height_buffer_in_canva;





// creation du canvas, du buffer, des rules, des seuils et de l'interface 
function setup() {
  let container = document.getElementById("visionneuse");
  let w = container.offsetWidth;
  let h = container.offsetHeight;
  // création de la zone de visualisation de l'image
  canva = createCanvas(w, h);
  background(220);
  canva.parent('visionneuse'); // Place le canvas dans le div prévu

  // création des rules 
  rules = new Rules(nb_bits);
  rules.define_rules();

  // création de map_image, des seuils et de l'interface
  map_image_vertical = new MapImage({ nb_value: nb_bits, min: 0, max: 255, });
  map_image_horizontal = new MapImage({ nb_value: nb_bits, min: 0, max: 255,});
  


  // initialisation du sketch interface
  init_interface();
  init_interface_seuil();

}



// fonction pour définir la première generation selon la taille de l'image
function define_first_generation() {
  for (let x = 0; x < img.width / stepsize; x++) {
  let state = Math.floor(Math.random() * 2);
    first_generation.push(state);
  }
  console.log('define_first_generation: first_generation:',first_generation);
}

// définis, brightness map et les cases en fonction de l'image
function init_image() {
  background(220);

  img.loadPixels();
  img.resize( img.width*scale_factor, img.height*scale_factor);

  define_first_generation();

  // Créer le buffer de l'image
  buffer = createImage(img.width, img.height);
  buffer.loadPixels();
  

  // dimension du buffer dans le canva
  if (width / height < img.width / img.height) {
    width_buffer_in_canva = width;
    height_buffer_in_canva = (img.height * width) / img.width;
  } else {
    width_buffer_in_canva = (img.width * height) / img.height;
    height_buffer_in_canva = height;
  }
  
  // Créer la brightness map de l'image
  map_image_vertical.make_value_map(img, stepsize);
  value_map_vertical= map_image_vertical.get_value_map();

  map_image_horizontal.make_value_map(img, stepsize);
  value_map_horizontal = map_image_horizontal.get_value_map();

  // Créer les objets Case
  cases = [];
  for (let y = 0; y < img.height / stepsize; y++) {
    cases[y] = [];
    for (let x = 0; x < img.width / stepsize; x++) {
      let value = value_map_vertical[x][y];
      let c = new Case({
        x: x * stepsize,
        y: y * stepsize,
        size: stepsize,
        rules: rules,
        value: value,
      });
      cases[y][x] = c;
    }
  }
  // on redéfinis la condition qui lance draw dans draw
  i = 0;  
}

//dessine l'image
function draw() {
  if (i < cases.length) {
    // si c'est la première case on definis prev_generation avec first_generation
    if (i === 0) {
      prev_generation = first_generation.slice();
    }

    for (let j = 0; j < cases[i].length; j++) {
      let portion = cases[i][j];

      portion.generate(
        prev_generation[j - 1] ?? 0,
        prev_generation[j] ?? 0,
        prev_generation[j + 1] ?? 0
      );

      portion.draw_on_buffer(buffer);
      actuelle_generation.push(portion.get_state());
    }

    prev_generation = actuelle_generation.slice();
    actuelle_generation.length = 0;
    

    if (i % 25 === 0){
      buffer.updatePixels();
      image(buffer, 0, 0, width_buffer_in_canva, height_buffer_in_canva);
      Data.captureFrame(buffer);
    }
    
    i++;
  }
  

  // if (s < 9){

  //   s++;
  // }

  // if (a < 100){
  // } 
}

// save l'image
function save_image() {
  buffer.updatePixels();
  image(buffer, 0, 0, width_buffer_in_canva, height_buffer_in_canva);
  let filename = 'image.png';
  buffer.save(filename);
}









