let img = null;


// Taille des areas
let stepsize_width = 10;
let stepsize_height = 10;


//  les maps 
let map_image_brightness = null;
let map_image_detail = null;

let values_map_brightness = [];
let values_map_detail = [];

// navigation
let navigation;



// les rules : manière d'interpreter les valeurs de la map
let nb_value_colors = 5;
let nb_value_nb_particules = 5;
let nb_value_divisions = 5;
let nb_value_state_vertical = 5;
let nb_value_state_horizontal = 5;

let rules_colors = null;
let rules_nb_particules = null;
let rules_divisions = null;
let rules_state_vertical = null;
let rules_state_horizontal = null;


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
  rules_brightness = new Rules({map:map_image_brightness, rules_max:0, rules_min:255});
  

  init_interface_seuil();
  init_interface();
}



// definir l'image, et le buffer
function init_image() {
  background(220);
  img.loadPixels();

  // Créer le buffer de l'image
  buffer = createImage(img.width, img.height);
  buffer.loadPixels();
  // fond blanc
  for (let i = 0; i < buffer.pixels.length; i += 4) {
    buffer.pixels[i + 0] = 255; // R
    buffer.pixels[i + 1] = 255; // G
    buffer.pixels[i + 2] = 255; // B
    buffer.pixels[i + 3] = 255; // A
  }
  // dimension du buffer dans le canva
  if (width / height < img.width / img.height) {
    width_buffer_in_canva = width;
    height_buffer_in_canva = (img.height * width) / img.width;
  } else {
    width_buffer_in_canva = (img.width * height) / img.height;
    height_buffer_in_canva = height;
  }


  // initialisation des maps selon les dimensions de l'image
  values_map_brightness = [];
  map_image_brightness.make_map_brightness(img, stepsize_width, stepsize_height);
  values_map_brightness = map_image_brightness.get_value_map();


  // Fonction pour préparer les étapes de traitement
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

  // Déterminer le nombre total de portions et préparer les étapes
  areas_nb_ranges = values_map_brightness.length;
  areas_nb_colonnes = values_map_brightness[0].length;
  areas_nb_total = areas_nb_colonnes * areas_nb_ranges;  
  liste_etapes = preparer_etapes(areas_nb_total, etapes);

  
  img_init = 0;    // Réinitialiser la ligne actuelle à dessiner
}

//dessine l'image
function draw() {
  if (img_init !== -1) {
    if (img_init < liste_etapes.length - 1) {
      for (let i = liste_etapes[img_init]; i < liste_etapes[img_init + 1]; i++) {
        let x = i % areas_nb_colonnes; // colonne
        let y = Math.floor(i / areas_nb_colonnes); // ligne

        let value = values_map_brightness[y][x]; // 
        let color = rules_brightness.get_rule(value);

        let c = new Area({
          x: x * stepsize_width,
          y: y * stepsize_height,
          width: stepsize_width,
          height: stepsize_height,
          color: color,
        });

        c.draw_on_buffer_applat_couleur(buffer);
      }

      buffer.updatePixels();
      image(buffer, 0, 0, width_buffer_in_canva, height_buffer_in_canva);
      Data.captureFrame(buffer);
      img_init++;
    } else {
      img_init = -1;
      console.log("Génération terminée");
    }
  }
}




