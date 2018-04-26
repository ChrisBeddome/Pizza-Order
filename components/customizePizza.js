//this component is responsible for customizing a new pizza and adding it to the order

var template = `
<div id='customizePizza'>

    <h3>Customize Your Pizza</h3>
    
    <div id='pizzaOptions' v-if='options'>

        <label for='sizeSelect'>Size: </label>
        <select class='optionSelect' v-model='selectedSize' id='sizeSelect'>
            <option v-for='size in options.size' v-bind:value='{sizeID : size.sizeID, size_type: size.size_type}'>{{size.size_type}}</option>
        </select>

        <label for='doughSelect'>Crust: </label>
        <select class='optionSelect' v-model='selectedDough' id='doughSelect'>
            <option v-for='dough in options.dough' v-bind:value='{doughID : dough.doughID, dough_type: dough.dough_type}'>{{dough.dough_type}}</option>
        </select>

        <label for='sauceSelect'>Sauce: </label>
        <select class='optionSelect' v-model='selectedSauce' id='sauceSelect'>
            <option v-for='sauce in options.sauce' v-bind:value='{sauceID : sauce.sauceID, sauce_type: sauce.sauce_type}'>{{sauce.sauce_type}}</option>
        </select>

        <label for='cheeseSelect'>Cheese: </label>
        <select class='optionSelect' v-model='selectedCheese' id='cheeseSelect'>
            <option v-for='cheese in options.cheese' v-bind:value='{cheeseID : cheese.cheeseID, cheese_type: cheese.cheese_type}'>{{cheese.cheese_type}}</option>
        </select>
    </div>

    <div id='toppingContainer'>
        <div class='toppingChoice' v-for='topping in options.toppings'>
            <label>
                <input v-model='selectedToppings' name='toppings' type='checkbox' v-bind:value='{toppingID : topping.toppingID, topping_name: topping.topping_name}'
                /> {{topping.topping_name}}
            </label>
        </div>
    </div>

    <div id='buttonContainer'>
        <button class='subBtn' v-on:click='addPizza'>Add Pizza To Order</button>
        <button class='subBtn' v-on:click='discardPizza'>Discard Pizza</button>
    </div>

</div>
`;

Vue.component('customizePizza', {
  template: template,
  props: [],
  data: function () {
    return {
      options: null,
      selectedSize: null,
      selectedDough: null,
      selectedSauce: null,
      selectedCheese: null,
      selectedToppings: null
    }
  },

  methods: {
    discardPizza: function () {
      this.$emit("discardPizza");
    },

    addPizza: function () {
      this.$emit("clearErrors");
      if (this.selectedToppings.length > 7) {
        this.$emit("customizeError", "Maximum toppings exceeded, please select 7 or less toppings");
        return;
      }

      var newPizza = {
        size: this.selectedSize,
        dough: this.selectedDough,
        sauce: this.selectedSauce,
        cheese: this.selectedCheese,
        toppings: this.selectedToppings
      }

      this.$emit("addPizza", newPizza);
    }
  },

  created: function () {
    $.get("includes/getPizzaOptions.php",
      function (response, status) {
        var response = JSON.parse(response);
        if (response.success) {
          this.selectedSize = response.options.size[0];
          this.selectedDough = response.options.dough[0];
          this.selectedSauce = response.options.sauce[0];
          this.selectedCheese = response.options.cheese[0];
          this.selectedToppings = [];
          this.options = response.options;
        } else {
          this.$emit("customizeError", response.message);
        }
      }.bind(this));
  }

});