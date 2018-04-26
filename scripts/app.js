//Chris Beddome - Eric Cuerden
//entry point - all components loaded through this root component
//components loaded based on the value of "page" data property

var template = `
<div>
<h1 id="pageTitle">Pizza Bros</h1>
<h2 id="subTitle">Online Pizza Ordering</h2>
<p id="instruct" v-if='instructMessage'>{{instructMessage}}</p>

<loginContainer v-if='page === "login"' v-on:clearErrors='clearErrors' v-on:registerError='generateErrorMessage' v-on:loginError='generateErrorMessage'
    v-on:loginSuccess='enterSite' />

<addressManagement v-else-if='page === "addressManagement"' v-on:clearErrors='clearErrors' v-on:addressError='generateErrorMessage'
    v-on:addressChosen='selectAddress' />

<pizzaManagement v-else-if='page === "pizzaManagement"' v-bind:pizzas='orderDetails.pizzas' v-on:clearErrors='clearErrors'
    v-on:pizzaError='generateErrorMessage' v-on:initNewPizza='initNewPizza' v-on:submitOrder='submitOrder' v-on:removePizza='removeFinishedPizza'/>
    
<customizePizza v-else-if='page === "customizePizza"' v-on:clearErrors='clearErrors' v-on:customizeError='generateErrorMessage'
    v-on:discardPizza='discardPizza' v-on:addPizza='addPizzaToOrder' />

<submitOrder v-else-if='page === "submitOrder"' v-bind:address='orderDetails.address' v-bind:pizzas='orderDetails.pizzas'
    v-on:clearErrors='clearErrors' v-on:submitError='generateErrorMessage' v-on:startNewOrder='startNewOrder' />

<span id="errorOutput" v-if="errorMessage">{{ errorMessage }}</span>
<button id="logoutBtn" v-if='userLoggedIn' v-on:click='logoutUser'>logout</button>
</div>
`;

var app = new Vue({
  template: template,
  el: '#app',
  data: function () {
    return {
      page: "login",
      instructMessage: "Welome to Pizza Bros - To begin your order, please login or register an account with us",
      errorMessage: false,
      userLoggedIn: false,
      orderDetails: {
        address: null,
        pizzas: []
      }
    };
  },
  methods: {
    clearErrors: function () {
      this.errorMessage = false;
    },

    generateErrorMessage: function (error) {
      this.errorMessage = error;
    },

    enterSite: function () {
      this.clearErrors();
      this.page = "addressManagement";
      this.instructMessage = "Select an address from the list below, or add a new address"
      this.userLoggedIn = true;
    },

    startNewOrder: function () {
      this.clearErrors();
      this.page = "addressManagement";
      this.instructMessage = "Select an address from the list below, or add a new address"
      this.resetOrderDetails();
    },

    resetOrderDetails: function () {
      this.orderDetails = {
        address: null,
        pizzas: []
      }
    },

    selectAddress: function (address) {
      this.orderDetails.address = address;
      this.page = "pizzaManagement";
      this.instructMessage = "Add Another Pizza or Place Your Order"
    },

    logoutUser: function () {
      this.errorMessage = false;
      $.get("includes/logoutUser.php",
        function (response, status) {
          var response = JSON.parse(response);
          if (response.success) {
            this.page = "login";
            this.instructMessage = "Welome to Pizza Bros - To begin your order, please login or register an account with us";
            this.userLoggedIn = false;
            this.resetOrderDetails();
          } else {
            this.errorMessage = "network error";
          }
        }.bind(this));
    },

    initNewPizza: function () {
      this.clearErrors();
      this.page = "customizePizza";
      this.instructMessage = "Customize your pizza!";
    },

    addPizzaToOrder: function (newPizza) {
      this.clearErrors();
      newPizza.id = parseInt(Math.random() * 9999999999999);
      this.orderDetails.pizzas.push(newPizza);
      this.page = "pizzaManagement";
      this.instructMessage = "Add Another Pizza or Place Your Order";
    },

    removeFinishedPizza: function (id) {
      this.orderDetails.pizzas = this.orderDetails.pizzas.filter(pizza => pizza.id !== id);
    },

    discardPizza: function () {
      this.clearErrors();
      this.page = "pizzaManagement";
      this.instructMessage = "Add Another Pizza or Place Your Order"
    },

    submitOrder: function () {
      this.clearErrors();
      this.page = "submitOrder";
      this.instructMessage = "Order Submitted!"
    }
  }
});