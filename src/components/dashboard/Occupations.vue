<template>
  <div class="px-5 sm:px-6 lg:px-8" style="min-height: 400px;">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">Occupations</h1>
        <p class="mt-2 text-sm text-gray-700">Liste de toutes les occupations sur vos établissements/offres.</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none" v-if="!optionOccupation">
        <RouterLink class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto" to="/partenaire/occupations/nouvelle">Nouvelle occcupation</RouterLink>
      </div>
    </div>
    <Loader v-if="loading" />
    <div v-if="occupationEtab">
      <div class="sm:flex sm:items-center mt-5">
        <div class="sm:flex-auto">
          <EtabList v-model="selectedEtab" :list="projects" v-if="projects.length > 1" />
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button :disabled="!modified" v-if="optionOccupation" @click="updateOccupationAjax" class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed">Mettre à jour</button>
        </div>
      </div>

      <div class=" mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-0 md:mx-0 md:rounded-lg mb-5">
        <table class="min-w-full divide-y divide-gray-300" v-if="optionOccupation">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Champs</th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Option</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="option,index in occupationEtab.options" :key="index">
              <td class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">{{ option.placeholder }}</td>
              <td class="hidden p-0 text-sm text-gray-500 lg:table-cell">
                <table class="w-full ">
                  <tbody>
                    <tr v-for="label,indexl in option.options" :key="indexl">
                      <td class="border-slate-300 text-center" :class="{'border-x':indexl === 0 || indexl === option.options.length - 1,'border':indexl !== 0 && indexl !== option.options.length - 1}">{{ label.value }}</td>
                      <td class="border-slate-300 p-0" :class="{'border-x border-r-0':indexl === 0 || indexl === option.options.length - 1,'border-y border-r-0':indexl !== 0 && indexl !== option.options.length - 1}">
                        <div v-if="label['off-dates']" v-for="occupation,indexc in label['off-dates']" :key="indexc" class="p-3 flex space-x-4 justify-around" :class="{'bg-gray-100':indexc % 2 === 0}">
                          <Datepicker @update:model-value="modified = true" locale="fr" selectText="Choisir" cancelText="Annuler" :format="formatDate" :minDate="today" :maxDate="maxDate" v-model="occupationEtab.options[index].options[indexl]['off-dates'][indexc]['from-date']" utc />
                          <Datepicker @update:model-value="modified = true" locale="fr" selectText="Choisir" cancelText="Annuler" :format="formatDate" :minDate="minDate(occupationEtab.options[index].options[indexl]['off-dates'][indexc]['from-date'])" :maxDate="maxDate" v-model="occupationEtab.options[index].options[indexl]['off-dates'][indexc]['to-date']" utc />
                          <div class="flex items-center space-x-2">
                            <span class="cursor-pointer" v-if="modified[index+'-'+indexl+'-'+indexc]"><iconCheck></iconCheck></span>
                            <span class="cursor-pointer" @click="deleteOccupation(index,indexl,indexc)"><iconClose></iconClose></span>
                          </div>
                        </div>
                        <div class="flex justify-center p-3 bg-gray-200 shadow-inner">
                          <button @click="newOccupation(index,indexl,indexc)" class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto">Nouvelle occupation</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        <table class="min-w-full divide-y divide-gray-300" v-else>
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Offre / Établissement</th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Date/Heure de début</th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Date/Heure de fin</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="occupation,index in occupationEtab.occupations" :key="index">
              <td class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                {{ occupationEtab.name }}
                <dl class="font-normal lg:hidden">
                  <dt class="sr-only">Date/Here de début</dt>
                  <dd class="mt-1 truncate text-gray-500 text-xs"><span style="width:25px;display: inline-block;" class="font-semibold">Du : </span> {{ formatDate(occupation['from-date']) }}</dd>
                  <dt class="sr-only">Date/Heure de fin</dt>
                  <dd class="mt-1 truncate text-gray-500 text-xs"><span style="width:25px;display: inline-block;" class="font-semibold">À : </span> {{ formatDate(occupation['to-date']) }}</dd>
                </dl>
              </td>
              <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{{ formatDate(occupation['from-date']) }}</td>
              <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{{ formatDate(occupation['to-date']) }}</td>
              <td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <RouterLink class="text-primary-600 hover:text-primary-900 mr-2" :to="`/partenaire/occupations/modifier/${occupationEtab.id}-${index}`">Modifier</RouterLink>
                <span class="text-primary-600 hover:text-primary-900 cursor-pointer" @click="deleteOccupation(index)">Supprimer</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import { RouterLink } from 'vue-router'
  import userService from '../../services/user.service';
  import format from 'date-fns/format'
  import { fr } from 'date-fns/locale'
  import EtabList from '../EtabList.vue'
  import Loader from '../Loader.vue';
  import iconCheck from '../icons/iconCheck.vue';
  import iconClose from '../icons/iconClose.vue';

  import Datepicker from '@vuepic/vue-datepicker'
  import '@vuepic/vue-datepicker/dist/main.css'
  import startOfToday from 'date-fns/startOfToday'
  import { debounce } from 'lodash';

  export default {
    name: 'Occupations',
    components:{
      RouterLink,EtabList,Loader,Datepicker,iconCheck,iconClose
    },
    data() {
      return {
        enabled : false,
        occupations : [],
        selectedEtab : 0,
        loading: false,
        modified: false
      }
    },
    mounted() {
      this.getOccupations();
    },
    methods: {
      async getOccupations() {
        this.loading = true;
        this.occupations = await userService.getOccupations().then(({data}) => {
          this.selectedEtab = data[0].id;
          this.loading = false;
          return data;
        });
      },
      formatDate(date) {
				return format(new Date(date), 'd LLLL Y à HH:mm',{locale: fr})
      },
      deleteOccupation(index,indexl,indexc) {
        if( this.optionOccupation ){
          this.modified = true;
          this.occupationEtab.options[index].options[indexl]['off-dates'].splice(indexc, 1)
        } else {
          this.occupations.forEach(item => {
            if( item.id === this.selectedEtab ){
              delete item.occupations[index];
            }
            item.occupations = item.occupations.filter(oc => oc);
          });

          this.deleteOccupationAjax();
        }
      },
      newOccupation(index,indexl,indexc) {
        this.modified = true;
        this.occupationEtab.options[index].options[indexl]['off-dates'].push({'from-date':this.today,'to-date':this.today})
      },
      async updateOccupationAjax() {
        this.modified = false;
        var formattedOccupation = this.occupationEtab.options;

        formattedOccupation.forEach(function(option,index) {
          option.options.forEach(function(label,indexl) {
            label['off-dates'].forEach(function(date,indexc) {
              formattedOccupation[index].options[indexl]['off-dates'][indexc]['from-date'] = format(new Date(date['from-date']), 'Y-MM-dd HH:mm')
              formattedOccupation[index].options[indexl]['off-dates'][indexc]['to-date'] = format(new Date(date['to-date']), 'Y-MM-dd HH:mm')
            })
          })
        })

        await userService.updateOccupation_v2(this.selectedEtab,{
          occupations : formattedOccupation
        }).then(() => {
          alert('Occupations modifiées')
        });
      },
      minDate(from = null) {
        return from || this.today
      },
      deleteOccupationAjax : debounce (async function () {
        const data = this.occupations.find(({id}) => {
          return id === this.selectedEtab
        })

        await userService.updateOccupation(this.selectedEtab,{
          occupations : data['occupations']
        }).then(({data}) => {
        });
      },2000)
    },
    computed: {
      optionOccupation() {
        return this.occupationEtab && this.occupationEtab.options.length > 0
      },
			today() {
				return startOfToday();
			},
      occupation_label() {
        return this.enabled && 'Heure' || 'Date'
      },
      projects() {
        return this.occupations.map(({id,name}) => {
          return {
            value : id,
            label : name
          }
        })
      },
      occupationEtab() {
        let occupations = this.occupations.find(({id}) => {
          return id == this.selectedEtab
        })

        return occupations || null;
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