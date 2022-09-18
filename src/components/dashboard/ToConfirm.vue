<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">{{ content[0] }}</h1>
        <p class="mt-2 text-sm text-gray-700">{{ content[1] }}</p>
      </div>
    </div>
    <div v-if="!isUrgent" class="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mb-5">
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
    <Loader v-if="loading" />
    <div v-else>
      <EtabList v-model="currentProject" v-model:title="fullname" :list="projects" v-if="projects.length > 1" class="mt-5" :filterByName="true" />
      <div v-if="!(currentProject || fullname)" class="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mb-5">
        <div class="flex items-center justify-between bg-white px-4 py-3 sm:px-6 w-full">
          <VuePaginationTw
            :key="currentReservations.length"
            :total-items="currentReservations.length"
            :current-page="currentPage"
            :per-page="itemPerPage"
            @page-changed="changePage"
            class="w-full pagination"
          />
        </div>
      </div>
      <div class="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mb-5">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">ID de réservation</th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Établissement</th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Nom du client</th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Nombre de personnes</th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Arrivée</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="resa in currentReservationsFiltered" :key="resa.id">
              <td class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                #{{ resa.id }}
                <br/>
                <span class="inline-block flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium" :class="{'bg-primary-100 text-white':currentAgent(resa),'bg-gray-100 text-gray-900':!currentAgent(resa)}">{{currentAgent(resa) || 'Aucun agent' }}</span>
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
              </td>
            </tr>
          </tbody>
        </table>
        <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 w-full" v-if="!(currentProject || fullname)">
          <VuePaginationTw
            :key="currentReservations.length"
            :total-items="currentReservations.length"
            :current-page="currentPage"
            :per-page="itemPerPage"
            @page-changed="changePage"
            class="w-full pagination"
          />
        </div>
      </div>
    </div>
  </div>
  <Modal :data="selectedResa" :show="showModal" :actions="modalActions" :resaType="type" @close="showModal = false" />
</template>

<script>
  import format from 'date-fns/format'
  import userService from '../../services/user.service'
  import Modal from '../Modal.vue'
  import EtabList from '../EtabList.vue'
  import subMinutes from 'date-fns/subMinutes'
  import startOfToday from 'date-fns/startOfToday'
  import getMonth from 'date-fns/getMonth'
  import { fr } from 'date-fns/locale'
  import addMonths from 'date-fns/addMonths'
  import subMonths from 'date-fns/subMonths'
  import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'
  import isSameMonth from 'date-fns/isSameMonth'
  import Loader from '../Loader.vue'
  import { debounce } from 'lodash'
  import compareAsc from 'date-fns/compareAsc'
  import VuePaginationTw from "vue-pagination-tw";
  import "vue-pagination-tw/styles"; // tailwind basic styles
  import {updateResaConfirmation} from '../../methods'

  export default {
    name: 'resa',
    components: {
      Modal,
      EtabList,
      ChevronLeftIcon,
      ChevronRightIcon,
      Loader,
      VuePaginationTw
    },
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
        fullname : null,
        staff : [],
        currentDay: new Date(),
				currentMonth: null,
        currentPage: 1,
        itemPerPage: 20
      }
    },
    async mounted() {
      this.currentProject = this.projects[0]?.value
      this.staff = await userService.getAdmins().then(({data}) => {        
        return data
      })

      const today = startOfToday();
      this.currentDay = today;
			this.currentMonth = getMonth(today);
    },
    watch: {
      type(val,oldval) {
        if( val !== oldval ) this.currentProject = this.projects[0]?.value
        this.currentPage = 1;
      },
      currentProject(val) {
        if( val !== 0 ) {
          this.currentPage = 1;
        }
      },
      fullname(val) {
        if( val !== 0 ) {
          this.currentPage = 1;
        }
      }
    },
    computed: {
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
      isUrgent() {
        return this.type === 'partner_calendar_urgent';
      },
      modalActions() {
        let actions = [];

				if( ['waiting','not-confirmed','not-confirmed-owner'].includes(this.selectedResa['resa-confirmation']) )
					actions = [...actions,...[{label:'Confirmer',method: () => { this.confirmResa(this.selectedResa) } }]];
				if( ['waiting','confirmed','confirmed-owner'].includes(this.selectedResa['resa-confirmation']) )
					actions = [...actions,...[{label:'Refuser',method: () => { this.denyResa(this.selectedResa) } }]];
        
        return actions;
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
        else{
          if( !isSameMonth(this.currentDay,new Date()) ){
            return this.reservations
          }else{
            if ( this.type === 'partner_calendar_confirm' )
              return this.$store.state.other.confirmResas
            else if ( this.type === 'partner_calendar_confirmed' )
              return this.$store.state.other.confirmedResas
            else if ( this.type === 'partner_calendar_refused' )
              return this.$store.state.other.refusedResas
          }
        } 
      },
      currentReservationsFiltered () {
        if(this.currentProject || this.fullname)
          return this.currentReservations.filter(({project,...resa}) => ( !this.currentProject || project === this.currentProject ) && ( !this.fullname || resa['full-name'].toLowerCase().includes(this.fullname.toLowerCase()) ))
        else{
          const from = (this.currentPage - 1) * this.itemPerPage;
          const to = this.currentPage * this.itemPerPage
          return this.currentReservations.slice(from,to)
        }
      },
      content() {
        if( this.type === 'partner_calendar_urgent' ) {
          return ['Réservations Urgentes Aujourd\'hui','Liste des réservations éffectuée au même jour.']
        }
        else if ( this.type === 'partner_calendar_confirm' ) {
          return ['Réservations à confirmer','Liste des réservations en attente de confirmation.']
        }
        else if ( this.type === 'partner_calendar_confirmed' ) {
          return ['Réservations confirmée','Liste des réservations confirmée']
        }
        else if ( this.type === 'partner_calendar_refused' ) {
          return ['Réservations refusées','Liste des réservations refusées']
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
      changePage(target) {
        this.currentPage = target;
      },
      getReservations(day) {
        this.loading = true;
        this.getReservationsAjax(day);
      },
      getReservationsAjax : debounce(async function (day) {
        await userService.getReservations(format(day, 'Y'),format(day, 'M')).then(({data}) => {
          this.loading = false;

          this.reservations = data['resas'].sort((a, b) => {
            return compareAsc(new Date(a.arrival),new Date(b.arrival));
          });
          
          let projects = {};
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
			setCurrentDay(day) {
        this.loading = false;

				if( !this.currentMonth || !isSameMonth(this.currentDay,day) ){
					this.setCurrentMonth(day);

          if( !isSameMonth(new Date(),day) )
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
      advanceHour(time,minutes) {
        time = new Date(time);
        return subMinutes(time, minutes)
      },
      currentAgent(resa) {
        return this.staff.find(({id}) => id == resa.post_author )?.name
      },
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
      async confirmResa(resa) {
        await updateResaConfirmation(resa,this.currentReservations,'confirmed');
        this.showModal = false;
      },
      async denyResa(resa) {
        await updateResaConfirmation(resa,this.currentReservations,'not-confirmed');
        this.showModal = false;
      },
    }
  };
</script>