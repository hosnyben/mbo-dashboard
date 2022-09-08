<template>
  <Combobox as="div" v-model="currentVal" :class="class">
    <ComboboxLabel v-if="label" class="block text-sm font-medium text-gray-700">{{label}}</ComboboxLabel>
    <div class="relative mt-1">
      <ComboboxInput class="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" @change="search = $event.target.value" :display-value="(item) => item?.label" />
      <ComboboxButton class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
      </ComboboxButton>

      <ComboboxOptions v-if="filteredResult.length > 0" class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
        <ComboboxOption v-for="item in filteredResult" :key="item.id" :value="item" as="template" v-slot="{ active, selected }">
          <li :class="['relative cursor-default select-none py-2 pl-8 pr-4', active ? 'bg-indigo-600 text-white' : 'text-gray-900']">
            <span :class="['block truncate', selected && 'font-semibold']">
              {{ item.label }} <span v-if="item.count">({{item.count}})</span>
            </span>

            <span v-if="selected" :class="['absolute inset-y-0 left-0 flex items-center pl-1.5', active ? 'text-white' : 'text-indigo-600']">
              <CheckIcon class="h-5 w-5" aria-hidden="true" />
            </span>
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </div>
  </Combobox>
</template>

<script setup>
	import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
	import { Combobox,ComboboxButton,ComboboxInput,ComboboxLabel,ComboboxOption,ComboboxOptions } from '@headlessui/vue'
</script>
<script>
  export default {
    name: 'EtabList',
		props: {
			class : {
				type : String
			},
			modelValue : {},
			list : {
				type: Array,
				default : []
			},
			label : {}
		},
    data() {
			return {
				search : null
			}
    },
    mounted() {
    },
		computed: {
			currentVal: {
				get() {
					return this.list.find(item => {
						return item.value === this.modelValue
					})
				},set(val) {
					this.$emit('update:modelValue',val.value);
				}
			},
			filteredResult() {
				if( this.search )
					return this.list.filter(({label}) => {
						return label.toLowerCase().includes(this.search.toLowerCase())
					})
				else
					return this.list;
			}
		}
  };
</script>