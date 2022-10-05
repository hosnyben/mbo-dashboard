<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">Toutes les réservations</h1>
        <p class="mt-2 text-sm text-gray-700">Liste de toutes les réservations classées par date de création</p>
      </div>
    </div>
		<div class="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mb-5">
			<div class="flex items-center justify-between bg-white px-4 py-3 sm:px-6 w-full">
				<VuePaginationTw
					:key="pagesCount"
					:total-items="pagesCount"
					:current-page="currentPage"
					:per-page="itemPerPage"
					@page-changed="changePage"
					class="w-full pagination"
				/>
			</div>
		</div>
    <Loader v-if="loading" />
    <div v-else>
      <EtabList v-model="currentProject" v-model:title="fullname" :list="projects" class="mt-5" :filterByName="true" />
      <div class="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mb-5">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">ID de réservation</th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell w-102">Établissement</th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Nom du client</th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Nombre de personnes</th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Arrivé</th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">État</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="resa in reservations" :key="resa.id">
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
              <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell"><div class="w-52">{{ offers.find(({value}) => value === resa.project)?.label || resa.project_name }}</div></td>
              <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell cusrsor-pointer">{{ resa['full-name'] }}<br/>{{ resa['country-phone']+resa['phone'] }}<br/><span v-if="resa['tr-transport']" class="inline-block flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium bg-primary-100 text-white">Avec Transport</span></td>
              <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{{ resa['nbr-adult'] }} Adultes - {{ resa['nbr-children'] || 0 }} Enfants</td>
              <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{{ dateDisplay(resa.arrival) }}</td>
              <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell"><span class="inline-block flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium" :class="confirmationLabel[resa['resa-confirmation']].class">{{confirmationLabel[resa['resa-confirmation']].text }}</span></td>
              <td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <span class="text-primary-600 hover:text-primary-900 cursor-pointer" @click="selectResa(resa)">Détails</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 w-full">
          <VuePaginationTw
						:key="pagesCount"
            :total-items="pagesCount"
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
  import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'
  import Loader from '../Loader.vue'
  import { debounce } from 'lodash'
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
        staff : [],
        currentPage: 1,
        itemPerPage: 25,
				pagesCount: 0,
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
          'canceled' : {
            class : 'text-gray-700 bg-gray-300',
            text : 'Annulée'
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
        fullname: '',
        currentProject: ''
      }
    },
    async mounted() {
			this.staff = await userService.getAdmins().then(({data}) => {        
				return data
			})

			this.getReservations();
    },
    computed: {
      projects() {
        return this.$store.state.other.offers
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
        return this.$store.state.other.offers;
      }
    },
    methods: {
      filteredResa(id) {
        return this.reservations.filter(resa => {return resa.id !== id})
      },
      changePage(target) {
        this.currentPage = target;
				this.getReservations();
      },
      getReservations() {
        this.loading = true;
        this.getReservationsAjax();
      },
      getReservationsAjax : debounce(async function () {
        this.loading = true;
        const datas = {paged : this.currentPage};

        if( this.fullname ) datas.s = this.fullname;
        if( this.currentProject ) datas.project = this.currentProject;

        await userService.getReservations(null,null,datas).then(({data}) => {
          this.loading = false;

          this.reservations = data['resas'];
					this.pagesCount = data['posts_count'];
        });
      },1000),
      currentAgent(resa) {
        return this.staff.find(({id}) => id == resa.post_author && resa.post_author !== 1 )?.name || null
      },
      selectResa(resa) {
        this.selectedResa = resa;
        this.showModal = true;
      },
      dateDisplay(from){
        from = new Date(from);
        return format(from,'dd-MM-yyyy à HH:mm')
      },
      async confirmResa(resa) {
        this.showModal = false;
        this.reservations = await updateResaConfirmation(resa,this.reservations,'confirmed');
      },
      async denyResa(resa) {
        this.showModal = false;
        this.reservations = await updateResaConfirmation(resa,this.reservations,'not-confirmed');
      },
    },
    watch: {
      fullname(val,old) {
        if( old !== val ) {
          this.getReservationsAjax();
        }
      },
      currentProject(val,old) {
        if( old !== val ) {
          this.getReservationsAjax();
        }
      }
    }
  };
</script>