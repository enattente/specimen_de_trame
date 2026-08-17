let img = null;


// Taille des areas
let stepsize_width = 10;
let stepsize_height = 10;
let deep = 5;


//  les maps 
let map_image_brightness = null;
let map_image_detail = null;

let values_map_brightness = [];
let values_map_detail = [];

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
let registre_zones_visites = null;
let registre_generations = null;


// Les variables de particules pixels : uniquement si on veut des particules pixels
let particule_pixel_width = 1; // 1 = 1 pixel
let particule_pixel_height = 1; // 1 = 1 pixel
let particule_ovale_width = 1; 
let particule_ovale_height = 1; 
let nb_particules_max = 100;
let nb_particules_min = 0;
let noise_angle_level = 0.0001;


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

  registre_generations = new Registre_Generations(2);


  // creation des map et des rules
  map_image_brightness = new MapImage({nb_value:nb_value_colors, valeur_source_min:0, valeur_source_max:255});
  map_image_detail = new MapImage({nb_value:nb_value_detail, valeur_source_min:0, valeur_source_max:125});


  rules_nb_particules = new Rules({map:map_image_brightness, rules_max:nb_particules_max, rules_min:nb_particules_min});
  rules_division = new Rules({map:map_image_brightness, rules_max:deep+1, rules_min:0});

  

  init_interface_seuil();
  init_interface();
}



// definir l'image, et le buffer
function init_image() {
  background(220);
  img.loadPixels();
  // Réinitialiser la liste des particules au début de chaque génération
  Particule.resetAllParticules();
  registre_generations.reset();

  // Créer le buffer de l'image
  buffer = createGraphics(img.width, img.height);
  buffer.background(255);
  // fond blanc

  // dimension du buffer dans le canva
  if (width / height < img.width / img.height) {
    width_buffer_in_canva = width;
    height_buffer_in_canva = (img.height * width) / img.width;
  } else {
    width_buffer_in_canva = (img.width * height) / img.height;
    height_buffer_in_canva = height;
  }

  // Initialiser les atlas des maps pour chaque niveau de profondeur
  atlas_map_brightness = [];
  atlas_map_detail = [];
  
  // Pour chaque niveau de profondeur, créer une map avec une résolution différente
  for (let d = 0; d < deep; d++) {
    // Taille des cellules pour ce niveau de profondeur
    // On divise par 2 à chaque niveau pour suivre la subdivision
    let current_step_width = stepsize_width * (2 ** (deep - 1 - d));
    let current_step_height = stepsize_height * (2 ** (deep - 1 - d));

    console.log(`Génération des maps pour profondeur ${d}:`);
    console.log(`- Dimensions: ${current_step_width}x${current_step_height}`);
    
    // Générer les maps pour ce niveau - make_map_brightness REMPLACE this.value_map et renvoie cette référence
    let map_brightness_values = map_image_brightness.make_map_brightness(img, current_step_width, current_step_height);
    let map_detail_values = map_image_detail.make_map_detail(img, current_step_width, current_step_height);
    
    console.log(`- Map générée: ${map_brightness_values ? map_brightness_values.length : 'undefined'} lignes`);
    if (map_brightness_values && map_brightness_values.length > 0) {
      console.log(`- ${map_brightness_values[0].length} colonnes`);
    }
    
    // Stocker les informations de la map pour ce niveau
    atlas_map_brightness.push({
      width: current_step_width,
      height: current_step_height,
      value_map: map_brightness_values
    });
    
    atlas_map_detail.push({
      width: current_step_width,
      height: current_step_height,
      value_map: map_detail_values
    });
  }

  // Création de la première génération (niveau 0)
  let initial_map_color = atlas_map_brightness[0];
  let initial_map_detail = atlas_map_detail[0];

  // Parcourir la map de niveau 0 pour créer les premières portions
  for (let y = 0; y < initial_map_color.value_map.length; y++) {
    for (let x = 0; x < initial_map_color.value_map[y].length; x++) {
      let brightness_value = initial_map_color.value_map[y][x];
      let detail_value = initial_map_detail.value_map[y][x];
      
      // Obtenir les valeurs à partir des règles
      let divisions = rules_division.get_rule(brightness_value); 
      let nb_particules = rules_nb_particules.get_rule(brightness_value);

      // Créer une nouvelle portion
      let portion = new Area({
        x: x * initial_map_color.width,
        y: y * initial_map_color.height,
        width: initial_map_color.width,
        height: initial_map_color.height,
        divisions: divisions,
        detail: detail_value,
        nb_particules: nb_particules,
        particule_size_width: particule_pixel_width,
        particule_size_height: particule_pixel_height,
      });
      
      // Ajouter la portion à la génération 0
      registre_generations.add_child(portion, 0);
      console.log("portion:", portion); 
      // Dessiner la portion sur le buffer
      portion.draw_on_buffer_ellipse_oriente(buffer);
    }
  }
  
  // Passer à la génération suivante pour que les portions créées deviennent des parents
  registre_generations.next_generation();
  
  // Afficher le buffer sur le canvas
  image(buffer, 0, 0, width_buffer_in_canva, height_buffer_in_canva);
  Data.captureFrame(buffer);
  // Initialiser le compteur d'étapes
  img_init = 0;
  current_etape = 0;
}

