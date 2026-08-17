let img = null;


// Taille des areas
let stepsize_width = 10;
let stepsize_height = 10;
let deep = 5;
let profondeur_memoire = 5000;

//  les maps 
let map_image_brightness = null;
let map_image_detail = null;
let map_image_aleatoire = null;
let values_map_brightness = [];
let values_map_detail = [];
let values_map_aleatoire = [];
let atlas_map_brightness = [];
let atlas_map_detail = [];

// navigation
let navigation;



// les rules : manière d'interpreter les valeurs de la map
let nb_value_colors = 5;
let nb_value_detail = 5;
let nb_value_nb_particules = 5;
let nb_value_divisions = 5;
let nb_value_state_vertical = 5;
let nb_value_state_horizontal = 5;

let rules_colors = null;
let rules_nb_particules = null;
let rules_division = null;
let rules_state_vertical = null;
let rules_state_horizontal = null;
let rules_detail = null;


// les registres
let registre_area_visited = null;
let registre_generations = null;


// Les variables de particules pixels : uniquement si on veut des particules pixels
let particule_pixel_width = 1; // 1 = 1 pixel
let particule_pixel_height = 1; // 1 = 1 pixel
let particule_ovale_width = 1; 
let particule_ovale_height = 1; 
let nb_particules_max = 100;
let nb_particules_min = 0;
let noise_angle_level = 0.0001;
let line_thickness = 1;

// les objet d'interface (sliders et miniature = map image, niveaux = rules)
let slider_brightness;
let slider_detail;


let miniature_brightness;
let miniature_detail;

let niveaux_colors;
let niveaux_nb_particules;
let niveaux_divisions;
let niveaux_state_vertical;
let niveaux_state_horizontal;


// les variables d'organisation du programme, pavage regulier
let etapes = 25; // nombre de frame pour dessiner toutes l'images
let liste_etapes = []; // liste des etapes pour dessiner l'image
let areas_nb_ranges;
let areas_nb_colonnes;
let areas_nb_total;
let img_init = -1;


// les variables des des dimesion des canvas
let buffer;
let width_buffer_in_canva;
let height_buffer_in_canva;



// creation du canvas, du buffer, des rules, des seuils et de l'interface 
function setup() {

  // creation du canvas
  let container = document.getElementById("visionneuse");
  let w = container.offsetWidth;
  let h = container.offsetHeight;
  canva = createCanvas(w, h);
  background(220);
  canva.parent('visionneuse'); // Place le canvas dans le div prévu

  
  
  // creation des map et des rules
  map_image_brightness = new MapImage({nb_value:nb_value_colors, valeur_source_min:0, valeur_source_max:255});
  map_image_detail = new MapImage({nb_value:nb_value_detail, valeur_source_min:0, valeur_source_max:125});
  map_image_aleatoire = new MapImage({nb_value:50, valeur_source_min:0, valeur_source_max:100});
  rules_colors = new Rules({map:map_image_brightness, rules_max:255, rules_min:0});
  rules_state_vertical = new Rules({map:map_image_brightness, rules_max:1, rules_min:0});

  
  registre_generations = new Registre_Generations(2);
  registre_area_visited = new Registre_Area_Visited(profondeur_memoire);
  navigation = new Navigation(registre_area_visited);


  // creation des atlas destination_x = [0,1,0,-1];
  destination_x = [0,1,0,-1];
  destination_y = [1,0,-1,0];
  navigation.update_itineraires(destination_x, destination_y);

  nb_childs = [0, 1, 3];
  probas_childs = [0.1, 0.2, 0.15];
  navigation.update_nb_child(nb_childs, probas_childs);

  departs = [[0,0,0],[0,1,0],[0,0,0]];
  

  init_interface_seuil();
  init_interface();


  ecrire_interface_itineraires();
  ecrire_interface_nb_childs();
  ecrire_interface_depart();  
}



