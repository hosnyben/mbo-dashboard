<template>
  <h1 class="text-3xl font-bold tracking-tight text-primary-100 sm:text-4xl lg:text-5xl mb-10">Les réservations du <time :datetime="fullDigitDate" class="capitalize">{{fullDate}}</time></h1>

  <div class="xl:grid xl:grid-cols-3 xl:divide-x xl:divide-gray-200">
    <div class="xl:pr-7">
      <div class="flex items-center">
        <h2 class="flex-auto font-semibold text-gray-900 capitalize">{{ monthYear }}</h2>
        <button type="button" class="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500" @click="changeMonth(0)">
          <span class="sr-only">Précedent</span>
          <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
        </button>
        <button type="button" class="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500" @click="changeMonth(1)">
          <span class="sr-only">Suivant</span>
          <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div class="mt-10 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
        <div>L</div>
        <div>M</div>
        <div>M</div>
        <div>J</div>
        <div>V</div>
        <div>S</div>
        <div>D</div>
      </div>
      <div class="mt-2 grid grid-cols-7 text-sm">
        <div v-for="(day, dayIdx) in days" :key="day.date" :class="[dayIdx > 6 && 'border-t border-gray-200', 'py-2']">
          <button @click="setCurrentDay(day.iso)" type="button" :class="[day.isSelected && 'text-white', !day.isSelected && day.isToday && 'text-primary-600', !day.isSelected && !day.isToday && day.isCurrentMonth && 'text-gray-900', !day.isSelected && !day.isToday && !day.isCurrentMonth && 'text-gray-400', day.isSelected && day.isToday && 'bg-primary-600', day.isSelected && !day.isToday && 'bg-gray-900', !day.isSelected && 'hover:bg-gray-200', (day.isSelected || day.isToday) && 'font-semibold', 'mx-auto flex h-8 w-8 items-center justify-center rounded-full']">
            <time :datetime="day.date">{{ day.date.split('-').pop().replace(/^0/, '') }}</time>
          </button>
        </div>
      </div>
    </div>
    <section class="mt-12 xl:mt-0 xl:pl-7 xl:col-span-2">
      <Loader v-if="loading" />
      <div v-else>
        <div class="sm:hidden">
          <label for="tabs" class="sr-only">Type de réservation</label>
          <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
          <select id="tabs" name="tabs" class="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500">
            <option v-for="(resas,index) in dayResa" :key="index" :selected="index">{{ resas.label }}</option>
          </select>
        </div>
        <div class="hidden sm:block">
          <nav class="isolate flex divide-x divide-gray-200 rounded-lg shadow" aria-label="Tabs">
            <span v-for="(resas,index) in dayResa" :key="index" @click="changeType(index)" :class="[currentResaType === index ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700', index === 'urgent' ? 'rounded-l-lg' : '', index === Object.keys(dayResa)[Object.keys(dayResa).length - 1] ? 'rounded-r-lg' : '', 'cursor-pointer group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-1 text-sm font-medium text-center hover:bg-gray-50 focus:z-10']" :aria-current="currentResaType === index ? 'page' : undefined">
              <span>
                {{ resas.label }}
                <span :class="[currentResaType === index ? 'bg-primary-100 text-white' : 'bg-gray-100 text-gray-900', 'hidden ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block']">{{ resas.resas.length }}</span>
              </span>
              <span aria-hidden="true" :class="[currentResaType === index ? 'bg-primary-500' : 'bg-transparent', 'absolute inset-x-0 bottom-0 h-0.5']" />
            </span>
          </nav>
        </div>
        <EtabList v-model="currentProject" :list="projects" v-model:title="fullname" v-if="projects.length > 1" class="mt-5" :filterByName="true" />
        <div v-for="(resas,index) in dayResa" :key="index">
          <div class="pb-4 mb-4" v-if="index === currentResaType">
            <ol class="mt-4 space-y-1 text-sm leading-6 text-gray-500" v-if="resas.resas.length">
              <li v-for="reservation in resas.resas.filter( item => (item.project === currentProject) && (!fullname || item['full-name'].includes(fullname)) )" :key="reservation.id" class="group flex items-center space-x-4 rounded-xl py-2 px-4 focus-within:bg-white hover:bg-white">
                <!-- <img :src="meeting.imageUrl" alt="" class="h-10 w-10 flex-none rounded-full" /> -->
                <div class="flex-auto">
                  <p class="text-gray-900 font-semibold">
                    {{ reservation['full-name'] }} 
                    <span class="ml-2 inline-block flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800" v-if="reservation.urgent">Dernière minute</span>
                    <span class="ml-2 inline-block flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium" :class="confirmationLabel[reservation['resa-confirmation']].class">{{confirmationLabel[reservation['resa-confirmation']].text}}</span>
                    <span class="ml-2 inline-block flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium bg-primary-100 text-white">{{ reservation.project_name}}</span>
                  </p>
                  <p class="mt-0.5">
                    <time :datetime="dateDisplay(reservation.arrival,reservation.departure)[0]">{{ dateDisplay(reservation.arrival,reservation.departure)[0] }}</time>
                    <time :datetime="dateDisplay(reservation.arrival,reservation.departure)[1]" v-if="dateDisplay(reservation.arrival,reservation.departure)[1]"> - {{ dateDisplay(reservation.arrival,reservation.departure)[1] }}</time> - 
                    <span>{{ reservation['nbr-adult'] }} Adultes</span>
                    <span v-if="reservation['nbr-children']"> et {{ reservation['nbr-children'] }} Enfants</span>
                  </p>
                  <p class="mt-0.5 italic" v-if="reservation.comments">
                    {{ reservation.comments }}
                  </p>
                </div>
                <Menu as="div" class="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100">
                  <div>
                    <MenuButton class="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
                      <span class="sr-only">Open options</span>
                      <EllipsisVerticalIcon class="h-6 w-6" aria-hidden="true" />
                    </MenuButton>
                  </div>

                  <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <MenuItems class="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div class="py-1">
                        <MenuItem v-slot="{ active }" v-if="isPartner && oldResa(reservation) && ['urgent','active'].includes(currentResaType) && ['confirmed','confirmed-owner'].includes(reservation['resa-confirmation'])">
                          <span @click="noShowResa(reservation.id)" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm cursor-pointer']">No Show</span>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                          <span @click="selectResa(reservation)" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm cursor-pointer']">Détails</span>
                        </MenuItem>
                        <MenuItem v-slot="{ active }" v-if="(isAdmin || isPartner) && ['urgent','active'].includes(currentResaType) && ['not-confirmed','not-confirmed-owner','waiting'].includes(reservation['resa-confirmation'])">
                          <span @click="confirmResa(reservation.id)" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm cursor-pointer']">Accepter</span>
                        </MenuItem>
                        <MenuItem v-slot="{ active }" v-if="(isAdmin || isPartner) && ['urgent','active'].includes(currentResaType) && ['confirmed','confirmed-owner','waiting'].includes(reservation['resa-confirmation'])">
                          <span @click="denyResa(reservation.id)" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm cursor-pointer']">Refuser</span>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </transition>
                </Menu>
              </li>
            </ol>
            <div v-else class="p-4 my-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800" role="alert">Vous n'avez aucune résérvation pour aujourd'hui.</div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <Modal :data="selectedResa" :show="showModal" :actions="[{label:'Fermer',method:() => {showModal = false}}]" @close="showModal = false" :confirmationLabel="confirmationLabel" :allowcomment="allowcomment(selectedResa)" />
