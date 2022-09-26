<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">Réservations Reçues par mois</h1>
        <p class="mt-2 text-sm text-gray-700">Liste de toutes les réservations reçues par mois, par établissements/offres.</p>
      </div>
    </div>
    <div class="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mb-5">
      <nav class="flex items-center justify-between bg-white px-4 py-3 sm:px-6" aria-label="Pagination">
        <div class="hidden sm:block">
          <p class="text-sm text-gray-700">Les reservations reçues le mois de <strong>{{monthYear}}</strong></p>
        </div>
        <div class="flex flex-1 justify-between sm:justify-end">
          <button class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 capitalize" @click="changeMonth(0)"><ChevronLeftIcon class="h-5 w-5" aria-hidden="true" /> {{prevMonth}}</button>
          <button v-if="!isLastMonth" class="ml-3 relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 capitalize" @click="changeMonth(1)">{{nextMonth}} <ChevronRightIcon class="h-5 w-5" aria-hidden="true" /></button>
        </div>
      </nav>
    </div>

    
    <h3 class="text-lg font-medium leading-6 text-gray-900">Statistiques</h3>
    <Loader v-if="loading" />
    <div v-else>
      <div class="mb-4">
        <EtabList v-model="selectedProject" :list="projects" v-if="projects.length > 1" class="mb-5" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div v-for="item in stats" :key="item.name" class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt class="truncate text-sm font-medium text-gray-500">{{ item.name }}</dt>
            <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{{ item.stat }}</dd>
          </div>
        </dl>
      </div>

      <div v-if="!isTransporter">
        <SwitchGroup as="div" class="flex items-center mb-5">
          <Switch v-model="ownercomment" :class="[ownercomment ? 'bg-primary-600' : 'bg-gray-200', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2']">
            <span aria-hidden="true" :class="[ownercomment ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']" />
          </Switch>
          <SwitchLabel as="span" class="ml-3">
            <span class="text-sm font-medium text-gray-900">Avec commentaire</span>
            <span class="text-sm text-gray-500"> (Afficher les réservations avec commentaire du propriétaire)</span>
          </SwitchLabel>
        </SwitchGroup>
        <SwitchGroup as="div" class="flex items-center">
          <Switch v-model="noShow" :class="[noShow ? 'bg-primary-600' : 'bg-gray-200', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2']">
            <span aria-hidden="true" :class="[noShow ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']" />
          </Switch>
          <SwitchLabel as="span" class="ml-3">
            <span class="text-sm font-medium text-gray-900">No Show</span>
            <span class="text-sm text-gray-500"> (Afficher les réservations no show)</span>
          </SwitchLabel>
        </SwitchGroup>
      </div>

      <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mb-5 mt-4">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">ID de reservation</th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Nom du client</th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Nombre de personnes</th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Arrivé</th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Départ</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="resa in currentReservations" :key="resa.id">
              <td class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                #{{ resa.id }}
                <dl class="font-normal lg:hidden">
                  <dt class="sr-only">Nom du client</dt>
                  <dd class="mt-1 truncate text-gray-500 text-xs"><span style="display: inline-block;" class="font-semibold">Nom : </span> {{ resa['full-name'] }}</dd>      
                  <dt class="sr-only">Pax</dt>
                  <dd class="mt-1 truncate text-gray-500 text-xs"><span style="display: inline-block;" class="font-semibold">Pax : </span> {{ resa['nbr-adult'] }} Adultes - {{ resa['nbr-children'] || 0 }} Enfants</dd>      
                  <dt class="sr-only">Date/Here de début</dt>
                  <dd class="mt-1 truncate text-gray-500 text-xs"><span style="display: inline-block;" class="font-semibold">Arrivé : </span> {{ dateDisplay(resa.arrival,resa.departure)[0] }}</dd>
                  <dt v-if="dateDisplay(resa.arrival,resa.departure)[1] && dateDisplay(resa.arrival,resa.departure)[0] !== dateDisplay(resa.arrival,resa.departure)[1]" class="sr-only">Départ</dt>
                  <dd v-if="dateDisplay(resa.arrival,resa.departure)[1] && dateDisplay(resa.arrival,resa.departure)[0] !== dateDisplay(resa.arrival,resa.departure)[1]" class="mt-1 truncate text-gray-500 text-xs"><span style="display: inline-block;" class="font-semibold">Départ : </span> {{ dateDisplay(resa.arrival,resa.departure)[1] }}</dd>
                </dl>
              </td>
              <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{{ resa['full-name'] }}</td>
              <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{{ resa['nbr-adult'] }} Adultes - {{ resa['nbr-children'] || 0 }} Enfants</td>
              <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{{ dateDisplay(resa.arrival,resa.departure)[0] }}</td>
              <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{{ dateDisplay(resa.arrival,resa.departure)[1] }}</td>
              <td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <span class="text-primary-600 hover:text-primary-900 cursor-pointer" @click="selectResa(resa)">Détails</span>
              </td>
            </tr>
          </tbody>
        </table>
        <nav class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6" aria-label="Pagination">
          <div class="hidden sm:block">
            <p class="text-sm text-gray-700">Les reservations traitées le mois de <strong>{{monthYear}}</strong></p>
          </div>
          <div class="flex flex-1 justify-between sm:justify-end">
            <button class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 capitalize" @click="changeMonth(0)"><ChevronLeftIcon class="h-5 w-5" aria-hidden="true" /> {{prevMonth}}</button>
            <button v-if="!isLastMonth" class="ml-3 relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 capitalize" @click="changeMonth(1)">{{nextMonth}} <ChevronRightIcon class="h-5 w-5" aria-hidden="true" /></button>
          </div>
        </nav>
      </div>
    </div>
  </div>
  <Modal :data="selectedResa" :show="showModal" :actions="[{label:'Fermer',method:() => {showModal = false}}]" @close="showModal = false" />
