//this component is responsbile for user registration and login

var template = `
<div id="loginContainer">
  <div id="login" class="userForm" v-if="login">
      <input id="loginUser" type="email" :placeholder="emailPlaceholder" v-model="email">
      <input id="loginPassword" type="password" :placeholder="passwordPlaceholder" v-model="password">
      <input type="button" value="login" v-on:click="handleLoginClick">
  </div>

  <!--hidden until switched-->
  <div id="register" class="userForm" v-else>
      <input id="first_name" type="text" :placeholder="firstNamePlaceholder" v-model="firstName">
      <input id="last_name" type="text" :placeholder="lastNamePlaceholder" v-model="lastName">
      <input id="phoneNumber" type="tel" :placeholder="phoneNumberPlaceholder" v-model="phoneNumber">
      <input id="regUser" type="email" :placeholder="emailPlaceholder" v-model="email">
      <input id="regPassword" type="password" :placeholder="passwordPlaceholder" v-model="password">
      <!-- confirm password input -->
      <input type="button" value="register" v-on:click="handleRegisterClick">
  </div>

  <span id="swapLogin" v-on:click="swapLogin">{{ swapMessage }}</span>
</div>
`;

Vue.component('loginContainer', {
  template: template,
  props: [],
  data: function () {
    return {
      login: true,
      swapMessage: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      emailPlaceholder: "email",
      passwordPlaceholder: "password",
      firstNamePlaceholder: "First Name",
      lastNamePlaceholder: "Last Name",
      phoneNumberPlaceholder: "Phone #"
    }
  },

  methods: {
    swapLogin: function () {
      this.$emit("clearErrors");
      this.firstName = "";
      this.lastName = "";
      this.phoneNumber = "";
      this.email = "";
      this.password = "";
      this.login = !this.login;
      this.swapText();
    },

    swapText: function () {
      if (this.login) {
        this.swapMessage = "Don't have an account? Click here to Register"
      } else {
        this.swapMessage = "Already have an account? Click here to Log in"
      }
    },

    handleLoginClick: function () {
      this.$emit("clearErrors");
      $.post("includes/loginUser.php", {
        email: this.email,
        password: this.password
      }, function (response, status) {
        var response = JSON.parse(response);
        if (response.success) {
          this.$emit("loginSuccess");
        } else {
          this.$emit("loginError", response.message);
        }
      }.bind(this));
    },

    handleRegisterClick: function () {
      this.$emit("clearErrors");
      $.post("includes/registerNewUser.php", {
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        phoneNumber: this.phoneNumber
      }, function (response, status) {
        var response = JSON.parse(response)
        if (response.success) {
          this.handleLoginClick();
        } else {
          this.$emit("registerError", response.message);
        }
      }.bind(this));
    }
  },
  created: function () {
    this.swapText();
  }
});