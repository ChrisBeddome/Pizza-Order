//this component is responsible for initializing an new pizza, removing pizzas from the order, and submitting the order.

var template = `
<div id='pizzaManagement'>

    <h3>Order Overview</h3>

    <ul>
        <li v-for='pizza in pizzas' class='pizzaLI'>
            <p class="noMargin">
                <span class='toppingLabel'>Size: </span>{{pizza.size.size_type}}</p>

            <p class="noMargin">
            <span class='toppingLabel'>Crust: </span>{{pizza.dough.dough_type}}</p>

            <p class="noMargin">
            <span class='toppingLabel'>Sauce: </span>{{pizza.sauce.sauce_type}}</p>

            <p class="noMargin">
            <span class='toppingLabel'> Cheese: </span>{{pizza.cheese.cheese_type}}</p>

            <p class="noMargin"><span class='toppingLabel'>Toppings: </span></p>
            <ul>
                <li v-for='topping in pizza.toppings' class='noMargin resize'><p class="noMargin">{{topping.topping_name}}</p></li>
            </ul>

            <button class='removeBtn' v-on:click='handleRemoveClick(pizza.id)'>Remove Pizza</button>
        </li>
    </ul>

    <div id="buttonContainer">
        <button class='subBtn' v-on:click='handleNewPizzaClick'>Add a New Pizza</button>
        <button class='subBtn' v-on:click='handleSubmitClick' v-if='pizzas.length > 0'>Submit Order</button>
    </div>
</div>
`;

Vue.component('pizzaManagement', {
  template: template,
  props: ["pizzas"],
  data: function () {
    return {}
  },

  methods: {
    handleNewPizzaClick: function () {
      this.$emit("initNewPizza");
    },

    handleSubmitClick: function () {
      this.$emit("submitOrder");
    },

    handleRemoveClick: function (id) {
      this.$emit("removePizza", id);
    }
  }
});