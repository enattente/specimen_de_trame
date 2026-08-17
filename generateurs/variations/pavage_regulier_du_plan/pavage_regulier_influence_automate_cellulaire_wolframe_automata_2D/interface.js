function init_interface() {
  // Bouton pour charger de l'image
  document.getElementById('image-loader').addEventListener('change', function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      // Charge l'image en base64, ET attends qu'elle soit complètement chargée avant de continuer
      img = loadImage(event.target.result, () => {
        console.log('✅ Image chargée !');
        
        init_image();
        make_miniatures();
      });
   };
  
    if (file) {
      reader.readAsDataURL(file);
    } else {
      console.warn("⚠️ Aucun fichier sélectionné.");
    }
  });

  // Bouton pour gerer stepsize
  // minusBtn = document.getElementById('stepsize-minus');
  // minusBtn.addEventListener('click', () => {
  //   stepsize -= 0.1;
  //   valueSpan.textContent = stepsize;
  // });
   // plusBtn = document.getElementById('stepsize-plus');
  // plusBtn.addEventListener('click', () => {
  //   stepsize++;
  //   valueSpan.textContent = stepsize;
  // });

  // valueSpan = document.getElementById('stepsize-value');
  // valueSpan.textContent = stepsize;


  stepsizeInput = document.getElementById('stepsize-input');
  stepsizeInput.addEventListener('input', () => {
  stepsize = parseFloat(stepsizeInput.value);
  console.log('Nouvelle valeur de stepsize :', stepsize);
  });

  scaleFactor = document.getElementById('scale-factor-input');
  scaleFactor.addEventListener('input', () => {
  scale_factor = parseFloat(scaleFactor.value);
  console.log('Nouvelle valeur de scale_factor :', scale_factor);
  }  );

 


  // Bouton pour gerer les rules 
  for (let n = 1; n <= 7; n++) {
    const ruleValSpan = document.getElementById(`rule${n}-value`);
    const ruleBitsSpan = document.getElementById(`rule${n}-value-bits`);
    const plusBtn = document.getElementById(`rules${n}-button-plus`);
    const minusBtn = document.getElementById(`rules${n}-button-moins`);

    // Fonction d'affichage propre à chaque n
    function update_display_rules() {
    const rule = rules.get_rule(n);
    const binary = rule.toString(2).padStart(8, '0');
    const formatted = binary.split('').map(b => `_${b}_`).join(' ');
    ruleValSpan.textContent = rule;
    ruleBitsSpan.textContent = formatted;
    }

    plusBtn.addEventListener('click', () => {
    rules.next_rule(n, +1);
    update_display_rules();
    });

    minusBtn.addEventListener('click', () => {
    rules.next_rule(n, -1);
    update_display_rules();
    });

    update_display_rules(); // Initial display
  }

  for (let n = 1; n <= 7; n++) {
    const ruleValSpan = document.getElementById(`rule-horizontal${n}-value`);
    const ruleBitsSpan = document.getElementById(`rule-horizontal${n}-value-bits`);
    const plusBtn = document.getElementById(`rule-horizontals${n}-button-plus`);
    const minusBtn = document.getElementById(`rule-horizontals${n}-button-moins`);

    // Fonction d'affichage propre à chaque n
    function update_display_rules() {
    const rule = rules.get_rule(n);
    const binary = rule.toString(2).padStart(8, '0');
    const formatted = binary.split('').map(b => `_${b}_`).join(' ');
    ruleValSpan.textContent = rule;
    ruleBitsSpan.textContent = formatted;
    }

    plusBtn.addEventListener('click', () => {
    rules.next_rule(n, +1);
    update_display_rules();
    });

    minusBtn.addEventListener('click', () => {
    rules.next_rule(n, -1);
    update_display_rules();
    });

    update_display_rules(); // Initial display
  }
  


  // Bouton reinitialiser l'image
  restartBtn = document.getElementById('generer-btn');
  restartBtn.addEventListener('click',() => {
    init_image(); 
  });

  startRecordBtn = document.getElementById("start-record-btn");
  startRecordBtn.addEventListener("click", () => Data.startRecord(buffer));

  stopRecordBtn = document.getElementById("stop-record-btn");
  stopRecordBtn.addEventListener("click", () => Data.stopRecord(buffer));

  // Bouton pour save l'image
  saveBtn = document.getElementById("save-btn");
  saveBtn.addEventListener("click", save_image,);

  // Batch process
  const batchInput = document.getElementById("batch-folder");
  const batchStart = document.getElementById("batch-start");

  batchStart.addEventListener("click", () => {
      if (!batchInput.files.length) {
          alert("Sélectionne d’abord un dossier contenant des images !");
          return;
      }

      Data.startBatch(batchInput.files);
  });


  
}


function wait_image_loaded() {
  if (img && img.width > 0 && img.height > 0) {
    init_image();
    make_miniatures();
  } else {
    setTimeout(wait_image_loaded, 10);
  }
}
