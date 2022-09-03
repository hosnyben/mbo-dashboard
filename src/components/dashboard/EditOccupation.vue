<template>
  <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
		<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" action="#" method="POST">
          <div>
						<Listbox as="div" v-model="selected">
							<ListboxLabel class="block text-sm font-medium text-gray-700">Assigned to</ListboxLabel>
							<div class="relative mt-1">
								<ListboxButton class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm">
									<span class="block truncate">{{ selected.name }}</span>
									<span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
										<ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
									</span>
								</ListboxButton>

								<transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
									<ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
										<ListboxOption as="template" v-for="person in people" :key="person.id" :value="person" v-slot="{ active, selected }">
											<li :class="[active ? 'text-white bg-primary-600' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
												<span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ person.name }}</span>

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
						<label class="block text-sm font-medium text-gray-700 mb-1">Établissement occupé du</label>

            <div class="flex items-center space-x-2">
							<Datepicker range :minDate="today" v-model="date" :enableTimePicker="false"></Datepicker>
							<Datepicker timePicker v-model="date" class="timer"></Datepicker>
						</div>
					</div>
          <div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Établissement occupé jusqu'au</label>

            <div class="flex items-center space-x-2">
							<Datepicker range :minDate="today" v-model="date" :enableTimePicker="false"></Datepicker>
							<Datepicker timePicker v-model="date" class="timer"></Datepicker>
						</div>
					</div>

          <div>
            <button type="submit" class="flex w-full justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">Ajouter {{ $route.params.id }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import startOfToday from 'date-fns/startOfToday'

const people = [
  { id: 1, name: 'Wade Cooper' },
  { id: 2, name: 'Arlene Mccoy' },
  { id: 3, name: 'Devon Webb' },
  { id: 4, name: 'Tom Cook' },
  { id: 5, name: 'Tanya Fox' },
  { id: 6, name: 'Hellen Schmidt' },
  { id: 7, name: 'Caroline Schultz' },
  { id: 8, name: 'Mason Heaney' },
  { id: 9, name: 'Claudie Smitham' },
  { id: 10, name: 'Emil Schaefer' },
]

const selected = ref(people[3])
</script>
<script>
export default {
  name: 'EditOccupation',
    data() {
      return {
        date: null
      };
    },
		computed: {
			today() {
				return startOfToday();
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
</style>