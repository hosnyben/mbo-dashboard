<template>
  <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
		<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="space-y-6">
          <div>
            <EtabList v-model="selectedOffer" :list="offers" v-if="offers.length && !editing" class="mt-5" />
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
<script>
  import Datepicker from '@vuepic/vue-datepicker'
  import '@vuepic/vue-datepicker/dist/main.css'
  import { format } from 'date-fns'
  import startOfToday from 'date-fns/startOfToday'
  import userService from '../../services/user.service';
  import EtabList from '../EtabList.vue';
  export default {
    name: 'EditOccupation',
    components: {
      Datepicker,EtabList
    },
    data() {
      return {
        from: null,
        to: null,
        selectedOffer: null,
        occupations: []
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
      },
      offers() {
        return this.$store.state.other.offers
      }
		},
    mounted() {
    },
    methods: {
      formatDay(date) {
				return format(date, 'd-MM-Y HH:mm')
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
        
        await userService.updateOccupation(this.selectedOffer,{
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