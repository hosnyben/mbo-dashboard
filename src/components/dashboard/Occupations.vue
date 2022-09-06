<template>
  <div class="px-5 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">Occupations</h1>
        <p class="mt-2 text-sm text-gray-700">Liste de toutes les occupations sur vos établissements/offres.</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <RouterLink class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto" to="/partenaire/occupations/nouvelle">Nouvelle occcupation</RouterLink>
      </div>
    </div>
    <div  v-if="currentOccupation">
      <div class="sm:hidden my-5">
        <label for="tabs" class="sr-only">Votre établissement</label>
        <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
        <select id="tabs" name="tabs" class="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500">
          <option v-for="tab in tabs" :key="tab.id" :selected="tab.current">{{ tab.name }}</option>
        </select>
      </div>
      <div class="hidden sm:block my-5">
        <nav class="isolate flex divide-x divide-gray-200 rounded-lg shadow" aria-label="Tabs">
          <span v-for="tab,index in tabs" :key="tab.name" @click="selectedEtab = tab.id" :class="[tab.current ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700', index === 0 ? 'rounded-l-lg' : '', index === tabs.length - 1 ? 'rounded-r-lg' : '', 'cursor-pointer group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10']" :aria-current="index === selectedEtab ? 'page' : undefined">
            <span>{{ tab.name }}</span>
            <span aria-hidden="true" :class="[tab.current ? 'bg-primary-500' : 'bg-transparent', 'absolute inset-x-0 bottom-0 h-0.5']" />
          </span>
        </nav>
      </div>
      <div class="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg mb-5">
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

<script setup>
  import { RouterLink } from 'vue-router'
  import userService from '../../services/user.service';
  import format from 'date-fns/format'
  import { fr } from 'date-fns/locale'
</script>
<script>
  import { debounce } from 'lodash';
  export default {
    name: 'Occupations',
    data() {
      return {
        enabled : false,
        occupations : [],
        selectedEtab : 0
      }
    },
    mounted() {
      this.getOccupations();
    },
    methods: {
      async getOccupations() {
        this.occupations = await userService.getOccupations().then(({data}) => {
          this.selectedEtab = data[0].id;
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
          console.log(data);
        });
      },2000),
    },
    computed: {
      occupation_label() {
        return this.enabled && 'Heure' || 'Date'
      },
      tabs() {
        return this.occupations.map(({id,name}) => {
          return {
            id : id,
            name : name,
            current : id === this.selectedEtab
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