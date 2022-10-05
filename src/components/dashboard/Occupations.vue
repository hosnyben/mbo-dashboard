<template>
  <div class="px-5 sm:px-6 lg:px-8" style="min-height: 400px;">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">Occupations</h1>
        <p class="mt-2 text-sm text-gray-700">Liste de toutes les occupations sur vos établissements/offres.</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <RouterLink class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto" to="/partenaire/occupations/nouvelle">Nouvelle occcupation</RouterLink>
      </div>
    </div>
    <Loader v-if="loading" />
    <div v-if="currentOccupation">
      <EtabList v-model="selectedEtab" :list="projects" v-if="projects.length > 1" class="mt-5" />
      <div class=" mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-0 md:mx-0 md:rounded-lg mb-5">
        <table class="min-w-full divide-y divide-gray-300">
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
            <tr v-for="occupation,index in currentOccupation.occupations" :key="index">
              <td class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                {{ currentOccupation.name }}
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
                <RouterLink class="text-primary-600 hover:text-primary-900 mr-2" :to="`/partenaire/occupations/modifier/${currentOccupation.id}-${index}`">Modifier</RouterLink>
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
  import { debounce } from 'lodash';

  export default {
    name: 'Occupations',
    components:{
      RouterLink,EtabList,Loader
    },
    data() {
      return {
        enabled : false,
        occupations : [],
        selectedEtab : 0,
        loading: false
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
				return format(new Date(date), 'd MMMM Y à HH:mm',{locale: fr})
      },
      deleteOccupation(index) {
        this.occupations.forEach(item => {
          if( item.id === this.selectedEtab ){
            delete item.occupations[index];
          }
          item.occupations = item.occupations.filter(oc => oc);
        });

        this.deleteOccupationAjax();
      },
      deleteOccupationAjax : debounce (async function () {
        const data = this.occupations.find(({id}) => {
          return id === this.selectedEtab
        })

        await userService.updateOccupation(this.selectedEtab,{
          occupations : data['occupations']
        }).then(({data}) => {
        });
      },2000),
    },
    computed: {
      occupation_label() {
        return this.enabled && 'Heure' || 'Date'
      },
      projects() {
        return this.occupations.map(({id,name,occupations}) => {
          return {
            value : id,
            label : name,
            count : occupations.length || 0
          }
        })
      },
      currentOccupation() {
        let occupations = this.occupations.filter(({id}) => {
          return id == this.selectedEtab
        })

        return occupations[0] || null;
      }
    }
  };
</script>