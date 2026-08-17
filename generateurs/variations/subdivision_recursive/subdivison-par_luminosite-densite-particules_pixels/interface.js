function init_interface() {

  // Bouton pour charger de l'image
  const fileInput = document.getElementById('image-loader');
  
  // Créer un label pour afficher le nom du fichier
  const fileLabel = document.createElement('label');
  fileLabel.setAttribute('for', 'image-loader');
  fileLabel.className = 'file-label';
  fileLabel.textContent = 'Sélectionner un fichier';
  
  // Insérer le label juste après l'input
  fileInput.parentNode.insertBefore(fileLabel, fileInput.nextSibling);
  
  // Cacher l'input original
  fileInput.style.display = 'none';
  
  fileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    // Mettre à jour le texte du label avec le nom du fichier
    if (file) {
      fileLabel.textContent = file.name;
    } else {
      fileLabel.textContent = 'Sélectionner un fichier';
    }

    reader.onload = function (event) {
      // Charge l'image en base64, ET attends qu'elle soit complètement chargée avant de continuer
      img = loadImage(event.target.result, () => {
        console.log('✅ Image chargée !');
        init_image(); // Appelle la fonction pour initialiser l'image
        make_miniatures(); // Appelle la fonction pour initialiser les miniatures

        // Afficher l'image dans la div #image-display
        const imageDisplayDiv = document.getElementById('image-display');
        imageDisplayDiv.innerHTML = ''; // Vide le contenu précédent
        const imgElement = document.createElement('img');
        imgElement.src = event.target.result;
        imgElement.style.maxWidth = '100%'; // Assurez-vous que l'image ne dépasse pas la div
        imgElement.style.height = 'auto';
        imageDisplayDiv.appendChild(imgElement);

      });
   };
  
    if (file) {
      reader.readAsDataURL(file);
    } else {
      console.warn("⚠️ Aucun fichier sélectionné.");
    }
  });



  //////////////////////////////////////////////////////////////
  // controle parametre image
  //////////////////////////////////////////////////////////////


  // Step size width
  const stepWidthInput = document.getElementById('stepsize-width-input');
  stepWidthInput.value = stepsize_width;
  stepWidthInput.addEventListener('input', () => {
    stepsize_width = parseInt(stepWidthInput.value);
  });

  // Step size height
  const stepHeightInput = document.getElementById('stepsize-height-input');
  stepHeightInput.value = stepsize_height;
  stepHeightInput.addEventListener('input', () => {
    stepsize_height = parseInt(stepHeightInput.value);
  });

  // deep
  const deepInput = document.getElementById('deep-input');
  deepInput.value = deep;
  deepInput.addEventListener('input', () => {
    deep = parseInt(deepInput.value);
    rules_division.update_intervalle_rules(deep+1, 0);

  });

  // Nombre de règles
  const nbValueInput = document.getElementById('nb-value-input-brightness');
  nbValueInput.value = nb_value_colors;
  nbValueInput.addEventListener('input', () => {
    nb_value_colors = parseInt(nbValueInput.value); 
    map_image_brightness.update_nb_value(nb_value_colors);
    rules_nb_particules.update_nb_rules(nb_value_colors);
    rules_division.update_nb_rules(nb_value_colors);
    make_miniatures();
  });

  // nb particules max
  const nbParticulesMaxInput = document.getElementById('nb-particules-max-input');
  nbParticulesMaxInput.value = nb_particules_max;
  nbParticulesMaxInput.addEventListener('input', () => {
    nb_particules_max = parseInt(nbParticulesMaxInput.value);
    rules_nb_particules.update_intervalle_rules(nb_particules_max, nb_particules_min);
  });

 

  //////////////////////////////////////////////////////////////
  // controle parametre application
  //////////////////////////////////////////////////////////////

  // Nombre d'étapes
  const etapesInput = document.getElementById('etapes-input');
  etapesInput.value = etapes;
  etapesInput.addEventListener('input', () => {
    etapes = parseInt(etapesInput.value);
  });

  // Bouton reset la répartition des seuils 
  resetSeuilsBtn = document.getElementById('reset-seuils-btn');
  resetSeuilsBtn.addEventListener('click',() => {
    map_image_brightness.set_by_default_seuils();    
  });  

  // Bouton reset les reègles par défault
  resetRampBtn = document.getElementById('reset-rules-btn');
  resetRampBtn.addEventListener('click',() => {  
    rules_nb_particules.set_by_default_ramp();
  });  

  // Bouton reinitialiser l'image
  resetGenerationBtn = document.getElementById('generer-btn');
  resetGenerationBtn.addEventListener('click',() => {
    init_image();
  });

  saveBtn = document.getElementById("save-btn");
  saveBtn.addEventListener("click", () => Data.save_image(buffer));

  // Bouton pour save les parametre
  saveBtn = document.getElementById("save-btn-parametre");
  saveBtn.addEventListener("click", () => {
    Data.save_parametre(
      stepsize_width,
      stepsize_height,
      nb_value_colors,
      nb_value_nb_particules,
      nb_value_divisions,
      nb_value_state_vertical,
      nb_value_state_horizontal,
      map_image_brightness,
      rules_brightness,
      rules_colors,
      rules_nb_particules,
      rules_divisions,
      rules_state_vertical,
      rules_state_horizontal,
      registre_zones_visites,
      registre_generations,
      nb_particules_max,
      nb_particules_min,
      particule_pixel_width,
      particule_pixel_height,
      particule_ovale_width,
      particule_ovale_height,
      etapes
    );
  });
  
  // Bouton pour importer les paramètres
  const importBtn = document.getElementById("import-btn-parametre");
  const importInput = document.getElementById("import-parametre");
  
  importBtn.addEventListener("click", () => {
    importInput.click();
  });
  
  importInput.addEventListener("change", (event) => {
    Data.import_parametre(event, {
      updateStepWidth: (width) => {
        stepsize_width = width;
        document.getElementById('stepsize-width-input').value = width;
      },
      updateStepHeight: (height) => {
        stepsize_height = height;
        document.getElementById('stepsize-height-input').value = height;
      },
      updateValueColors: (colors) => {
        nb_value_colors = colors;
        document.getElementById('nb-value-input').value = colors;
        if (map_image_brightness) {
          map_image_brightness.update_nb_value(colors);
        }
      },
      updateNbValueParticulesEtc: (valeurs) => {
        nb_value_nb_particules = valeurs["Nb Particules"] || nb_value_nb_particules;
        nb_value_divisions = valeurs.Divisions || nb_value_divisions;
        nb_value_state_vertical = valeurs["State Vertical"] || nb_value_state_vertical;
        nb_value_state_horizontal = valeurs["State Horizontal"] || nb_value_state_horizontal;
      },
      updateMapsAndRules: (parametres) => {
        // Mise à jour des seuils des maps
        if (parametres["Seuils des maps"] && parametres["Seuils des maps"].Brightness && 
            parametres["Seuils des maps"].Brightness !== "Non disponible" && 
            map_image_brightness) {
          const seuils = parametres["Seuils des maps"].Brightness;
          map_image_brightness.update_nb_value(seuils.length - 1);
          for (let i = 0; i < seuils.length; i++) {
            map_image_brightness.change_one_seuil(i, seuils[i]);
          }
          console.log("✅ Seuils importés:", seuils);
        }
        
        // Mise à jour des règles - ÉTAPE 1: mise à jour de l'intervalle des règles
        if (parametres["Particules"]) {
          const max = parametres["Particules"]["Nombre max"];
          const min = parametres["Particules"]["Nombre min"];
          if (rules_nb_particules && max !== undefined && min !== undefined) {
            rules_nb_particules.update_intervalle_rules(max, min);
          }
        }

        // Définition des paires de règles et leurs objets correspondants
        const rulesMapping = [
          { name: "Brightness", object: rules_brightness },
          { name: "Colors", object: rules_colors },
          { name: "Nb Particules", object: rules_nb_particules },
          { name: "Divisions", object: rules_divisions },
          { name: "State Vertical", object: rules_state_vertical },
          { name: "State Horizontal", object: rules_state_horizontal }
        ];
        
        // Mise à jour de toutes les règles disponibles - ÉTAPE 2 et 3: mise à jour du nombre puis des valeurs
        if (parametres["Règles"]) {
          for (const rulePair of rulesMapping) {
            const ruleName = rulePair.name;
            const ruleObj = rulePair.object;
            
            if (parametres["Règles"][ruleName] && 
                parametres["Règles"][ruleName] !== "Non disponible" && 
                ruleObj) {
              const rules = parametres["Règles"][ruleName];
              
              // ÉTAPE 2: Mise à jour du nombre de règles
              ruleObj.update_nb_rules(rules.length);
              
              // ÉTAPE 3: Mise à jour des valeurs individuelles
              for (let i = 0; i < rules.length; i++) {
                ruleObj.update_one_rule(i, rules[i]);
              }
              
              console.log(`✅ Règles ${ruleName} importées:`, ruleObj.get_all_rules());
            }
          }
        }
      },
      updateParticuleParams: (particules) => {
        nb_particules_max = particules["Nombre max"] || nb_particules_max;
        nb_particules_min = particules["Nombre min"] || nb_particules_min;
        
        document.getElementById('nb-particules-max-input').value = nb_particules_max;
        document.getElementById('nb-particules-min-input').value = nb_particules_min;
        
        if (particules["Taille Pixel"]) {
          particule_pixel_width = particules["Taille Pixel"].Width || particule_pixel_width;
          particule_pixel_height = particules["Taille Pixel"].Height || particule_pixel_height;
          
          document.getElementById('particle-width-input').value = particule_pixel_width;
          document.getElementById('particle-height-input').value = particule_pixel_height;
        }
        
        if (particules["Taille Ovale"]) {
          particule_ovale_width = particules["Taille Ovale"].Width || particule_ovale_width;
          particule_ovale_height = particules["Taille Ovale"].Height || particule_ovale_height;
        }
      },
      updateEtapes: (nbEtapes) => {
        etapes = nbEtapes;
        document.getElementById('etapes-input').value = etapes;
      },
      refreshMiniatures: () => {
        if (typeof make_miniatures === 'function') {
          make_miniatures();
        }
      },
      reinitImage: () => {
        if (img) {
          init_image();
        }
      }
    });
  });
}


