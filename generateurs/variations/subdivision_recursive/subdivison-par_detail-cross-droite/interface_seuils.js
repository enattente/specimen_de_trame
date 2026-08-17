function init_interface_seuil() {
  // création des objets 
  console.log('init_interface_seuil');

  // Variables globales pour stocker les objets de l'interface
  let slider_brightness, niveaux_brightness, niveaux_2, miniatures_brightness;

  // Première instance P5 pour les règles de luminosité
  new p5((p) => {
  
  let selected_slider = -1;
  let selected_niveau = -1;
  let selected_niveau_2 = -1;

  let slider_x_start , slider_y_start , slider_x_end , slider_y_end ;
  let miniatures_x_left, miniatures_y_top, miniatures_x_right, miniatures_y_bottom;
  let niveaux_x_left , niveaux_y_top , niveaux_x_right, niveaux_y_bottom 
  let niveaux_x_left_2 , niveaux_y_top_2 , niveaux_x_right_2, niveaux_y_bottom_2 


  p.setup = () => {
    let container = document.getElementById('interface-seuils-map_image');
    let w = container.offsetWidth;
    let h = container.offsetHeight;

    let cnv = p.createCanvas(w, h);
    p.background(240);
    cnv.parent('interface-seuils-map_image'); // Place le canvas dans le div prévu

    // definir les emplacement de miniature, seuil et niveaux
    miniatures_x_left = 0;
    miniatures_y_top = 0;
    miniatures_x_right = p.width;
    miniatures_y_bottom = p.height/3;


    slider_x_start = 0;
    slider_y_start = p.height/3;
    slider_x_end = p.width;
    slider_y_end = p.height/3;


    niveaux_x_left = 0, 
    niveaux_y_top = p.height/3, 
    niveaux_x_right = p.width, 
    niveaux_y_bottom = p.height/3 * 2;

    niveaux_x_left_2 = 0;
    niveaux_y_top_2 = p.height/3*2;
    niveaux_x_right_2 = p.width;
    niveaux_y_bottom_2 = p.height;


    // definir les objet 
    slider_brightness = new SliderBar(p, slider_x_start, slider_y_start, slider_x_end, slider_y_end, map_image_detail, 0, 125);
    slider_brightness.update_sliders();

    niveaux_brightness = new Niveau(p, niveaux_x_left, niveaux_y_top, niveaux_x_right, niveaux_y_bottom, rules_division, map_image_detail, 0, 125);
    niveaux_brightness.update_niveaux();


    miniatures_brightness = new Miniatures(p, miniatures_x_left, miniatures_y_top, miniatures_x_right, miniatures_y_bottom, nb_value_detail, map_image_detail, rules_division, slider_brightness, 0, 125);
    
    // Sauvegarder la référence à l'objet miniatures pour make_miniatures()
    window.miniatures = miniatures_brightness;
  };

  p.mousePressed = function() {
    let sliders_positions = slider_brightness.get_position();
    let niveaux_positions = niveaux_brightness.get_position();

    for (let i = 1; i < sliders_positions.length - 1; i++) {
      let x = sliders_positions[i].x;
      let y = sliders_positions[i].y;
      if (
        p.mouseY >= y - 38 &&
        p.mouseY <= y + 10 &&
        p.mouseX >= x - 10 &&
        p.mouseX <= x + 10
      ) {  
        selected_slider = i;
        break;
      }
    }

    for (let i = 0; i < niveaux_positions.length ; i++) {
      let x = niveaux_positions[i].x;
      let largeur = niveaux_positions[i].largeur;
      if (
        p.mouseY >= niveaux_y_top &&
        p.mouseY <= niveaux_y_bottom &&
        p.mouseX >= x  &&
        p.mouseX <= x + largeur
      ) {  
        selected_niveau = i;
        break;
      }
    }


  };

  p.mouseDragged = function() {
    p.fill(240);
    p.rect(0, 0, p.width, p.height);
    if (selected_slider !== -1) {
      let x_clamped = p.constrain(p.mouseX, slider_x_start, slider_x_end);
      let value = p.map(x_clamped, slider_x_start, slider_x_end, 0, 125);
      value = p.int(value);
      map_image_detail.change_one_seuil(selected_slider, value);
    }

    if (selected_niveau !== -1) {
      let y_clamped = p.constrain(p.mouseY, niveaux_y_top, niveaux_y_bottom);
      let value = p.map(y_clamped, niveaux_y_top, niveaux_y_bottom, rules_division.rules_max, rules_division.rules_min);
      value = p.int(value);
      rules_division.update_one_rule(selected_niveau, value)  
    }

  
    niveaux_brightness.update_niveaux();
    if (img) {
      miniatures_brightness.update_detail();
      miniatures_brightness.draw_miniature();
    }
    slider_brightness.update_sliders();
    
  }
  

  p.mouseReleased = function() {
    p.fill(240);
    p.rect(0, 0, p.width, p.height);
    selected_slider = -1;
    selected_niveau = -1;
    
    niveaux_brightness.update_niveaux();
    if (img) {
      miniatures_brightness.update_detail();
      miniatures_brightness.draw_miniature();
    }
    slider_brightness.update_sliders();
    
  };
        
  });



}

function make_miniatures() { 
  if (img && window.miniatures) {
    img_miniature = img.get();
    window.miniatures.make_miniature(img_miniature);
    window.miniatures.update_detail();
  }
}