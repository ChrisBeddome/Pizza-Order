//this component is used to add addresses to the user account and select an address to be used for an order

var template = `
<div id='addressManagement'>

    <div id='addressList' >
          <ul v-if='savedAddresses.length > 0'>
            <li v-for='address in savedAddresses'>
                <input v-model='selectedAddress' type='radio' name='selectAddress' :value='address' >{{address.text}}</input>
            </li>
          </ul>
          <p v-else> No Saved Addresses.</p>
        <button v-if='savedAddresses.length > 0' v-on:click='useSavedAddress'>Use This Address</button>
    </div>

    <div id='addAddressForm'>
        <h3>Add a New Address</h3>

            <input placeholder='street' v-model='newAddressInfo.street' type='text' name='addStreet' id='addStreet'>
            <input placeholder='city' v-model='newAddressInfo.city' type='text' name='addCity' id='addCity'>
            <select v-model='newAddressInfo.province' name='addProvince'>
                <option value='AB'>Alberta</option>
                <option value='BC'>British Columbia</option>
                <option value='MB'>Manitoba</option>
                <option value='NB'>New Brunswick</option>
                <option value='NL'>Newfoundland and Labrador</option>
                <option value='NS'>Nova Scotia</option>
                <option value='ON'>Ontario</option>
                <option value='PE'>Prince Edward Island</option>
                <option value='QC'>Quebec</option>
                <option value='SK'>Saskatchewan</option>
                <option value='NT'>Northwest Territories</option>
                <option value='NU'>Nunavut</option>
                <option value='YT'>Yukon</option>
            </select>
            <input placeholder='postal code' v-model='newAddressInfo.postalCode' type='text' name='addPostalCode' id='addPostalCode'>
            <input placeholder='unit or apartment' v-model='newAddressInfo.aptNumber' type='text' name='addAptNumber' id='addAptNumber'>
        <button v-on:click='addNewAddress'>add address</button>
    </div>
</div>
`;

Vue.component('addressManagement', {
  template: template,
  props: [],
  data: function () {
    return {
      savedAddresses: [],
      selectedAddress: null,
      newAddressInfo: {
        street: null,
        city: null,
        province: "AB",
        postalCode: null,
        aptNumber: null
      }
    }
  },

  methods: {
    useSavedAddress: function () {
      this.$emit("clearErrors");
      if (!this.selectedAddress) {
        this.$emit("addressError", "Must select an address");
      } else {
        this.$emit("addressChosen", this.selectedAddress);
      }
    },

    addNewAddress: function () {
      this.$emit("clearErrors");
      var address = {
        street: this.newAddressInfo.street,
        city: this.newAddressInfo.city,
        province: this.newAddressInfo.province,
        postalCode: this.newAddressInfo.postalCode
      };

      if (this.newAddressInfo.aptNumber) {
        address.aptNumber = this.newAddressInfo.aptNumber;
      }

      $.post("includes/addNewAddress.php", address, function (response, status) {
        var response = JSON.parse(response);
        if (response.success) {
          this.savedAddresses.push(response.message);
          this.resetNewAddress();
        } else {
          this.$emit("addressError", response.message);
        }
      }.bind(this));
    },

    resetNewAddress: function () {
      this.$emit("clearErrors");
      this.newAddressInfo = {
        street: null,
        city: null,
        province: "AB",
        postalCode: null,
        aptNumber: null
      };
    }
  },

  mounted: function () {
    this.$emit("clearErrors");
    $.get("includes/getUserAddresses.php",
      function (response, status) {
        var response = JSON.parse(response);
        if (response.success) {
          this.savedAddresses = response.addresses;
        } else {
          this.errorMessage = response.message;
        }
      }.bind(this));
  }

});