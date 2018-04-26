//this component is responsible for relaying the order details and delivery time to the customer, as well as giving them to opportunity to begin a new order

var template = `
<div id='submitOrder'>

    <h3>Order Overview</h3>

    <div id='estimatedTime'>
        <p>Your pizza will be delivered to {{address.text}} at approximately {{ getDeliveryTime() }}</p>
    </div>
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

            <p class="noMargin">
                <span class='toppingLabel'>Toppings: </span>
            </p>
            <ul>
                <li v-for='topping in pizza.toppings' class='noMargin resize'>
                    <p class="noMargin">{{topping.topping_name}}</p>
                </li>
            </ul>

        </li>
    </ul>

    <button v-on:click='handleNewOrderClick'> Make a New Order</button>

</div>
`;

Vue.component('submitOrder', {
  template: template,
  props: ["pizzas", "address"],
  data: function () {
    return {}
  },

  methods: {
    getDeliveryTime: function () {
      var now = new Date();
      var newDateObj = new Date(now.getTime() + 30 * 60000);
      var dateString = newDateObj.toTimeString().split(":");
      return dateString[0] + ":" + dateString[1];

    },
    handleNewOrderClick: function () {
      this.$emit("startNewOrder");
    }

  },

  created: function () {
    $.post("includes/submitOrder.php", {
      pizzas: this.pizzas,
      address: this.address
    }, function (response, status) {
      var response = JSON.parse(response);
      if (response.success) {
        // console.log(response);
      } else {
        this.$emit("submitError", response.message);
      }
    }.bind(this));
  }

});