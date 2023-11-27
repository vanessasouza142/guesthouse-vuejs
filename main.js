
const app = Vue.createApp({
  data(){
    return{
      searchText: '',
      listGuesthouses: [],
      selectedGuesthouse: null
    }
  },

  computed:{
    listResult(){

      if(this.searchText){
        return this.listGuesthouses.filter(guesthouse => {
          return guesthouse.brand_name.toLowerCase().includes(this.searchText.toLowerCase());
        });
      }else {
        return this.listGuesthouses;
      }
    }
  },

  methods:{
    async getData() {
      let response = await fetch('http://localhost:3000/api/v1/guesthouses');
      let data = await response.json();
      this.listGuesthouses = [];

      data.forEach(item => {
        var guesthouse = new Object();
        guesthouse.id = item.id;
        guesthouse.brand_name = item.brand_name;
        guesthouse.city = item.city;

        this.listGuesthouses.push(guesthouse);
      });
    },
    async getDetails(guesthouseId) {
      let response = await fetch(`http://localhost:3000/api/v1/guesthouses/${guesthouseId}`);
      let data = await response.json();
      console.log(data);
      this.selectedGuesthouse = {
        id: data.id,
        average_score: data.average_score,
        phone_number: data.phone_number,
        email: data.email,
        address: data.address,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        description: data.description,
        payment_method: data.payment_method,
        usage_policy: data.usage_policy,
        check_in: data.check_in,
        check_out: data.check_out
      };
    },
    async getRooms(guesthouseId) {
      let response = await fetch(`http://localhost:3000/api/v1/guesthouses/${guesthouseId}/rooms`);
      let data = await response.json();
      console.log(data);
      // this.selectedGuesthouse = {
      //   id: data.id,
      //   name: data.name,
      //   description: data.description,
      //   area: data.area,
      //   max_guests: data.max_guests,
      //   default_price: data.default_price,
       // };
    }
  }
});

app.mount('#guesthouse-app');