<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">{{ content[0] }}</h1>
        <p class="mt-2 text-sm text-gray-700">{{ content[1] }}</p>
      </div>
    </div>
    <EtabList v-model="currentProject" v-model:title="fullname" :list="projects" v-if="projects.length > 1" class="mt-5" :filterByName="true" />
    <div class="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mb-5">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">ID de réservation</th>
            <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Établissement</th>
            <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Nom du client</th>
            <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Nombre de personnes</th>
            <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Arrivé</th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="resa in currentReservations.filter(({project,...resa}) => ( !currentProject || project === currentProject ) && ( !this.fullname || resa['full-name'].includes(this.fullname) ))" :key="resa.id">
            <td class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
              #{{ resa.id }}
              <dl class="font-normal lg:hidden">
                <dt class="sr-only">Établissement</dt>
                <dd class="mt-1 truncate text-gray-500 text-xs"><span style="display: inline-block;" class="font-semibold">Établissement : </span> {{ offers.find(({value}) => value === resa.project)?.label || resa.project_name }}</dd>      
                <dt class="sr-only">Nom du client</dt>
                <dd class="mt-1 truncate text-gray-500 text-xs"><span style="display: inline-block;" class="font-semibold">Nom : </span> {{ resa['full-name'] }}</dd>      
                <dt class="sr-only">Pax</dt>
                <dd class="mt-1 truncate text-gray-500 text-xs"><span style="display: inline-block;" class="font-semibold">Pax : </span> {{ resa['nbr-adult'] }} Adultes - {{ resa['nbr-children'] || 0 }} Enfants</dd>      
                <dt class="sr-only">Date/Here de début</dt>
                <dd class="mt-1 truncate text-gray-500 text-xs"><span style="display: inline-block;" class="font-semibold">Arrivé : </span> {{ dateDisplay(resa.arrival) }}</dd>
              </dl>
            </td>
            <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{{ offers.find(({value}) => value === resa.project)?.label || resa.project_name }}</td>
            <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell cusrsor-pointer">{{ resa['full-name'] }}</td>
            <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{{ resa['nbr-adult'] }} Adultes - {{ resa['nbr-children'] || 0 }} Enfants</td>
            <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{{ dateDisplay(resa.arrival) }}</td>
            <td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <span class="text-primary-600 hover:text-primary-900 cursor-pointer" @click="selectResa(resa)">Détails</span>
              <span v-if="showOptions" class="text-primary-600 hover:text-primary-900 cursor-pointer mx-5" @click="confirmResa(resa.id)">Confirmer</span>
              <span v-if="showOptions" class="text-primary-600 hover:text-primary-900 cursor-pointer" @click="denyResa(resa.id)">Refuser</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <Modal :data="selectedResa" :show="showModal" :actions="modalActions" :resaType="type" @close="showModal = false" />
</template>

<script setup>
import format from 'date-fns/format'
import userService from '../../services/user.service';
import Modal from '../Modal.vue';
import EtabList from '../EtabList.vue'
</script>
<script>
  export default {
    name: 'resa',
    props : {
      type : {}
    },
    data() {
      return {
        reservations : [],
        loading: false,
        showModal: false,
        selectedResa: {},
        currentProject: 0,
        fullname : null
      }
    },
    mounted() {
      this.currentProject = this.projects[0]?.value
    },
    watch: {
      type(val,oldval) {
        if( val !== oldval ) this.currentProject = this.projects[0]?.value
      }
    },
    computed: {
      modalActions() {
        if ( this.type === 'partner_calendar_confirmed' )
          return [{label:'Fermer',method: () => { this.showModal = false } }];
          
        return [{label:'Confirmer',method: () => { this.confirmResa(this.selectedResa.id) } },{label:'Refuser',method: () => { this.denyResa(this.selectedResa.id) } }];
      },
      offers() {
        return this.$store.state.other.offers
      },
      showOptions() {
        return ['partner_calendar_urgent','partner_calendar_confirm'].includes(this.type);
      },
      currentReservations() {
        if( this.type === 'partner_calendar_urgent' )
          return this.$store.state.other.urgentResas
        else if ( this.type === 'partner_calendar_confirm' )
          return this.$store.state.other.confirmResas
        else if ( this.type === 'partner_calendar_confirmed' )
          return this.$store.state.other.confirmedResas
      },
      content() {
        if( this.type === 'partner_calendar_urgent' ) {
          return ['Réservations Urgentes Aujourd\'hui','Liste des réservations éffectuée au même jour.']
        }
        else if ( this.type === 'partner_calendar_confirm' ) {
          return ['Réservations à confirmer','Liste des réservations en attente de confirmation.']
        }
        else if ( this.type === 'partner_calendar_confirmed' ) {
          return ['Réservations confirmée','List des réservations confirmée']
        }
      },
      projects() {
        let projects = {}
          
        this.currentReservations.forEach(({project_name,project}) => {
          if( !projects[project] && project_name ) projects[project] = {
            label : project_name,
            value : project
          }
        })

        projects =  Object.values(projects).sort(function(a, b) {
          var textA = a.label.toUpperCase();
          var textB = b.label.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });

        return [
          ...[{
            label : 'Voir tous',
            value : 0,
            count : this.currentReservations.length
          }],
          ...projects.map(item => {
            return {...item,...{ count : this.currentReservations.filter(({project}) => {
              return project === item.value
            }).length }}
          })
        ]
      }
    },
    methods: {
      selectResa(resa) {
        this.selectedResa = resa;
        this.showModal = true;
      },
      filteredResa(id) {
        return this.currentReservations.filter(resa => {return resa.id !== id})
      },
      dateDisplay(from){
        from = new Date(from);
        if( this.type === 'partner_calendar_urgent' )
          return format(from,'HH:mm')
        else
          return format(from,'dd-MM-yyyy à HH:mm')
      },
      async confirmResa(id) {
        await userService.updateReservation(id,{'resa-confirmation':'confirmed-owner'}).then(({data}) => {
          if( data ){
            if ( this.type === 'partner_calendar_urgent' ) this.$store.dispatch('setUrgentResas', this.filteredResa(id))
            else if ( this.type === 'partner_calendar_confirm' ) this.$store.commit('setConfirmResas', this.filteredResa(id))
            else if ( this.type === 'partner_calendar_confirmed' ) this.$store.commit('setConfirmedResas', this.filteredResa(id))
						
            
            this.showModal = false;
            this.$store.dispatch('updateNavigation');
          }
        });
      },
      async denyResa(id) {
        await userService.updateReservation(id,{'resa-confirmation':'not-confirmed-owner'}).then(({data}) => {
          if( data ){
            if ( this.type === 'partner_calendar_urgent' ) this.$store.dispatch('setUrgentResas', this.filteredResa(id))
            else if ( this.type === 'partner_calendar_confirm' ) this.$store.commit('setConfirmResas', this.filteredResa(id))
            else if ( this.type === 'partner_calendar_confirmed' ) this.$store.commit('setConfirmedResas', this.filteredResa(id))
						
            this.showModal = false;
            this.$store.dispatch('updateNavigation');
          }
        });
      },
    }
  };
</script>
