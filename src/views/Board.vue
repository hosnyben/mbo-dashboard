<template>
  <Dashboard>
    <component v-bind:is="currentcontent"></component>
  </Dashboard>
</template>
  
<script setup>
import Dashboard from '../components/Dashboard.vue'
import Welcome from '../components/dashboard/Welcome.vue'
import Reservations from '../components/dashboard/Reservations.vue'
import {CalendarIcon,CheckCircleIcon,XCircleIcon,ScaleIcon} from '@heroicons/vue/24/outline'
import Occupations from '../components/dashboard/Occupations.vue';
import EditOccupationVue from '../components/dashboard/EditOccupation.vue';
import StatsVue from '../components/dashboard/Stats.vue';
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
        }
      };
    },
    computed : {
      currentcontent() {
        return this.pages[this.$route.name];
      }
    },  
    mounted() {
      this.$store.commit('setNavigation',[
        { name: 'Reservations', href: '/partenaire/reservations', icon: CalendarIcon, description: 'Agenda des réservations effectuées sur marrakechbestof.com' },
        { name: 'Occupations', href: '/partenaire/occupations', icon: XCircleIcon, description: 'Ajouter les dates d\'occupation quand vous ne serez pas en mesure de traiter les réservations.' },
        // { name: 'Liste des réservations traitées', href: '#', icon: CheckCircleIcon, description: 'Liste des réservations traitées par mois.' },
        { name: 'Statistiques', href: '/partenaire/statistiques', icon: CheckCircleIcon, description: 'Liste des réservations traitées par mois.' },
        // { name: 'Directory', href: '#', icon: MagnifyingGlassCircleIcon, current: false },
        // { name: 'Announcements', href: '#', icon: MegaphoneIcon, current: false },
        // { name: 'Office Map', href: '#', icon: MapIcon, current: false },
      ])
      /*
      UserService.getPublicContent().then(
        (response) => {
          this.content = response.data;
        },
        (error) => {
          this.content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
      */
    },
  };
</script>