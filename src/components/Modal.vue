<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-10" @close="show = false">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full max-w-4xl">
              <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                <div class="px-4 py-5 sm:px-6">
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">{{ data['full-name'] }} #{{ data.id }}</DialogTitle>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500">Date de réservation 
                    <time :datetime="dateDisplayRange(data.arrival,data.departure)[0]">{{ dateDisplayRange(data.arrival,data.departure)[0] }}</time>
                    <time :datetime="dateDisplayRange(data.arrival,data.departure)[1]" v-if="dateDisplayRange(data.arrival,data.departure)[1]"> - {{ dateDisplayRange(data.arrival,data.departure)[1] }}</time>
                  </p>
                  <span class="mr-2 inline-block flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800" v-if="data.urgent">Dernière minute</span>
                  <span v-if="confirmationLabel[data['resa-confirmation']]" class="mr-2 inline-block flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium" :class="confirmationLabel[data['resa-confirmation']].class">{{confirmationLabel[data['resa-confirmation']].text}}</span>
                  <span class="inline-block flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium bg-primary-100 text-white">{{ data.project_name}}</span>
                </div>
                <div class="px-4 pb-4 sm:px-6" v-if="isAdmin">
                  <SwitchGroup as="div" class="flex items-center">
                    <Switch v-model="editMode" :class="[editMode ? 'bg-primary-600' : 'bg-gray-200', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2']">
                      <span aria-hidden="true" :class="[editMode ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']" />
                    </Switch>
                    <SwitchLabel as="span" class="ml-3">
                      <span class="text-sm font-medium text-gray-900">Modifier réservation</span>
                      <!-- <span class="text-sm text-gray-500">(Save 10%)</span> -->
                    </SwitchLabel>
                  </SwitchGroup>
                </div>
                <div class="border-t border-gray-200">
                  <dl class="dashed">
                    <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Nom complet</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ data['full-name'] }}</dd>
                    </div>
                    <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Adresse E-mail</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <input v-if="editMode" type="text" v-model="data.email" class="w-56 block rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" placeholder="Adresse e-mail" />
                        <span v-else>{{ data.email }}</span>
                      </dd>
                    </div>
                    <div v-if="isAdmin" class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Établissement</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <div v-if="editMode" class="md:space-x-10 md:flex space-y-5 md:space-y-0">
                          <div class="w-56">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Établissement</label>
                            <EtabList v-if="offers.length > 1" v-model="data.project" :list="offers" />
                          </div>
                          <div class="w-56">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Type de logement</label>
                            <input v-if="editMode" type="text" v-model="data.logtype" class="block rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" placeholder="Type de logement" />
                          </div>
                        </div>
                        <span v-else>
                          {{ offers.find(({value}) => value === data.project)?.label }}<br/>
                          <span v-if="data.logtype" class="text-xs">
                            Type de logement : {{ data.logtype }}
                          </span>
                        </span>
                      </dd>
                    </div>
                    <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Téléphone</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <div v-if="editMode" class="md:flex items-center space-x-2">
      	                  <input type="text" v-model="data['country-phone']" class="w-12 block rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" placeholder="212" />
      	                  <input type="text" v-model="data.phone" class="w-40 block rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" placeholder="123456789" />
                        </div>
                        <span v-else>{{ data['country-phone'] }}{{ data.phone }}</span>
                      </dd>
                    </div>
                    <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Nombre de personnes</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <div v-if="editMode" class="md:flex items-center space-x-10">
                          <div>
                            <label class="block text-sm font-medium text-gray-700">Adultes</label>
                            <input type="text" v-model="data['nbr-adult']" class="mt-1 w-12 block rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" placeholder="1" />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700">Enfants</label>
                            <input type="text" v-model="data['nbr-children']" class="mt-1 w-12 block rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" placeholder="0" />
                          </div>
                        </div>
                        <span v-else>{{ data['nbr-adult'] }} Adultes - {{ data['nbr-children'] || 0 }} Enfants</span>
                      </dd>
                    </div>
                    <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Date/Heure {{isTransporter?'de Pickup':'d\'arrivé'}}</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <div v-if="editMode" class="w-56">
                          <Datepicker locale="fr" selectText="Choisir" cancelText="Annuler" :format="formatDay" :minDate="today" v-model="data.arrival" @update:modelValue="(val) => reformatDate(val,'arrival')"></Datepicker>
                        </div>
                        <span v-else>{{ isTransporter?dateDisplay(advanceHour(data.arrival,data['tr-advance'] ? parseInt(data['tr-advance']) : 0)):dateDisplay(data.arrival) }}</span>
                      </dd>
                    </div>
                    <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6" v-if="!isTransporter">
                      <dt class="text-sm font-medium text-gray-500">Date/Heure de départ</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <div v-if="editMode" class="w-56">
                          <Datepicker locale="fr" selectText="Choisir" cancelText="Annuler" :format="formatDay" :minDate="today" v-model="data.departure" @update:modelValue="(val) => reformatDate(val,'departure')"></Datepicker>
                        </div>
                        <span v-else>{{ dateDisplay(data.departure) }}</span>
                      </dd>
                    </div>
                    <div v-if="isAdmin" class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Transport</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <div v-if="editMode" class="md:space-x-10 md:flex space-y-5 md:space-y-0">
                          <div class="w-56">
                            <SwitchGroup as="div" class="flex items-center">
                              <Switch v-model="data['tr-transport']" :class="[data['tr-transport'] ? 'bg-primary-600' : 'bg-gray-200', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2']">
                                <span aria-hidden="true" :class="[data['tr-transport'] ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']" />
                              </Switch>
                              <SwitchLabel as="span" class="ml-3">
                                <span class="text-sm font-medium text-gray-900">Transport</span>
                              </SwitchLabel>
                            </SwitchGroup>
                          </div>
                          <div v-if="data['tr-transport']" class="w-56">
                            <label class="block text-sm font-medium text-gray-700 mb-1">À récuperer de</label>
                            <input type="text" v-model="data['tr-project']" class="block rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" placeholder="À récuperer de" />
                          </div>
                        </div>
                        <span v-else>
                          Transport : {{ data['tr-transport'] ? 'Oui' : 'Non' }}<br />
                          <span class="text-xs" v-if="data['tr-transport']">À récuperer de : {{ data['tr-project'] || '...' }}</span>
                        </span>
                      </dd>
                    </div>
                    <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6" v-if="isAdmin &&  data['tr-transport']">
                      <dt class="text-sm font-medium text-gray-500">Attribuer à un transporteur</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <select v-model="data['tr-agent']" class="w-56 mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" @change="() => {edited = true}">
                          <option>Choisir</option>
                          <option v-for="transporter in transporters" :key="transporter.id" :value="transporter.id">{{ transporter.name }}</option>
                        </select>
                        <div class="flex space-x-2 mt-2 items-center" v-if="data['tr-agent']">
                          <input type="text" v-model="data['tr-advance']" class="w-12 block rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" placeholder="00" @input="() => {edited = true}" />
                          <label class="block text-sm font-medium text-gray-700">Minutes avant le RV</label>
                        </div>
            					</dd>
                    </div>
                    <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Commentaire du client</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 italic">
                        {{ data.comments || 'Aucun' }}
                      </dd>
                    </div>
                    <div v-if="isAdmin || isPartner" class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Détails</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <ul role="list" class="divide-y divide-gray-200 rounded-md border border-gray-200" v-if="data.fields">
                          <li class="flex items-center justify-between py-3 pl-3 pr-4 text-sm" v-for="(field,index) in data.fields" :key="index">
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
                    <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6" v-if="isAdmin">
                      <dt class="text-sm font-medium text-gray-500">Commentaire du propriétaire</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 italic">
                        {{data['partner-comment'] || 'Aucun'}}
            					</dd>
                    </div>
                    <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6" v-if="isAdmin">
                      <dt class="text-sm font-medium text-gray-500">Commentaire du staff</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 italic">
												<textarea id="about" name="about" rows="3" class="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" v-model="data['inner-comment']" @input="() => {edited = true}" />
            					</dd>
                    </div>
                    <div v-else-if="isPartner" class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Commentaire du propriétaire</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 italic">
                        <div v-if="allowcomment">
                          <textarea id="about" name="about" rows="3" class="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" v-model="data['partner-comment']" @input="() => {edited = true}" />
                        </div>
                        <p v-else>Vous n'êtes pas autorisé à commenter sur cette réservation</p>
            					</dd>
                    </div>
                  </dl>
                </div>
              </div>
              <div  class="mt-5 sm:flex sm:justify-between px-5 sm:space-x-5">
                <div class="sm:flex sm:justify-center space-x-2" v-if="isAdmin && resaType && resaType !== 'partner_calendar_confirmed'">
                  <button type="button" class="my-1 disabled:bg-gray-100 disabled:cursor-not-allowed inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm" @click="wsp(true)"><img class="h-5 mr-2 w-auto" src="@/assets/wsp.svg" alt="Workflow" /> Confirmer</button>
                  <button type="button" class="my-1 disabled:bg-gray-100 disabled:cursor-not-allowed inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm" @click="wsp(false)"><img class="h-5 mr-2 w-auto" src="@/assets/wsp.svg" alt="Workflow" /> Refuser</button>
                </div>
                <div class="sm:flex sm:justify-center space-x-2">
                  <button :disabled="loading" v-if="edited" type="button" class="my-1 disabled:bg-gray-100 disabled:cursor-not-allowed inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm" @click="updateResaData(() => {})">Enregistrer</button>
                  <button :disabled="loading" v-for="action in actions" type="button" class="my-1 disabled:bg-gray-100 disabled:cursor-not-allowed inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm" @click="triggerMethod(action.method)">{{(edited) ? 'Modifier et ':''}}{{ action.label }}</button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
  import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot, Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'
  import format from 'date-fns/format'
  import isSameDay from 'date-fns/isSameDay'
  import isSameHour from 'date-fns/isSameHour'
  import userService from '../services/user.service';
  import EtabList from './EtabList.vue';
  import compareAsc from 'date-fns/compareAsc';
  import Datepicker from '@vuepic/vue-datepicker'
  import subMinutes from 'date-fns/subMinutes'

  export default {
    name: 'Modal',
    components : {
      Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot, Switch, SwitchGroup, SwitchLabel,EtabList, Datepicker
    },
		props: {
			show : {
				type: Boolean,
				default : false
			},
			data : {
				type: Array,
				default : []
			},
			actions : {
				type: Array,
				default : []
			},
			confirmationLabel : {
				type: Array,
				default : []
			},
			allowcomment : {
				type: Boolean,
				default: false
			},
      resaType : {}
		},
    data() {
      return {
        loading : false,
        editMode : false,
        edited : false,
        transporters : []
      }
    },
    async mounted() {
      if( this.isAdmin )
      this.transporters = await userService.getTransporters().then(({data}) => {        
        return data
      })
    },
    computed: {
      isAdmin() {
        return JSON.parse(localStorage.user).user_role === 'administrator' || JSON.parse(localStorage.user).user_role === 'bookagent';
      },
      isPartner() {
        return JSON.parse(localStorage.user).user_role === 'partner';
      },
      isTransporter() {
        return JSON.parse(localStorage.user).user_role === 'transporter';        
      },
      offers() {
        return this.$store.state.other.offers
      }
    },
    watch: {
      editMode (val,old) {
        if( val !== old && !this.edited )
          this.edited = true;
      },
      show(val,old) {
        this.edited = false;
        this.editMode = false;
      }
    },
		methods: {
      formatDay(date) {
				return format(date, 'd-MM-Y HH:mm')
      },
      wsp(response) {
        let text;
        
        if( response )
          text = `Bonjour ${this.data['full-name']}, c'est Marrakech Best Of ! Nous venons de vous envoyer la confirmation de réservation par e-mail (Vérifiez dans vos spams si vous n'avez rien reçu). Avez-vous prévu d'autres activités (quad, dromadaire, spa, journée piscine, restaurants, excursions) ? Je suis disponible pour vous conseiller le meilleur à faire pour vos vacances.`;
        else
          text = `Bonjour ${this.data['full-name']}, vous venez de réserver sur Marrakech Best Of. Votre réservation a été refusée par l'établissement car c'est complet. Souhaitez vous aller ailleurs ?`;
        
        window.open(`https://wa.me/${this.data['country-phone'].replace('+','')}${this.data.phone}?text=${text}`,'_blank');
      },
      triggerMethod(method = () => {}){
        if( this.edited )
          this.updateResaData(method)
        else
          method();
      },
			closeModal() {
				this.$emit('close')
			},
      dateDisplayRange(from,to){
        from = new Date(from);
        to = new Date(to);

        let data = [];

        if( isSameDay(from,to) )
          data.push('Aujourd\'hui à '+format(from,'HH:mm'))
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
      reformatDate(from,target){
        this.data[target] = format(from,'yyyy-MM-dd HH:mm')
      },
      dateDisplay(from){
        from = new Date(from);
        if( this.resaType === 'partner_calendar_urgent' )
          return format(from,'HH:mm')
        else
          return format(from,'dd-MM-yyyy à HH:mm')
      },
      advanceHour(time,minutes) {
        time = new Date(time);
        return subMinutes(time, minutes)
      },
      async updateResaData(method = () => {}) {
        this.loading = true;
        await userService.updateReservation(this.data.id,this.data).then(({data}) => {
          if( data ){
            this.loading = false;

            if( this.resaType ){
              switch (this.resaType) {
                case 'partner_calendar_urgent':
                  this.$store.dispatch(
                    'setUrgentResas', 
                    [
                      ...this.$store.state.other.urgentResas.filter(resa => {
                        return this.data.id !== resa.id
                      }),
                      ...[this.data]
                    ].sort((a, b) => {
                      return compareAsc(new Date(a.arrival),new Date(b.arrival))
                    })
                  );
                  break;
                case 'partner_calendar_confirm':
                  this.$store.commit(
                    'setConfirmResas', 
                    [
                      ...this.$store.state.other.confirmResas.filter(resa => {
                        return this.data.id !== resa.id
                      }),
                      ...[this.data]
                    ].sort((a, b) => {
                      return compareAsc(new Date(a.arrival),new Date(b.arrival))
                    })
                  );
                  break;
                case 'partner_calendar_confirmed':
                  this.$store.commit(
                    'setConfirmedResas', 
                    [
                      ...this.$store.state.other.confirmedResas.filter(resa => {
                        return this.data.id !== resa.id
                      }),
                      ...[this.data]
                    ].sort((a, b) => {
                      return compareAsc(new Date(a.arrival),new Date(b.arrival))
                    })
                  );
                  break;
              
                default:
                  break;
              }

              this.$store.dispatch('updateNavigation');
            }
            
            method();
            this.closeModal();
          }
        });
      },
		},
  };
</script>
<style lang="scss">
  .dashed {
    > :nth-child(2n+1) {
      background-color: rgb(249 250 251 / 1)
    }
    > :nth-child(2n) {
      background-color: white;
    }
  }
</style>