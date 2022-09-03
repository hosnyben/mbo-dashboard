<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">Occupations</h1>
        <p class="mt-2 text-sm text-gray-700">Liste de toutes les occupations sur votre établissement.</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <RouterLink class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto" to="/partenaire/occupations/nouvelle">Nouvelle occcupation</RouterLink>
      </div>
    </div>
    <div class="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
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
          <tr v-for="occupations in people" :key="occupations.to">
            <td class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
              {{ occupations.name }}
              <dl class="font-normal lg:hidden">
                <dt class="sr-only">Date/Here de début</dt>
                <dd class="mt-1 truncate text-gray-500 text-xs"><span style="width:25px;display: inline-block;" class="font-semibold">Du : </span> {{ occupations.from }}</dd>
                <dt class="sr-only">Date/Heure de fin</dt>
                <dd class="mt-1 truncate text-gray-500 text-xs"><span style="width:25px;display: inline-block;" class="font-semibold">À : </span> {{ occupations.to }}</dd>
              </dl>
            </td>
            <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{{ occupations.from }}</td>
            <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{{ occupations.to }}</td>
            <td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <RouterLink class="text-primary-600 hover:text-primary-900" to="/partenaire/occupations/modifier/5">Edit<span class="sr-only">, {{ occupations.name }}</span></RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
      <nav class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6" aria-label="Pagination">
        <div class="hidden sm:block">
          <p class="text-sm text-gray-700">
            Showing
            {{ ' ' }}
            <span class="font-medium">1</span>
            {{ ' ' }}
            to
            {{ ' ' }}
            <span class="font-medium">10</span>
            {{ ' ' }}
            of
            {{ ' ' }}
            <span class="font-medium">20</span>
            {{ ' ' }}
            results
          </p>
        </div>
        <div class="flex flex-1 justify-between sm:justify-end">
          <a href="#" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
          <a href="#" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
const people = [
  { name: 'Lindsay Walton', from: 'Front-end Developer', to: 'lindsay.walton@example.com', },
  // More people...
]
</script>
<script>
  export default {
    name: 'Occupations',
    data() {
      return {
        enabled : false
      }
    },
    computed: {
      occupation_label() {
        return this.enabled && 'Heure' || 'Date'
      }
    }
  };
</script>
