class Rules{
    constructor({map, rules_max=0, rules_min=0} = {}) {
        
        
        this.rules_max = rules_max;
        this.rules_min = rules_min;
        this.map = map;
        this.nb_rules = this.map.nb_value;

        this.all_rules = []; // tableau contenant les règles en vigueur
        this.set_by_default_ramp(); // à l'appelle de la classe on créer la ramp

    }


    // génère une valeur pour une règle en fonction de l'index et du nombre total de règles
    _generate_default_rule_value(index, total_rules) {
        return int(map((total_rules - index - 1), 0, total_rules - 1, this.rules_min, this.rules_max));
    }
    //  applique la methode _generate_default_rule_value à chaque règle
    set_by_default_ramp() {
        this.all_rules = []; // on vide le tableau
        for (let i = 0; i < this.nb_rules; i++) {
            let rule = this._generate_default_rule_value(i, this.nb_rules);
            this.all_rules.push(rule); // on ajoute la valeur à la liste des règles
        }  
    console.log('set_by_default_ramp: all_rules:',this.all_rules);
    }


    // change le nombre de règles
    update_nb_rules(new_nb_rules){
        const current_nb_rules = this.nb_rules;
        this.nb_rules = new_nb_rules;  

        if (new_nb_rules < current_nb_rules) {
            this.all_rules.length = new_nb_rules;
        } else if (new_nb_rules > current_nb_rules) {
            for (let i = current_nb_rules; i < new_nb_rules; i++) {
                this.all_rules.push(this._generate_default_rule_value(i, new_nb_rules));
            }
        }
        console.log('update_nb_rules: all_rules:', this.all_rules);
        this.set_by_default_ramp();
    }
    // change l'intervalle de valeur des règles 
    update_intervalle_rules(rules_max=0, rules_min=0){
        this.rules_max = rules_max;
        this.rules_min = rules_min;
        this.set_by_default_ramp();
    }
    // on change la valeur d'une règle
    update_one_rule(n, new_value) {
        if (n >= 0 && n < this.all_rules.length) {
            this.all_rules[n] = new_value; // on change la valeur de la règle
        } else {
            console.warn(`Index de règle invalide: ${n}`);
        }
    }


   
    // renvoie la rule en fonction de l'index
    get_rule(n) {
        if (n >= 0 && n < this.all_rules.length) {
            return this.all_rules[n];
        } else {
            console.warn(`Index de règle invalide pour get_rule: ${n}. Retourne 0 par défaut.`);
            return 0;
        }
    }
    // renvoie toutes les règles
    get_all_rules() {
        return this.all_rules;
    }
    // renvoie la rule en fonction de l'index
    get_rule(n) {
        return this.all_rules[n];
    }


}


 