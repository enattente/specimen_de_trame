class Registre_Generations {
    /**
     * Crée une instance de Registre_Generations.
     * @param {number} [profondeur_memoire=2] - La profondeur de mémoire souhaitée pour les générations.                                     
     */
    constructor(profondeur_memoire = 2) {
        this.profondeur_memoire = profondeur_memoire;
        // Structure de l'arbre : arbre[0] = génération la plus récente, arbre[1] = génération précédente, etc.
        this.arbre = [];
        
        // Initialiser avec des tableaux vides pour chaque génération possible
        for (let i = 0; i < this.profondeur_memoire; i++) {
            this.arbre.push([]);
        }
    }
  
    // Ajoute un élément à une génération spécifique.
    add_child(element, generation = 0) {
        // Vérification que la génération demandée est valide
        if (generation < 0 || generation >= this.profondeur_memoire) {
            console.error(`Génération ${generation} invalide (doit être entre 0 et ${this.profondeur_memoire - 1})`);
            return false;
        }
        
        // Ajouter l'élément à la génération spécifiée
        this.arbre[generation].push(element);
        return true;
    }
  
    // Crée une nouvelle génération et décale toutes les autres.
    next_generation() {
        // Insérer une nouvelle génération vide au début
        this.arbre.unshift([]);
        
        // Supprimer la dernière génération si on dépasse la profondeur mémoire
        if (this.arbre.length > this.profondeur_memoire) {
            this.arbre.pop();
        }
        
        // Afficher l'état actuel pour le débogage
        console.log("État des générations après next_generation:");
        for (let i = 0; i < this.arbre.length; i++) {
            console.log(`Génération ${i}: ${this.arbre[i].length} éléments`);
        }
    }

  
    // Obtient les éléments d'une génération spécifique.
    get_parent(generation = 0) {
        if (generation < 0 || generation >= this.arbre.length) {
            console.warn(`Génération ${generation} non disponible`);
            return [];
        }
        
        return this.arbre[generation];
    }

    // Réinitialise toutes les générations.
    reset() {
        this.arbre = [];
        for (let i = 0; i < this.profondeur_memoire; i++) {
            this.arbre.push([]);
        }
    }
}