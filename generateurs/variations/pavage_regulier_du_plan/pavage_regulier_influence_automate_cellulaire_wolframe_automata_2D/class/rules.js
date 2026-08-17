class Rules{
    constructor(nb_bits) {
        this.nb_bits = nb_bits;

        this.rules_set = []; // tableau contenant les règles en vigueur
        this.rules_set_index = [];
        
        this.ranked_rule = Array.from({ length: nb_bits + 1 }, () => []);  //initialisation du tableau contenantn les tableaux de règles
        this.nb_rules = 1 << nb_bits; // calcul du nombre de règle en foncion du nombre de bit
        this.make_ramp(); // à l'appelle de la classe on créer la ramp
    }

    // on trie les règles par nombre de bits de 1
    make_ramp() {
        for (let i = 0; i < this.nb_rules; i++) {
            let bits1 = i.toString(2).split('').filter(bit => bit === '1').length;
            this.ranked_rule[bits1].push(i);
        }
        console.log('make_rampe : ranked_rules',this.ranked_rule);
    }
    // on définis des règles aux hasard
    define_rules(){
        this.rules_set = []; // on vide le tableau des règles en vigueur
        
        for (let i = 0; i < this.nb_bits+ 1; i++) {
            let current_rule_set = this.ranked_rule[i]; // on récupère le tableau de la règle i
            let random_index = Math.floor(Math.random() * current_rule_set.length); // on choisit un index au hasard dans le tableau
            let rule = current_rule_set[random_index]; // on récupère la règle à l'index choisi
            
            this.rules_set_index.push(random_index); // on ajoute l'index au tableau des index
            this.rules_set.push(rule); // on ajoute la règle à la liste des règles en vigueur
        }
        console.log('define rules : rules_set:',this.ranked_rule);
        console.log('define rules : rules_set_index:',this.rules_set_index);
    }
    // n correspond à la règle à changé (nb de bits), saut correspond à l'incrémentation de l'index
    next_rule(n, saut) {
        let current_rule_set = this.ranked_rule[n]; // on récupere le tableau qui nous interesse (le tableau qui contient les regles qui renvoie n bits)
        let nextIndex = this.rules_set_index[n] + saut; // on récupere l'index de la règle actuelle et on l'incrémente de 1

        if (nextIndex >= current_rule_set.length) {
            nextIndex = 0; // on remet l'index à 0 si on dépasse la taille du tableau
        }
        if (nextIndex < 0) {
            nextIndex = current_rule_set.length - 1; // on remet l'index à la fin du tableau si on est en dessous de 0
        }
        let rule = current_rule_set[nextIndex]; // on récupère la nouvelle règle à l'index +1
        
        this.rules_set[n] = rule; // on met à jour la règle
        this.rules_set_index[n] = nextIndex; // on met à jour l'index
        console.log('regle pour', n,'bits de 1:', rule);
    }
    // renvoie la rule en fonction de l'index
    get_rule(n) {
        return this.rules_set[n];
    }
}


