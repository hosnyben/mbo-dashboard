<template>
  <Dashboard>
    <component ref="document" v-bind:is="currentcontent" :type="this.$route.name"></component>
  </Dashboard>
</template>
  
<script setup>
import Dashboard from '../components/Dashboard.vue'
import Welcome from '../components/dashboard/Welcome.vue'
import Reservations from '../components/dashboard/Reservations.vue'
import ToConfirm from '../components/dashboard/ToConfirm.vue'
import Occupations from '../components/dashboard/Occupations.vue'
import EditOccupationVue from '../components/dashboard/EditOccupation.vue'
import StatsVue from '../components/dashboard/Stats.vue'
import differenceInHours from 'date-fns/differenceInHours'
import isSameDay from 'date-fns/isSameDay'
import startOfToday from 'date-fns/startOfToday'
import userService from '../services/user.service'
import format from 'date-fns/format'
import compareAsc from 'date-fns/compareAsc'
</script>
<script>
  export default {
    name: 'Board',
    data() {
      return {
        pages : {
          'welcome' : Welcome,
          'partner_calendar' : Reservations,
          'partner_closing' : Occupations,
          'partner_closing_new' : EditOccupationVue,
          'partner_closing_edit' : EditOccupationVue,
          'partner_stats' : StatsVue,
          'partner_calendar_confirm' : ToConfirm,
          'partner_calendar_urgent' : ToConfirm,
        },
        now : Date.now()
      };
    },
    computed : {
      currentcontent() {
        return this.pages[this.$route.name];
      }
    },  
    mounted() {
      this.$store.dispatch('updateNavigation');

      const today = startOfToday();
      this.getReservations(today);

      setInterval(() => {
        this.now = Date.now();
        this.getReservations(today);
      }, 1000*60*5); // Refresh in 10 minutes
    },
    methods: {
      async getReservations(day) {
        const resas = await userService.getReservations(format(day, 'Y'),format(day, 'M')).then(({data}) => {
          return data.map(resa => {
            return {...resa,...{urgent:isSameDay(new Date(resa.created_at),new Date(resa.arrival))}};
          }).filter(resa => {
            return differenceInHours(new Date(resa.arrival),this.now) >= 0
          }).sort((a, b) => {
            return compareAsc(new Date(a.arrival),new Date(b.arrival));
          });
        })
        this.$store.dispatch('setUrgentResas', resas.filter(resa => {
          return resa['resa-confirmation'] === 'waiting' && resa.urgent
        }));
        this.$store.commit('setConfirmResas', resas.filter(resa => {
          return resa['resa-confirmation'] === 'waiting' && !resa.urgent
        }));

        this.$store.dispatch('updateNavigation');
      }
    }
  };
</script>