// definir l'image, et le buffer
function init_image() {
  background(220);
  img.loadPixels();
  // Réinitialiser la liste des particules au début de chaque génération
  Particule.resetAllParticules();
  registre_generations.reset();
  registre_area_visited.reset();

  // Créer le buffer de l'image
  buffer = createImage(img.width, img.height);
  buffer.loadPixels();
  for (let i = 0; i < buffer.pixels.length; i += 4) {
    buffer.pixels[i + 0] = 255; // R
    buffer.pixels[i + 1] = 255; // G
    buffer.pixels[i + 2] = 255; // B
    buffer.pixels[i + 3] = 255; // A
  }
  // fond blanc

  // dimension du buffer dans le canva
  if (width / height < img.width / img.height) {
    width_buffer_in_canva = width;
    height_buffer_in_canva = (img.height * width) / img.width;
  } else {
    width_buffer_in_canva = (img.width * height) / img.height;
    height_buffer_in_canva = height;
  }

  values_map_brightness = map_image_brightness.make_map_brightness(img, stepsize_width, stepsize_height);
  values_map_detail = map_image_detail.make_map_detail(img, stepsize_width, stepsize_height);
  values_map_aleatoire = map_image_aleatoire.make_map_aleatoire(img, stepsize_width, stepsize_height);
  navigation.define_size(values_map_brightness[0].length, values_map_brightness.length); 

  let nb_colonnes = departs[0].length - 1;
  let nb_lignes = departs.length - 1;
  let espacement_y = Math.floor((values_map_brightness.length-1)/nb_lignes);
  let espacement_x = Math.floor((values_map_brightness[0].length-1)/nb_colonnes);

  console.log(nb_colonnes, nb_lignes);
  console.log(espacement_y, espacement_x);

  for (let i = 0; i < nb_lignes+1; i++) {
    for (let j = 0; j < nb_colonnes+1; j++) {
      if (departs[i][j] === 1) {

        let x_index = (j) * espacement_x;
        let y_index = (i) * espacement_y;

        let value_detail= values_map_detail[y_index][x_index];
        let value_brightness = values_map_brightness[y_index][x_index];
        let value_aleatoire = values_map_aleatoire[y_index][x_index];

        let detail = value_detail;
        let color = rules_colors.get_rule(value_brightness);
        let state = rules_state_vertical.get_rule(value_brightness);
        let nb_childs = 2;


        let portion = new Area({
          x: x_index * stepsize_width,
          y: y_index * stepsize_height,
          width: stepsize_width,
          height: stepsize_height,
          value_aleatoire: value_aleatoire,
          detail: detail,
          color: value_brightness,
          state: state,
          particule_size_width: particule_pixel_width,
          particule_size_height: particule_pixel_height,
          line_thickness: line_thickness,
          nb_childs: nb_childs
        });

        portion.draw_on_buffer_cross_droite(buffer);
        registre_area_visited.add_visited_area(x_index, y_index);
        registre_generations.add_child(portion, 0);
        console.log("Départ: " + x_index + ", " + y_index);
      }
    }
  }
  registre_generations.next_generation();
  buffer.updatePixels();
  image(buffer, 0, 0, width_buffer_in_canva, height_buffer_in_canva);
  Data.captureFrame(buffer);
  
  // Initialiser le compteur d'étapes
  img_init = 0;
  current_etape = 0;
  update_itineraires_from_text();
  update_nb_childs_from_text();
  update_depart_from_text();
}

//dessine l'image
function draw() {
  if (img_init !==-1 && img_init <deep) {
    console.log("Etape: " + img_init);
    let parents = registre_generations.get_parent(1);
    console.log(parents);
    if (parents.length === 0) {
      img_init = -2; // Si pas de parents, on arrête l'itération
      buffer.updatePixels();
      image(buffer, 0, 0, width_buffer_in_canva, height_buffer_in_canva);
      Data.captureFrame(buffer);
    }
    console.log("parents", parents);
    for (let i = 0; i < parents.length; i++) {

      let parent = parents[i];
      let x_parent = parent.get_position().x/stepsize_width;
      let y_parent = parent.get_position().y/stepsize_height;
      let nb_child_parent = parent.get_nb_childs();
      console.log(nb_child_parent);

      for (let j = 0; j < nb_child_parent; j++) {
        let destination = navigation.get_itineraire_result_aleatoire(x_parent, y_parent, map_image_aleatoire);
        console.log(x_parent, y_parent);
        console.log(destination);

        if (!destination) {
          console.log("pas de destination");
          continue; // Passe à l'itération suivante si aucune destination n'est libre
        }



        let value_detail = values_map_detail[destination.y][destination.x];
        let value_brightness = values_map_brightness[destination.y][destination.x];
        let value_aleatoire = values_map_aleatoire[destination.y][destination.x];
        let detail = value_detail;
        let color = value_brightness;
        let state = rules_state_vertical.get_rule(value_brightness);
        let nb_childs = navigation.get_nb_child_result();

        child = new Area({
          x: destination.x * stepsize_width,
          y: destination.y * stepsize_height,
          width: stepsize_width,
          height: stepsize_height,
          value_aleatoire: value_aleatoire,
          detail: detail,
          color: value_brightness,
          state: state,
          nb_childs: nb_childs,
          particule_size_width: particule_pixel_width,
          particule_size_height: particule_pixel_height,
          line_thickness: line_thickness,
        })
        registre_area_visited.add_visited_area(destination.x, destination.y);
        registre_generations.add_child(child, 0);
        child.draw_on_buffer_cross_droite(buffer);
      }
    }
    registre_generations.next_generation(); 
    img_init++;
    console.log(img_init);
    if (img_init % etapes === 0) { // Met à jour l'affichage tous les 10 pas
      buffer.updatePixels();
      image(buffer, 0, 0, width_buffer_in_canva, height_buffer_in_canva);
      Data.captureFrame(buffer);
    }
  }
  if (img_init === deep-1 ) {
    image(buffer, 0, 0, width_buffer_in_canva, height_buffer_in_canva);
    console.log("Fin de l'itération");
    img_init = (-1); // Réinitialiser pour ne pas redessiner
  }
}