</template>

<script>
  import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'
  import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
  import { EllipsisVerticalIcon } from '@heroicons/vue/24/outline'
  import startOfToday from 'date-fns/startOfToday'
  import startOfMonth from 'date-fns/startOfMonth'
  import endOfMonth from 'date-fns/endOfMonth'
  import eachDayOfInterval from 'date-fns/eachDayOfInterval'
  import format from 'date-fns/format'
  import isSameMonth from 'date-fns/isSameMonth'
  import startOfWeek from 'date-fns/startOfWeek'
  import endOfWeek from 'date-fns/endOfWeek'
  import isToday from 'date-fns/isToday'
  import isSameDay from 'date-fns/isSameDay'
  import addMonths from 'date-fns/addMonths'
  import subMonths from 'date-fns/subMonths'
  import getMonth from 'date-fns/getMonth'
  import { fr } from 'date-fns/locale'
  import userService from '../../services/user.service'
  import isSameHour from 'date-fns/isSameHour'
  import compareAsc from 'date-fns/compareAsc'
  import differenceInHours from 'date-fns/differenceInHours'
  import Modal from '../Modal.vue'
  import EtabList from '../EtabList.vue'
  import Loader from '../Loader.vue'

  import { debounce } from 'lodash';
  export default {
    name: 'Reservations',
    components: {
      ChevronLeftIcon, ChevronRightIcon, Menu, MenuButton, MenuItem, MenuItems, EllipsisVerticalIcon, Modal, EtabList, Loader
    },
    data() {
      return {
        currentDay: new Date(),
				currentMonth: null,
        reservations: [],
        selectedResa: {},
        showModal: false,
        loading: false,
        confirmationLabel : {
          'waiting' : {
            class : 'text-yellow-800 bg-yellow-100',
            text : 'En attente de confirmation'
          },
          'confirmed' : {
            class : 'text-green-800 bg-green-100',
            text : 'Confirmée'
          },
          'not-confirmed' : {
            class : 'text-gray-700 bg-gray-300',
            text : 'Refusée'
          },
          'confirmed-owner' : {
            class : 'text-green-800 bg-green-100',
            text : 'Confirmée par le propriétaire'
          },
          'not-confirmed-owner' : {
            class : 'text-gray-700 bg-gray-300',
            text : 'Refusée par le propriétaire'
          }
        },
        currentResaType: 'active',
        now : Date.now(),
        currentProject : null,
        fullname: null
      };
    },
    mounted() {
      const today = startOfToday();
      this.setCurrentDay(today);

      setInterval(() => {
        this.now = Date.now();
        this.getReservations(this.currentDay || today);
      }, 1000*60*10); // Refresh in 10 minutes
    },
		methods: {
      oldResa({arrival}) {
        return compareAsc(new Date(),new Date(arrival)) > 0;
      },
      allowcomment({arrival}) {
        return isSameDay(new Date(arrival),Date.now())
      },
			setCurrentDay(day) {
				if( !this.currentMonth || !isSameMonth(this.currentDay,day) ){
					this.setCurrentMonth(day);
          this.getReservations(day);
        }

				this.currentDay = day;
        
        this.resetCurrentProject();
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
      getReservationsAjax : debounce(async function(day) {
        await userService.getReservations(format(day, 'Y'),format(day, 'M')).then(({data}) => {
          this.loading = false;
          this.reservations = data['resas'];
        });

        this.currentProject = this.projects[0] ? this.projects[0].value : null;
      },500),
      async noShowResa(id) {
        await userService.updateReservation(id,{'no_show':true}).then(({data}) => {
          if( data ){
            this.reservations.forEach(resa => {
              if( resa.id === id ) {
                resa['no_show'] = true;
                return
              }
            })
          }
        });
      },
      async confirmResa(id) {
        await userService.updateReservation(id,{'resa-confirmation':this.isAdmin ?'confirmed':'confirmed-owner'}).then(({data}) => {
          if( data ){
            this.reservations.forEach(resa => {
              if( resa.id === id ) {
                resa['resa-confirmation'] = this.isAdmin ?'confirmed':'confirmed-owner';
                return
              }
            })
            
            this.$store.dispatch('setUrgentResas', this.$store.state.other.urgentResas.filter(resa => id !== resa.id));
            this.$store.commit('setConfirmResas', this.$store.state.other.confirmResas.filter(resa => id !== resa.id));
            this.$store.commit('setConfirmedResas', [...this.$store.state.other.confirmedResas,...this.reservations.filter((resa) => resa.id === id)].sort((a, b) => {
              return compareAsc(new Date(a.arrival),new Date(b.arrival))
            }));

            this.$store.dispatch('updateNavigation');
          }
        });
      },
      async denyResa(id) {
        await userService.updateReservation(id,{'resa-confirmation':this.isAdmin ?'not-confirmed':'not-confirmed-owner'}).then(({data}) => {
          if( data ){
            this.reservations.forEach(resa => {
              if( resa.id === id ) {
                resa['resa-confirmation'] = this.isAdmin ?'not-confirmed':'not-confirmed-owner';
                return
              }
            })
            
            this.$store.dispatch('setUrgentResas', this.$store.state.other.urgentResas.filter(resa => id !== resa.id));
            this.$store.commit('setConfirmResas', this.$store.state.other.confirmResas.filter(resa => id !== resa.id));

            this.$store.dispatch('updateNavigation');
          }
        });
      },
      selectResa(resa) {
        console.log(resa);
        this.selectedResa = resa;
        this.showModal = true;
      },
      dateDisplay(from,to){
        from = new Date(from);
        to = new Date(to);

        let data = [];

        if( isSameDay(from,to) )
          data.push(format(from,'HH:mm'))
        else
          data.push(format(from,'dd-MM-yyyy à HH:mm'))

        if( !isSameHour(from,to) ){
          if( isSameDay(from,to) )
            data.push(format(to,'HH:mm'))
          else
            data.push(format(to,'dd-MM-yyyy à HH:mm'))
        }

        return data;
      },
      array_unique(arr) {
        return [...new Set(arr)];
      },
      changeType(index) {
        this.currentResaType = index;
        this.resetCurrentProject()
      },
      resetCurrentProject() {
        if( this.projects.length && !this.projects.find(({value}) =>  this.currentProject === value) )
          this.currentProject = this.projects[0].value;
      }
		},
    computed: {
      isAdmin() {
        return JSON.parse(localStorage.user).user_role === 'administrator' || JSON.parse(localStorage.user).user_role === 'bookagent'
      },
      isPartner() {
        return JSON.parse(localStorage.user).user_role === 'partner'
      },
      isTransporter() {
        return JSON.parse(localStorage.user).user_role === 'transporter'
      },
      dayResa() {
        const reservations = this.reservations.filter(({arrival}) => {
          return isSameDay(this.currentDay,new Date(arrival));
        }).map(resa => {
          return {...resa,...{urgent:isSameDay(new Date(resa.created_at),new Date(resa.arrival)) && resa['resa-confirmation'] === 'waiting' }};
        }).sort((a, b) => {
          return compareAsc(new Date(a.arrival),new Date(b.arrival));
        });

        let nav = {
          urgent : {
            label : 'Urgentes',
            resas : reservations.filter(resa => {
              return differenceInHours(new Date(resa.arrival),this.now) >= 0 && resa.urgent
            })
          },
          active : {
            label : 'Résas du jour',
            resas : reservations.filter(resa => {
              return !['not-confirmed','not-confirmed-owner'].includes(resa['resa-confirmation']) && !resa.urgent
            })
          },
          /*
          done : {
            label : 'Reçues',
            resas : reservations.filter(resa => {
              return differenceInHours(new Date(resa.arrival),this.now) < 0 && ['confirmed','confirmed-owner'].includes(resa['resa-confirmation'])
            })
          },
          ignored : {
            label: 'Ignorées',
            resas : reservations.filter(resa => {
              return differenceInHours(new Date(resa.arrival),this.now) < 0 && ['waiting'].includes(resa['resa-confirmation'])
            })
          }
          */
        }

        if( !this.isTransporter ){
          nav['refused'] = {
            label : 'Refusées',
            resas : reservations.filter(resa => {
              return ['not-confirmed','not-confirmed-owner'].includes(resa['resa-confirmation'])
            })
          }
        }

        return nav;
      },
      navigation() {
        return this.$store.state.other.navigation
      },
			days() {
				const today = this.currentDay || startOfToday();

				let result = eachDayOfInterval({
					start: startOfWeek(startOfMonth(today),{weekStartsOn:1}),
					end: endOfWeek(endOfMonth(today),{weekStartsOn:1})
				})

				result = result.map(day => {
					const object = {
						date : format(day,'yyyy-MM-dd'),
						isCurrentMonth : isSameMonth(today, day),
						isToday : isToday(day),
						isSelected : isSameDay(day,this.currentDay),
						iso : day,
					};
					return object;
				})

				return result;
			},
			monthYear() {
				return format(this.currentDay || startOfToday(), 'MMMM Y',{locale: fr});
			},
			fullDate() {
				return format(this.currentDay || startOfToday(), 'iiii d MMMM Y',{locale: fr})
			},
			fullDigitDate() {
				return format(this.currentDay || startOfToday(), 'Y-L-d')
			},
      projects() {
        let projects = {}
          
        this.dayResa[this.currentResaType].resas.forEach(({project_name,project}) => {
          if( !projects[project] && project_name ) projects[project] = {
            label : project_name,
            value : project
          }
        })

        projects =  Object.values(projects);

        return projects.map(item => {
          return {...item,...{ count : this.dayResa[this.currentResaType]?.resas.filter(({project}) => {
            return project === item.value
          }).length }}
        })
      }
    }
  };
</script>