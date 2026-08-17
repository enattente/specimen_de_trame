function init_interface_seuil() {
  // création des objets 
  console.log('init_interface_seuil');

  // Variables globales pour stocker les objets de l'interface
  let slider_1, slider_2, niveaux_1, niveaux_2, miniatures_1, miniatures_2;

  // Première instance P5 pour les règles de luminosité
  new p5((p) => {
  
  let selected_slider_1 = -1;
  let selected_slider_2 = -1;
  let selected_niveau_1 = -1;
  let selected_niveau_2 = -1;

  let slider_x_start_1 , slider_y_start_1 , slider_x_end_1 , slider_y_end_1 ;
  let slider_x_start_2 , slider_y_start_2 , slider_x_end_2 , slider_y_end_2 ;

  let miniatures_x_left_1, miniatures_y_top_1, miniatures_x_right_1, miniatures_y_bottom_1;
  let miniatures_x_left_2, miniatures_y_top_2, miniatures_x_right_2, miniatures_y_bottom_2;

  let niveaux_x_left_1 , niveaux_y_top_1 , niveaux_x_right_1, niveaux_y_bottom_1 
  let niveaux_x_left_2 , niveaux_y_top_2 , niveaux_x_right_2, niveaux_y_bottom_2 


  p.setup = () => {
    let container = document.getElementById('interface-seuils-map_image');
    let w = container.offsetWidth;
    let h = container.offsetHeight;

    let cnv = p.createCanvas(w, h);
    p.background(240);
    cnv.parent('interface-seuils-map_image'); // Place le canvas dans le div prévu

    // definir les emplacement de miniature, seuil et niveaux
    miniatures_x_left_1 = 0;
    miniatures_y_top_1 = 0;
    miniatures_x_right_1 = p.width;
    miniatures_y_bottom_1 = p.height/4 ;

    miniatures_x_left_2 = 0;
    miniatures_y_top_2 = p.height/4 * 2;
    miniatures_x_right_2 = p.width;
    miniatures_y_bottom_2 = p.height/4 * 3;



    slider_x_start_1 = 0;
    slider_y_start_1 = p.height/4;
    slider_x_end_1 = p.width;
    slider_y_end_1 = p.height/4 ;

    slider_x_start_2 = 0;
    slider_y_start_2 = p.height/4 * 3;
    slider_x_end_2 = p.width;
    slider_y_end_2 = p.height/4 * 3;


    niveaux_x_left_1 = 0, 
    niveaux_y_top_1 = p.height/4, 
    niveaux_x_right_1 = p.width, 
    niveaux_y_bottom_1 = p.height/4 * 2;

    niveaux_x_left_2 = 0;
    niveaux_y_top_2 = p.height/4 *3;
    niveaux_x_right_2 = p.width;
    niveaux_y_bottom_2 = p.height;


    // definir les objet 
    slider_1 = new SliderBar(p, slider_x_start_1, slider_y_start_1, slider_x_end_1, slider_y_end_1, map_image_brightness );
    slider_1.update_sliders();

    slider_2 = new SliderBar(p, slider_x_start_2, slider_y_start_2, slider_x_end_2, slider_y_end_2, map_image_detail, 0, 125);
    slider_2.update_sliders();

    niveaux_1 = new Niveau(p, niveaux_x_left_1, niveaux_y_top_1, niveaux_x_right_1, niveaux_y_bottom_1, rules_colors, map_image_brightness);
    niveaux_1.update_niveaux();

    niveaux_2 = new Niveau(p, niveaux_x_left_2, niveaux_y_top_2, niveaux_x_right_2, niveaux_y_bottom_2, rules_division, map_image_detail, 0, 125);
    niveaux_2.update_niveaux();


    miniatures_1 = new Miniatures(p, miniatures_x_left_1, miniatures_y_top_1, miniatures_x_right_1, miniatures_y_bottom_1, nb_value_colors, map_image_brightness, rules_colors, slider_1);
    miniatures_2 = new Miniatures(p, miniatures_x_left_2, miniatures_y_top_2, miniatures_x_right_2, miniatures_y_bottom_2, nb_value_colors, map_image_detail, rules_division, slider_2, 0, 125);
    
    // Sauvegarder la référence à l'objet miniatures pour make_miniatures()
    window.miniatures_1 = miniatures_1;
    window.miniatures_2 = miniatures_2;
  };

  p.mousePressed = function() {

    let sliders_1_positions = slider_1.get_position();
    let sliders_2_positions = slider_2.get_position();
    let niveaux_1_positions = niveaux_1.get_position();
    let niveaux_2_positions = niveaux_2.get_position();

    for (let i = 1; i < sliders_1_positions.length - 1; i++) {
      let x = sliders_1_positions[i].x;
      let y = sliders_1_positions[i].y;
      if (
        p.mouseY >= y - 38 &&
        p.mouseY <= y + 10 &&
        p.mouseX >= x - 10 &&
        p.mouseX <= x + 10
      ) {  
        selected_slider_1 = i;
        break;
      }
    }

    for (let i = 1; i < sliders_2_positions.length - 1; i++) {
      let x = sliders_2_positions[i].x;
      let y = sliders_2_positions[i].y;
      if (
        p.mouseY >= y - 38 &&
        p.mouseY <= y + 10 &&
        p.mouseX >= x - 10 &&
        p.mouseX <= x + 10
      ) {  
        selected_slider_2 = i;
        break;
      }
    }

    for (let i = 0; i < niveaux_1_positions.length ; i++) {
      let x = niveaux_1_positions[i].x;
      let largeur = niveaux_1_positions[i].largeur;
      if (
        p.mouseY >= niveaux_y_top_1 &&
        p.mouseY <= niveaux_y_bottom_1 &&
        p.mouseX >= x  &&
        p.mouseX <= x + largeur
      ) {  
        selected_niveau_1 = i;
        break;
      }
    }

    for (let i = 0; i < niveaux_2_positions.length ; i++) {
      let x = niveaux_2_positions[i].x;
      let largeur = niveaux_2_positions[i].largeur;
      if (
        p.mouseY >= niveaux_y_top_2 &&
        p.mouseY <= niveaux_y_bottom_2 &&
        p.mouseX >= x  &&
        p.mouseX <= x + largeur
      ) {  
        selected_niveau_2 = i;
        break;
      }
    }

   
  };

  p.mouseDragged = function() {
    p.fill(240);
    p.rect(0, 0, p.width, p.height);

    if (selected_slider_1 !== -1) {
      let x_clamped = p.constrain(p.mouseX, slider_x_start_1, slider_x_end_1);
      let value = p.map(x_clamped, slider_x_start_1, slider_x_end_1, 0, 255);
      value = p.int(value);
      map_image_brightness.change_one_seuil(selected_slider_1, value);
    }

    if (selected_slider_2 !== -1) {
      let x_clamped = p.constrain(p.mouseX, slider_x_start_2, slider_x_end_2);
      let value = p.map(x_clamped, slider_x_start_2, slider_x_end_2, 0, 125);
      value = p.int(value);
      map_image_detail.change_one_seuil(selected_slider_2, value);
    }



    if (selected_niveau_1 !== -1) {
      let y_clamped = p.constrain(p.mouseY, niveaux_y_top_1, niveaux_y_bottom_1);
      let value = p.map(y_clamped, niveaux_y_top_1, niveaux_y_bottom_1, rules_colors.rules_max, rules_colors.rules_min);
      value = p.int(value);
      rules_colors.update_one_rule(selected_niveau_1, value)  
    }

    if (selected_niveau_2 !== -1) {
      let y_clamped = p.constrain(p.mouseY, niveaux_y_top_2, niveaux_y_bottom_2);
      let value = p.map(y_clamped, niveaux_y_top_2, niveaux_y_bottom_2, rules_division.rules_max, rules_division.rules_min);
      value = p.int(value);
      rules_division.update_one_rule(selected_niveau_2, value)  
    }

  
    if (img) {
      miniatures_1.update_red();
      miniatures_1.draw_miniature();
      miniatures_2.update_detail();
      miniatures_2.draw_miniature();
    }
    niveaux_1.update_niveaux();
    niveaux_2.update_niveaux();
    slider_1.update_sliders();
    slider_2.update_sliders();
    
  }
  

  p.mouseReleased = function() {
    p.fill(240);
    p.rect(0, 0, p.width, p.height);
    selected_slider_1 = -1;
    selected_slider_2 = -1;
    selected_niveau_1 = -1;
    selected_niveau_2 = -1; 
    
    if (img) {
      miniatures_1.update_red();
      miniatures_1.draw_miniature();
      miniatures_2.update_detail();
      miniatures_2.draw_miniature();
    }
    niveaux_1.update_niveaux();
    niveaux_2.update_niveaux();
    slider_1.update_sliders();
    slider_2.update_sliders();
    
  };
        
  });



}

function make_miniatures() { 
  if (img && window.miniatures_1 && window.miniatures_2) {
    img_miniature = img.get();
    window.miniatures_1.make_miniature(img_miniature);
    window.miniatures_2.make_miniature(img_miniature);
    window.miniatures_1.update_red();
    window.miniatures_2.update_detail();
  }
}