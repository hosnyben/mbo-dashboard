<template>
  <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
		<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="space-y-6">
          <div>
						<Listbox as="div" v-model="selectedOffer" :disabled="editing">
							<ListboxLabel class="block text-sm font-medium text-gray-700">Établissement / Offre</ListboxLabel>
							<div class="relative mt-1">
								<ListboxButton class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm">
									<span class="block truncate">{{ selectedOffer?.name || 'Choisir' }}</span>
									<span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
										<ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
									</span>
								</ListboxButton>

								<transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
									<ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
										<ListboxOption as="template" v-for="offer in offers" :key="offer.id" :value="offer" v-slot="{ active, selected }">
											<li :class="[active ? 'text-white bg-primary-600' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
												<span :class="[active ? 'font-semibold' : 'font-normal', 'block truncate']">{{ offer.name }}</span>

												<span v-if="selected" :class="[active ? 'text-white' : 'text-primary-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
													<CheckIcon class="h-5 w-5" aria-hidden="true" />
												</span>
											</li>
										</ListboxOption>
									</ListboxOptions>
								</transition>
							</div>
						</Listbox>
					</div>
          <div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Période d'occupation</label>

            <div class="flex items-center space-x-2">
							<Datepicker locale="fr" selectText="Choisir" cancelText="Annuler" :format="formatDay" :minDate="today" v-model="from"></Datepicker>
              <Datepicker locale="fr" selectText="Choisir" cancelText="Annuler" :format="formatDay" :minDate="today" v-model="to"></Datepicker>
						</div>
					</div>

          <div class="flex flex-row justify-center space-x-2">
            <button :disabled="disabled" @click="setOccupation(false)" class="rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer">{{ editing ? 'Modifier' : 'Ajouter'}}</button>
            <button v-if="!editing" :disabled="disabled" @click="setOccupation(true)" class="rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer">Ajouter et rester</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import startOfToday from 'date-fns/startOfToday'
import userService from '../../services/user.service';
</script>
<script>
export default {
  name: 'EditOccupation',
    data() {
      return {
        from: null,
        to: null,
        selectedOffer: null,
        occupations: [],
        offers : []
      };
    },
		computed: {
			today() {
				return startOfToday();
			},
      disabled() {
        return !this.from || !this.to || !this.selectedOffer
      },
      editing() {
        return this.$route.params.id ? true : false;
      },
      occupationKey() {
        return this.editing ? parseInt(this.$route.params.id.split('-')[1]) : null;
      },
      currentOccupations() {
        return this.occupations.find(({id}) => {
          return id === parseInt(this.$route.params.id.split('-')[0])
        })['occupations']
      }
		},
    mounted() {
      this.getOffers();
    },
    methods: {
      async getOffers() {
        this.offers = await userService.getOffers().then(({data}) => {
          if( this.editing ){
            const currentEtab = data.find( ({id}) => {
              return id === parseInt(this.$route.params.id.split('-')[0])
            })
            this.selectedOffer = currentEtab || null;
          }else
            this.selectedOffer = data[0] || null;


          this.getOccupations();
          return data
        })
      },
      async getOccupations() {
        this.occupations = await userService.getOccupations().then(({data}) => {
          if( this.selectedOffer ){
            const tofetch = data.find( ({id}) => {
              return id === this.selectedOffer.id
            })
            this.from = tofetch ? new Date(tofetch.occupations[this.occupationKey]['from-date']) : null;
            this.to = tofetch ? new Date(tofetch.occupations[this.occupationKey]['to-date']) : null;
          }
          return data;
        });
      },
      formatDay(date) {
				return format(date, 'd-MM-Y HH:mm',{locale: fr})
      },
      async setOccupation(stay = false) {
        const data = {
          'from-date' : format(this.from, 'Y-MM-d HH:mm:ss'),
          'to-date' : format(this.to, 'Y-MM-d HH:mm:ss')
        };

        let toSend = [];

        if( this.occupations.length ){
          this.occupations.forEach(item => {
            if( item.id === this.selectedOffer.id ){
              if( this.occupationKey != null && item['occupations'][this.occupationKey] )
                item['occupations'][this.occupationKey] = data;
              else
                item['occupations'].push(data);
  
              toSend = item['occupations'];
              return;
            }
          });
        }else{
          toSend.push(data);
        }
        
        await userService.updateOccupation(this.selectedOffer.id,{
          occupations : toSend
        }).then(({data}) => {
          if( stay ) {
            this.from = null;
            this.to = null;
          }else {
            this.$router.push('/partenaire/occupations');
          }
        });
      }
    }
  };
</script>
<style lang="scss">
.dp__theme_light {
--dp-primary-color : #ac9466;
}
.dp__calendar_header_item {
  font-weight: 400;
}

.dp__action_buttons {
  font-size: 14px;
}

span.dp__action {
  font-weight: 500;
}

span.dp__action.dp__select {
  color: #ac9466;
}

.dp__today {
  border-color: #ac9466;
}

.dp__menu.dp__menu_index.dp__theme_light {
  padding: 12px 15px 3px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.timer .dp__calendar > div {
  height: 119px !important;
}

.dp__action_row {
    flex-direction: column;
}

.dp__selection_preview {
    font-weight: 500;
    width: 100%;
    color: #ac9466;
    font-size: 18px;
}

.dp__action_buttons {
    width: 100%;
}
</style>