<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">Réservations Traitées par mois</h1>
        <p class="mt-2 text-sm text-gray-700">Liste de toutes les réservations traitées par mois, par établissements/offres.</p>
      </div>
    </div>
    <div class="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mb-5">
      <nav class="flex items-center justify-between bg-white px-4 py-3 sm:px-6" aria-label="Pagination">
        <div class="hidden sm:block">
          <p class="text-sm text-gray-700">Les reservations traitées le mois de <strong>{{monthYear}}</strong></p>
        </div>
        <div class="flex flex-1 justify-between sm:justify-end">
          <button class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 capitalize" @click="changeMonth(0)"><ChevronLeftIcon class="h-5 w-5" aria-hidden="true" /> {{prevMonth}}</button>
          <button v-if="!isLastMonth" class="ml-3 relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 capitalize" @click="changeMonth(1)">{{nextMonth}} <ChevronRightIcon class="h-5 w-5" aria-hidden="true" /></button>
        </div>
      </nav>
    </div>

    <div>
      <h3 class="text-lg font-medium leading-6 text-gray-900">Statistiques</h3>
      <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div v-for="item in stats" :key="item.name" class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt class="truncate text-sm font-medium text-gray-500">{{ item.name }}</dt>
          <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{{ item.stat }}</dd>
        </div>
      </dl>
    </div>

    <div class="xl:hidden my-5">
      <label for="tabs" class="sr-only">Votre établissement</label>
      <select id="tabs" name="tabs" class="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500">
        <option v-for="project in projects" :key="project.value" :selected="project.value === selectedProject">{{ project.name }}</option>
      </select>
    </div>
    <div class="hidden xl:block my-5">
      <nav class="isolate flex divide-x divide-gray-200 rounded-lg shadow" aria-label="Tabs">
        <span v-for="project,index in projects" :key="project.value" @click="selectedProject = project.value" :class="[project.value === selectedProject ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700', index === 0 ? 'rounded-l-lg' : '', index === projects.length - 1 ? 'rounded-r-lg' : '', 'cursor-pointer group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10']" :aria-current="project.value === selectedProject ? 'page' : undefined">
          <span>{{ project.name }}</span>
          <span aria-hidden="true" :class="[project.value === selectedProject ? 'bg-primary-500' : 'bg-transparent', 'absolute inset-x-0 bottom-0 h-0.5']" />
        </span>
      </nav>
    </div>
    <div class="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mb-5">
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
  <TransitionRoot as="template" :show="showModal">
    <Dialog as="div" class="relative z-10" @close="showModal = false">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                <div class="px-4 py-5 sm:px-6">
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">{{ selectedResa['full-name'] }} #{{ selectedResa.id }}</DialogTitle>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500">Date de réservation 
                    <time :datetime="dateDisplay(selectedResa.arrival,selectedResa.departure)[0]">{{ dateDisplay(selectedResa.arrival,selectedResa.departure)[0] }}</time>
                    <time :datetime="dateDisplay(selectedResa.arrival,selectedResa.departure)[1]" v-if="dateDisplay(selectedResa.arrival,selectedResa.departure)[1]"> - {{ dateDisplay(selectedResa.arrival,selectedResa.departure)[1] }}</time>
                  </p>
                  <span class="mr-2 inline-block flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium bg-primary-100 text-white">{{ selectedResa.project}}</span>
                </div>
                <div class="border-t border-gray-200">
                  <dl>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Nom complet</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ selectedResa['full-name'] }}</dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Adresse E-mail</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ selectedResa.email }}</dd>
                    </div>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Téléphone</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ selectedResa['country-phone'] }}{{ selectedResa.phone }}</dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Nombre de personnes</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ selectedResa['nbr-adult'] }} Adultes - {{ selectedResa['nbr-children'] || 0 }} Enfants</dd>
                    </div>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Commentaire du client</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 italic">{{ selectedResa.comments || 'Aucun' }}</dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Détails</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <ul role="list" class="divide-y divide-gray-200 rounded-md border border-gray-200" v-if="selectedResa.fields">
                          <li class="flex items-center justify-between py-3 pl-3 pr-4 text-sm" v-for="(field,index) in selectedResa.fields" :key="index">
                            <div class="flex w-0 flex-1 items-center">
                              <span class="ml-2 w-0 flex-1">{{ field.placeholder }}</span>
                            </div>
                            <div class="ml-4 flex-shrink-0">
                              <span class="ml-2 w-0 flex-1">{{ field.value }}</span>
                            </div>
                          </li>
                        </ul>
                        <span v-else class="italic">Aucuns</span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              <div class="mt-5 flex flex-col items-center">
                <button type="button" class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm" @click="showModal = false">Fermer</button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import userService from '../../services/user.service';
import startOfToday from 'date-fns/startOfToday';
import getMonth from 'date-fns/getMonth';
import format from 'date-fns/format'
import { fr } from 'date-fns/locale'
import addMonths from 'date-fns/addMonths'
import subMonths from 'date-fns/subMonths'
import isSameMonth from 'date-fns/isSameMonth'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from '@headlessui/vue'
import compareAsc from 'date-fns/compareAsc'
</script>
<script>
  import { debounce } from 'lodash';
  export default {
    name: 'resa',
    data() {
      return {
        enabled : false,
        reservations : [],
        loading: false,
        currentDay: new Date(),
				currentMonth: null,
        projects : [],
        showModal: false,
        selectedProject : null
      }
    },
    mounted() {
      const today = startOfToday();
      this.setCurrentDay(subMonths(today,1));
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
      isLastMonth() {
        const target = new Date();
        return isSameMonth(this.currentDay,subMonths(target,1))
      },
      currentReservations() {
        return this.reservations.filter(({project_id}) => {
          return project_id === this.selectedProject
        })
      },
      stats() {
        let ad = 0,ch = 0;
        
        const resas = this.reservations.filter(({project_id}) => {
          return project_id === this.selectedProject
        });
        
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
        this.reservations = await userService.getReservations(format(day, 'Y'),format(day, 'M')).then(({data}) => {
            this.loading = false;
            let projects = {}
            const cleanData = data.filter(resa => {
              return ['confirmed','confirmed-owner'].includes(resa['resa-confirmation']);
            }).sort((a, b) => {
              return compareAsc(new Date(a.arrival),new Date(b.arrival));
            });
            cleanData.forEach(({project,project_id}) => {
              if( !projects[project_id] ) projects[project_id] = {
                value : project_id,
                name : project
              }
  
              this.projects = Object.values(projects)
              this.selectedProject = this.projects[0].value
            })
            return cleanData
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
