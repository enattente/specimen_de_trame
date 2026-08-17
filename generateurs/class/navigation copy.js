class Navigation {
    constructor(registre) {
        
        this.registre = registre; // Instance de Registre pour vérifier les collisions

        this.itineraires = [];
        this.nb_child = [];
        
        this.destinations = [];
        
    }

    define_size(x_size, y_size){
        this.x_size = x_size;
        this.y_size = y_size;
    }

    update_itineraires(destinations_x, destinations_y){
        this.itineraires = []; // Réinitialiser les itinéraires
        for (let i = 0; i < destinations_x.length; i++) {
            this.itineraires.push({ x: destinations_x[i], y: destinations_y[i]});
        }
    }


    get_itineraire_result(x, y, map) {
        let map_image = map.get_value_map();
        this.destinations = []; // Réinitialiser

        for (let i = 0; i < this.itineraires.length; i++) {
            let x_destination = x + this.itineraires[i].x;
            let y_destination = y + this.itineraires[i].y;

            // Vérifie que les coordonnées sont dans les limites de la carte
            if (
                y_destination >= 0 && y_destination < map_image.length -1 &&
                x_destination >= 0 && x_destination < map_image[0].length -1
            ) {
                let destination_value = map_image[y_destination][x_destination];
                this.destinations.push({
                    x: x_destination,
                    y: y_destination,
                    value: destination_value
                });
            }
        }

        // Trie les destinations selon leur valeur (sombre vers clair)
        this.destinations = this.destinations.sort((a, b) => a.value - b.value);

        // Recherche de la première destination valide
        for (let i = 0; i < this.destinations.length; i++) {
            let dest = this.destinations[i];

            if (
                !this.registre.verify_collision_between_area(dest.x, dest.y) &&
                dest.x > 0 && dest.x < this.x_size &&
                dest.y > 0 && dest.y < this.y_size
            ) {
                return { x: dest.x, y: dest.y };
            }
        }

        return false; // Si aucune destination valide n'est trouvée
    }


    
    get_itineraire_result_detail(x, y, map) {
        let map_image = map.get_value_map();
        this.destinations = []; // Réinitialiser

        for (let i = 0; i < this.itineraires.length; i++) {
            let x_destination = x + this.itineraires[i].x;
            let y_destination = y + this.itineraires[i].y;

            // Vérifie que les coordonnées sont dans les limites de la carte
            if (
                y_destination >= 0 && y_destination < map_image.length -1 &&
                x_destination >= 0 && x_destination < map_image[0].length -1
            ) {
                let destination_value = map_image[y_destination][x_destination];
                this.destinations.push({
                    x: x_destination,
                    y: y_destination,
                    value: destination_value
                });
            }
        }

        // Trie les destinations selon leur valeur (sombre vers clair)
        this.destinations = this.destinations.sort((a, b) => b.value - a.value);

        // Recherche de la première destination valide
        for (let i = 0; i < this.destinations.length; i++) {
            let dest = this.destinations[i];

            if (
                !this.registre.verify_collision_between_area(dest.x, dest.y) &&
                dest.x > 0 && dest.x < this.x_size &&
                dest.y > 0 && dest.y < this.y_size
            ) {
                return { x: dest.x, y: dest.y };
            }
        }

        return false; // Si aucune destination valide n'est trouvée
    }


    get_itineraires(){
        return this.itineraires;
    }




    update_nb_child (nb_childs, probas){
        this.nb_child = []; // Réinitialiser les nb_child
        for (let i = 0; i < probas.length; i++) {
            this.nb_child.push({ childs: nb_childs[i], proba: probas[i] });
        }
    }

    get_nb_child_result(){
        let nb_childs = this.pick_by_proba(this.nb_child);
        return nb_childs.childs;
    }

    get_nb_child(){
        return this.nb_child;
    }

    pick_by_proba(liste) {
        const total = liste.reduce((acc, item) => acc + item.proba, 0);
        let r = Math.random() * total;

        for (let item of liste) {
            r -= item.proba;
            if (r <= 0) {
                return item;
            }
        }

        // Sécurité : retourne le dernier élément en cas d'arrondi flottant
        return liste[liste.length - 1];
    }
   
}

