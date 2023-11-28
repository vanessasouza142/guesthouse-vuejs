const app = Vue.createApp({
  data() {
    return {
      searchText: '',
      listGuesthouses: [],
      selectedGuesthouse: null,
      listRooms: [],
      totalPrice: null,
      availabilityMessage: null,
    };
  },

  computed: {
    listResult() {
      if (this.searchText) {
        return this.listGuesthouses.filter(guesthouse => {
          return guesthouse.brand_name.toLowerCase().includes(this.searchText.toLowerCase());
        });
      } else {
        return this.listGuesthouses;
      }
    }
  },

  methods: {
    async getData() {
      let response = await fetch('http://localhost:3000/api/v1/guesthouses');
      let data = await response.json();
      this.listGuesthouses = data.map(item => ({
        id: item.id,
        brand_name: item.brand_name,
        city: item.city
      }));
    },

    async getDetails(guesthouseId) {
      let response = await fetch(`http://localhost:3000/api/v1/guesthouses/${guesthouseId}`);
      let data = await response.json();
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
      this.listRooms = data.map(item => ({
        guesthouseId: guesthouseId,
        id: item.id,
        name: item.name,
        description: item.description,
        area: item.area,
        max_guest: item.max_guest,
        default_price: item.default_price,
        totalPrice: null,
        availabilityMessage: null
      }));
    },

    async checkAvailability(room) {
      const requestBody = {
        check_in_date: room.checkInDate,
        check_out_date: room.checkOutDate,
        guests_number: room.guestsNumber,
        room: room.id
      };
    
      const response = await fetch(`http://localhost:3000/api/v1/rooms/${room.id}/bookings/check_availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ booking: requestBody })
      });
    
      if (response.ok) {
        const data = await response.json();
        room.totalPrice = data.total_price;
        room.availabilityMessage = null;
      } else {
        room.totalPrice = null;
        room.availabilityMessage = 'O quarto não está disponível para o período selecionado.';
      }
    }
  }
});

app.mount('#guesthouse-app');