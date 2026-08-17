class Data {

  static frames = [];
  static buffer = null;
  static recording = false;

  constructor() {
    // Initialisation si nécessaire
  }

  static save_image(buffer) {
    // Récupérer la date du jour au format YYYYMMDD
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0
    const day = String(today.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
  
    // Récupérer le nom de la page HTML
    const pageTitle = document.title || "no_title";
  
    // Récupérer le nom de l'image tramée (originale)
    const fileInput = document.getElementById('image-loader');
    let originalFileName = "no_image";
    if (fileInput && fileInput.files.length > 0) {
      originalFileName = fileInput.files[0].name;
      // Supprimer l'extension du nom de fichier original
      const lastDotIndex = originalFileName.lastIndexOf('.');
      if (lastDotIndex > -1) {
        originalFileName = originalFileName.substring(0, lastDotIndex);
      }
    }
  
    // Construire le nom du fichier avec les informations demandées
    // Format: titre_page_nom_img_trame_stepwidth.jpg
    const filename = `${pageTitle}_${originalFileName}_${stepsize}.jpg`;
    buffer.save(filename);
  }

  static save_parametre(
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
    etapes,
    type_particule = "rectangle"
  ) {
    // Récupérer le nom de l'image depuis le file input
    const fileInput = document.getElementById('image-loader');
    const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : "Aucune image";
    
    // Récupérer tous les paramètres
    const parametres = {
      "Nom de l'image": fileName,
      "Taille des steps": {
        "Width": stepsize_width,
        "Height": stepsize_height
      },
      "Nombre de valeurs": {
        "Colors": nb_value_colors,
        "Nb Particules": nb_value_nb_particules,
        "Divisions": nb_value_divisions,
        "State Vertical": nb_value_state_vertical,
        "State Horizontal": nb_value_state_horizontal
      },
      "Seuils des maps": {
        "Brightness": map_image_brightness ? map_image_brightness.get_seuils() : "Non disponible"
      },
      "Règles": {
        "Brightness": rules_brightness ? rules_brightness.get_all_rules() : "Non disponible",
        "Colors": rules_colors ? rules_colors.get_all_rules() : "Non disponible",
        "Nb Particules": rules_nb_particules ? rules_nb_particules.get_all_rules() : "Non disponible",
        "Divisions": rules_divisions ? rules_divisions.get_all_rules() : "Non disponible",
        "State Vertical": rules_state_vertical ? rules_state_vertical.get_all_rules() : "Non disponible",
        "State Horizontal": rules_state_horizontal ? rules_state_horizontal.get_all_rules() : "Non disponible"
      },
      "Registres": {
        "Zones Visitées": registre_zones_visites ? "Disponible" : "Non disponible",
        "Générations": registre_generations ? "Disponible" : "Non disponible"
      },
      "Particules": {
        "Nombre max": nb_particules_max,
        "Nombre min": nb_particules_min,
        "Type": type_particule,
        "Taille Pixel": {
          "Width": particule_pixel_width,
          "Height": particule_pixel_height
        },
        "Taille Ovale": {
          "Width": particule_ovale_width,
          "Height": particule_ovale_height
        }
      },
      "Génération": {
        "Nombre d'étapes": etapes
      }
    };
    
    // Convertir en JSON formaté
    const parametresTexte = JSON.stringify(parametres, null, 2);
    
    // Créer un Blob avec le contenu
    const blob = new Blob([parametresTexte], { type: 'text/plain' });
    
    // Créer un URL pour le Blob
    const url = URL.createObjectURL(blob);
    
    // Créer un élément a pour le téléchargement
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parametres_pavage_' + new Date().toISOString().slice(0, 10) + '.txt';
    
    // Ajouter l'élément au document, cliquer dessus, puis le supprimer
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Libérer l'URL
    URL.revokeObjectURL(url);
  }

  static import_parametre(event, callbacks) {
    const {
      updateStepWidth,
      updateStepHeight,
      updateValueColors,
      updateNbValueParticulesEtc,
      updateMapsAndRules,
      updateParticuleParams,
      updateEtapes,
      refreshMiniatures,
      reinitImage
    } = callbacks;

    const file = event.target.files[0];
    if (!file) {
      console.warn("⚠️ Aucun fichier sélectionné.");
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        const parametres = JSON.parse(e.target.result);
        
        // Mise à jour des valeurs de steps
        if (parametres["Taille des steps"]) {
          const width = parametres["Taille des steps"].Width;
          const height = parametres["Taille des steps"].Height;
          updateStepWidth(width);
          updateStepHeight(height);
        }
        
        // Mise à jour des nombres de valeurs
        if (parametres["Nombre de valeurs"]) {
          const colors = parametres["Nombre de valeurs"].Colors;
          updateValueColors(colors);
          
          // Mise à jour des autres valeurs
          updateNbValueParticulesEtc(parametres["Nombre de valeurs"]);
        }
        
        // Mise à jour des maps et règles
        updateMapsAndRules(parametres);
        
        // Mise à jour des paramètres de particules
        if (parametres["Particules"]) {
          updateParticuleParams(parametres["Particules"]);
        }
        
        // Mise à jour du nombre d'étapes
        if (parametres["Génération"] && parametres["Génération"]["Nombre d'étapes"]) {
          updateEtapes(parametres["Génération"]["Nombre d'étapes"]);
        }
        
        // Rafraîchir les miniatures et l'interface
        refreshMiniatures();
        
        // Créer une notification pour l'utilisateur
        Data.showNotification('✅ Paramètres importés avec succès !', 'success');
        
        // Vider la liste de particules pour éviter les doublons
        if (typeof Particule !== 'undefined' && Particule.resetAllParticules) {
          Particule.resetAllParticules();
        }
        
        // Si une image est déjà chargée, on peut relancer la génération
        reinitImage();
        
      } catch (error) {
        console.error('❌ Erreur lors du parsing du fichier JSON:', error);
        Data.showNotification('❌ Erreur lors de l\'importation des paramètres !', 'error');
      }
    };
    
    reader.readAsText(file);
  }

  static showNotification(message, type = 'success') {
    // Créer une notification
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '10px 20px';
    notification.style.backgroundColor = type === 'success' ? '#4CAF50' : '#F44336';
    notification.style.color = 'white';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '9999';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Supprimer la notification après 3 secondes
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }




  static startRecord() {
    this.frames = [];
    this.recording = true;
  }

  /**
   * Capture une frame (appelé dans draw)
   */
  static captureFrame(buffer) {
    if (this.recording && buffer) {
      const dataUrl = buffer.canvas.toDataURL('image/jpeg', 0.8);
      this.frames.push(dataUrl);
    }
  }

  /**
   * Arrête l'enregistrement et télécharge un .zip avec toutes les frames
   */
  static stopRecord() {
    if (!this.recording || this.frames.length === 0) return;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    const pageTitle = document.title || "no_title";

    const fileInput = document.getElementById('image-loader');
    let originalFileName = "no_image";
    if (fileInput && fileInput.files.length > 0) {
      originalFileName = fileInput.files[0].name;
      const lastDotIndex = originalFileName.lastIndexOf('.');
      if (lastDotIndex > -1) {
        originalFileName = originalFileName.substring(0, lastDotIndex);
      }
    }

    const filenameBase = `${pageTitle}_${originalFileName}_${stepsize}_${dateString}`;
    const zip = new JSZip();

    this.frames.forEach((dataUrl, index) => {
      const base64 = dataUrl.split(',')[1];
      const frameName = `frame_${index.toString().padStart(3, '0')}.jpg`;
      zip.file(frameName, base64, { base64: true });
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = `${filenameBase}.zip`;
      a.click();
    });

    // Nettoyage
    this.recording = false;
    this.frames = [];
    this.buffer = null;
  }


static async startBatch(files) {
    const zip = new JSZip();
    const pageTitle = document.title || "batch";

    for (let file of files) {
        if (!file.type.startsWith("image/")) continue;

        const imgData = await fileToDataURL(file);

        await new Promise((resolve) => {

            img = loadImage(imgData, async () => {

                // --- INIT IMAGE (identique à init_image) ---
                background(220);

                img.loadPixels();
                img.resize(img.width * scale_factor, img.height * scale_factor);

                define_first_generation();

                // Créer buffer final
                buffer = createImage(img.width, img.height);
                buffer.loadPixels();

                // Brightness maps
                map_image_vertical.make_value_map(img, stepsize);
                value_map_vertical = map_image_vertical.get_value_map();

                map_image_horizontal.make_value_map(img, stepsize);
                value_map_horizontal = map_image_horizontal.get_value_map();

                // Créer Cases
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

                // --- TRAMAGE FINAL SANS i, SANS FRAMES, EN UN SEUL CALCUL ---

                let prev = first_generation.slice();
                let next = [];

                for (let y = 0; y < cases.length; y++) {

                    for (let x = 0; x < cases[y].length; x++) {
                        let portion = cases[y][x];

                        portion.generate(
                            prev[x - 1] ?? 0,
                            prev[x] ?? 0,
                            prev[x + 1] ?? 0
                        );

                        portion.draw_on_buffer(buffer);
                        next.push(portion.get_state());
                    }

                    prev = next.slice();
                    next.length = 0;
                }

                buffer.updatePixels();

                // --- EXPORT ---
                const dataUrl = buffer.canvas.toDataURL("image/jpeg", 0.9);
                const base64 = dataUrl.split(",")[1];

                const cleanName = file.name.replace(/\.[^.]*$/, "");
                const filename = `${pageTitle}_${cleanName}_${stepsize}.jpg`;

                zip.file(filename, base64, { base64: true });

                resolve();
            });

        });
    }

    const content = await zip.generateAsync({ type: "blob" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = `batch_tramage_${Date.now()}.zip`;
    a.click();

    Data.showNotification("Batch terminé !");
}

}

function fileToDataURL(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}