</template>

<script>
  import userService from '../../services/user.service';
  import startOfToday from 'date-fns/startOfToday';
  import getMonth from 'date-fns/getMonth';
  import format from 'date-fns/format'
  import { fr } from 'date-fns/locale'
  import addMonths from 'date-fns/addMonths'
  import subMonths from 'date-fns/subMonths'
  import isSameMonth from 'date-fns/isSameMonth'
  import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'
  import compareAsc from 'date-fns/compareAsc'
  import Modal from '../Modal.vue'
  import EtabList from '../EtabList.vue'
  import Loader from '../Loader.vue';
  import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'

  import { debounce } from 'lodash';
  export default {
    name: 'resa',
    components: {
      ChevronLeftIcon, ChevronRightIcon, Switch, SwitchGroup, SwitchLabel, Modal, EtabList, Loader
    },
    data() {
      return {
        enabled : false,
        reservations : [],
        loading: false,
        currentDay: new Date(),
				currentMonth: null,
        projects : [],
        showModal: false,
        selectedProject : null,
        noShow: false,
        ownercomment: false
      }
    },
    mounted() {
      const today = startOfToday();
      this.setCurrentDay(subMonths(today,1));
    },
    computed: {
      isTransporter() {
        return JSON.parse(localStorage.user).user_role === 'transporter';        
      },
			monthYear() {
				return format(this.currentDay || startOfToday(), 'MMMM Y',{locale: fr});
			},
			prevMonth() {
        const target = subMonths(this.currentDay,1);
				return format(target || startOfToday(), 'MMMM Y',{locale: fr});
			},
			nextMonth() {
        const target = addMonths(this.currentDay,1);
				return format(target || startOfToday(), 'MMMM Y',{locale: fr});
			},
      isLastMonth() {
        const target = new Date();
        return isSameMonth(this.currentDay,subMonths(target,1))
      },
      currentReservations() {
        return this.reservations.filter(({project,...resa}) => {
          return project === this.selectedProject && ( !this.ownercomment || resa['partner-comment'] ) && ( !this.noShow || resa.no_show )
        })
      },
      stats() {
        let ad = 0,ch = 0;
        
        const resas = this.currentReservations
        
        resas.forEach(item => {
          ad += parseInt(item['nbr-adult']);
          ch += parseInt(item['nbr-children'] || 0);
        });

        return [{
          name : 'Total des réservations traitées',
          stat : resas.length+' Reservation' + (resas.length > 1 ? 's':'')
        },{
          name : 'Nombre d\'adultes',
          stat : ad+' Adulte' + (ad > 1 ? 's':'')
        },{
          name : 'Nombre d\'enfants',
          stat : ch+' Enfant' + (ch > 1 ? 's':'')
        }]
      }
    },
    methods: {
			setCurrentDay(day) {
				if( !this.currentMonth || !isSameMonth(this.currentDay,day) ){
					this.setCurrentMonth(day);
          this.getReservations(day);
        }

				this.currentDay = day;
			},
			setCurrentMonth(day) {
				this.currentMonth = getMonth(day);
			},
			changeMonth(next) {
				if (next) this.setCurrentDay(addMonths(this.currentDay,1));
				else this.setCurrentDay(subMonths(this.currentDay,1));
			},
      getReservations(day) {
        this.loading = true;
        this.getReservationsAjax(day);
      },
      getReservationsAjax : debounce(async function (day) {
        await userService.getReservations(format(day, 'Y'),format(day, 'M'),{posts_per_page:-1}).then(({data}) => {
          this.loading = false;
          this.reservations = data['resas'].filter(resa => {
            return ['confirmed','confirmed-owner'].includes(resa['resa-confirmation']);
          }).sort((a, b) => {
            return compareAsc(new Date(a.arrival),new Date(b.arrival));
          });
          
          let projects = {}
          this.reservations.forEach(({project_name,project}) => {
            if( !projects[project] && project_name ) projects[project] = {
              value : project,
              label : project_name
            }
          })

          this.projects = Object.values(projects).sort(function(a, b) {
            var textA = a.label.toUpperCase();
            var textB = b.label.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
          });

          this.selectedProject = this.projects[0].value
        });
      },2000),
      dateDisplay(from,to){
        from = new Date(from);
        to = new Date(to);

        return [format(from,'dd-MM-yyyy à HH:mm'),format(to,'dd-MM-yyyy à HH:mm')]
      },
      selectResa(resa) {
        this.selectedResa = resa;
        this.showModal = true;
      },
    }
  };
</script>
