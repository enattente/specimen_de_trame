class Registre_Area_Visited {
  /**
   * Constructeur de la classe Registre_Area_Visited.
   * @param {number} maxVisited - Le nombre maximum de zones visitées à stocker. Par défaut à 3000.
   */
  constructor(maxVisited = 3000) {
    this.visited_area_set = new Set();     // Pour vérification rapide des collisions
    this.visited_area_queue = [];          // Pour garder l'ordre d'ajout
    this.maxVisited = maxVisited;          // Limite du nombre de zones stockées
  }

  add_visited_area(x, y) {
    const key = (x << 16) | y; // Combiner x et y dans un seul nombre
    if (!this.visited_area_set.has(key)) {
      this.visited_area_set.add(key);
      this.visited_area_queue.push(key);

      // Limiter la taille à maxVisited
      if (this.visited_area_queue.length > this.maxVisited) {
        const oldestKey = this.visited_area_queue.shift(); // Retire le plus ancien
        this.visited_area_set.delete(oldestKey);
      }
    }
  }

  // retourne true si la zone est déja visitée
  verify_collision_between_area(x, y) {
    const key = (x << 16) | y;
    return this.visited_area_set.has(key);
  }

  update_profondeur_memoire(profondeur_memoire) {
    this.maxVisited = profondeur_memoire;
  }

  // réinitialise le registre
  reset() {
    this.visited_area_set.clear();
    this.visited_area_queue = [];
  }
}
