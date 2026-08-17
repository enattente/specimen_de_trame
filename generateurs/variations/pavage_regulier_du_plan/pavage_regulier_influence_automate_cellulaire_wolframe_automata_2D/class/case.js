class Case {
  constructor({x=0, y=0, size=10, rules=null, value=0} = {}) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.rules = rules;
      this.value = value; 

      this.state;
    }
  // permet défnir le state de chaque case selon rules et leur value, et les trois cases du dessus
  generate(left, mid, right) {
      // 1. Gestion des cas aux bords (si une case n'existe pas)
      left = left ?? 0;
      mid = mid ?? 0;
      right = right ?? 0;
  
      // 2. Formation de la clé binaire
      let key = '' + left + mid + right;
  
      // 3. Récupération de la règle
      let rule = this.rules.get_rule(this.value);
  
      // 4. Conversion en binaire avec padding
      let index = parseInt(key, 2);
      let ruleBits = rule.toString(2).padStart(8, '0');
  
      // 5. Lecture du bit
      let bit = ruleBits[7 - index];
  
      this.state = parseInt(bit);
  }   
  // dessine chaque pixel sur le buffer
  draw_on_buffer(buffer) {
      let colorVal = this.state > 0 ? 0 : 255;
      for (let dx = 0; dx < this.size; dx++) {
        for (let dy = 0; dy < this.size; dy++) {
          let px = this.x + dx;
          let py = this.y + dy;
    
          if (px < buffer.width && py < buffer.height) {
            let index = 4 * (px + py * buffer.width);
            buffer.pixels[index + 0] = colorVal; // R
            buffer.pixels[index + 1] = colorVal; // G
            buffer.pixels[index + 2] = colorVal; // B
            buffer.pixels[index + 3] = 255;      // Alpha
          }
        }
      }
  }
 // retourne le state de la case
  get_state() {
    return this.state;
  }
}
