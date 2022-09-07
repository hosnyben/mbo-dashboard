<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-10" @close="show = false">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                <div class="px-4 py-5 sm:px-6">
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">{{ data['full-name'] }} #{{ data.id }}</DialogTitle>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500">Date de réservation 
                    <time :datetime="dateDisplay(data.arrival,data.departure)[0]">{{ dateDisplay(data.arrival,data.departure)[0] }}</time>
                    <time :datetime="dateDisplay(data.arrival,data.departure)[1]" v-if="dateDisplay(data.arrival,data.departure)[1]"> - {{ dateDisplay(data.arrival,data.departure)[1] }}</time>
                  </p>
                  <span class="mr-2 inline-block flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800" v-if="data.urgent">Dernière minute</span>
                  <span v-if="confirmationLabel[data['resa-confirmation']]" class="mr-2 inline-block flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium" :class="confirmationLabel[data['resa-confirmation']].class">{{confirmationLabel[data['resa-confirmation']].text}}</span>
                  <span class="ml-2 inline-block flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium bg-primary-100 text-white">{{ data.project}}</span>
                </div>
                <div class="border-t border-gray-200">
                  <dl>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Nom complet</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ data['full-name'] }}</dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Adresse E-mail</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ data.email }}</dd>
                    </div>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Téléphone</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ data['country-phone'] }}{{ data.phone }}</dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Nombre de personnes</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ data['nbr-adult'] }} Adultes - {{ data['nbr-children'] || 0 }} Enfants</dd>
                    </div>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Commentaire du client</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 italic">{{ data.comments || 'Aucun' }}</dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
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
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6" v-if="allowcomment">
                      <dt class="text-sm font-medium text-gray-500">Commentaire du Staff</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 italic">
												<textarea id="about" name="about" rows="3" class="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" v-model="data.team_comment" />
            					</dd>
                    </div>
                  </dl>
                </div>
              </div>
              <div  class="mt-5 flex justify-center">
                <button v-if="allowcomment" type="button" class="mx-5 inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm" @click="updateResaComment">Ajouter commentaire</button>
                <button v-for="action in actions" type="button" class="mx-5 inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm" @click="action.method">{{ action.label }}</button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from '@headlessui/vue'
import format from 'date-fns/format'
import isSameDay from 'date-fns/isSameDay'
import isSameHour from 'date-fns/isSameHour'
import userService from '../services/user.service';
</script>
<script>
  export default {
    name: 'Modal',
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
			}
		},
    data() {
    },
    mounted() {
    },
		methods: {
			closeModal() {
				this.$emit('close')
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
      async updateResaComment() {
        await userService.updateReservation(this.data.id,{'inner-comment':this.data.team_comment}).then(({data}) => {
          if( data ){
            this.closeModal()
          }
        });
      },
		},
  };
</script>