//dessine l'image
function draw() {
  if (img_init !== -1) {
    // Si on n'a pas encore atteint la profondeur maximale
    if (img_init < deep) {
      console.log("Profondeur actuelle:", img_init);
      
      // Récupérer tous les parents de la génération actuelle
      let parents = registre_generations.get_parent(1);
      console.log("parents:", parents);
      
      // S'il n'y a aucun parent, on arrête la génération
      if (parents.length === 0) {
        console.log("Génération terminée - aucun parent disponible");
        img_init = -1;
        image(buffer, 0, 0, width_buffer_in_canva, height_buffer_in_canva);
        Data.captureFrame(buffer);
        return;
      }
      
      // Préparer les étapes pour ce niveau de profondeur
      let liste_etapes_niveau = preparer_etapes(parents.length, etapes);
      
      // Si on a terminé toutes les étapes pour ce niveau
      if (current_etape >= liste_etapes_niveau.length - 1) {
        // Passer au niveau de profondeur suivant
        registre_generations.next_generation();
        img_init++;
        current_etape = 0;
        console.log("Passage à la profondeur:", img_init);
        return;
      }
      
      // Traitement par étape des parents
      for (let i = liste_etapes_niveau[current_etape]; i < liste_etapes_niveau[current_etape + 1]; i++) {
        if (i < parents.length) {
          let parent = parents[i];
          
          // Récupérer la map correspondant à ce niveau de profondeur
          let color_map_info = atlas_map_brightness[img_init];
          let detail_map_info = atlas_map_detail[img_init];
          
          // Vérifier si la valeur divisions du parent est supérieure à la profondeur actuelle
          if (parent.divisions > img_init) {
            // Diviser la portion parent en sous-portions
            // Créer 4 enfants (subdivision en quadrants)
            let half_width = parent.width / 2;
            let half_height = parent.height / 2;
            
            // Positions des quadrants
            let positions = [
              {x: parent.x, y: parent.y},
              {x: parent.x + half_width, y: parent.y},
              {x: parent.x, y: parent.y + half_height},
              {x: parent.x + half_width, y: parent.y + half_height}
            ];
            
            // Créer et dessiner chaque enfant
            for (let pos of positions) {
              // Calcul de l'indice dans la map pour cette position
              let map_x = Math.floor(pos.x / color_map_info.width);
              let map_y = Math.floor(pos.y / color_map_info.height);
              
              // Vérifier que l'indice est valide dans la map
              if (map_y < color_map_info.value_map.length && map_x < color_map_info.value_map[map_y].length) {
                let brightness_value = color_map_info.value_map[map_y][map_x];
                let detail_value = detail_map_info.value_map[map_y][map_x];
                
                // Obtenir les valeurs des règles
                let divisions = rules_division.get_rule(brightness_value);
                let detail = detail_value; // Utiliser directement la valeur de détail
                let nb_particules = rules_nb_particules.get_rule(brightness_value);
                let color = color_map_info.value_map[map_y][map_x];
                
                let enfant = new Area({
                  x: pos.x,
                  y: pos.y,
                  width: half_width,
                  height: half_height,
                  divisions: divisions,
                  detail: detail,
                  nb_particules: nb_particules,
                  particule_size_width: particule_pixel_width,
                  particule_size_height: particule_pixel_height,
                  color: color,
                });
                
                // Ajouter l'enfant à la génération 0
                registre_generations.add_child(enfant);
                
                // Dessiner l'enfant dans le buffer
                enfant.draw_on_buffer_ellipse_oriente(buffer);
              }
            }
          }
        }
      }
      
      // Afficher le buffer sur le canvas
      image(buffer, 0, 0, width_buffer_in_canva, height_buffer_in_canva);
      current_etape++;
      Data.captureFrame(buffer);
    } else {
      img_init = -1;
      console.log("Génération terminée - profondeur maximale atteinte");
    }
  }
}


function preparer_etapes(nb_total, nb_etapes) {
  let div = Math.floor(nb_total / nb_etapes);
  
  let liste = [];
  for (let i = 0; i < nb_etapes+1; i++) {
    liste.push(i * div);
  }
  liste.push(nb_total); // S'assurer que la dernière étape inclut toutes les portions restantes
  
  console.log('preparer_etapes: liste_etapes:', liste);
  return liste;
}