<template>
	<div class="md:flex items-center md:space-x-2 space-y-2 md:space-y-0" :class="class">
		<Combobox as="div" v-model="currentVal" class="w-full">
			<ComboboxLabel v-if="label" class="block text-sm font-medium text-gray-700">{{label}}</ComboboxLabel>
			<div class="relative">
				<ComboboxInput class="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm" :key="list.length" @change="search = $event.target.value" :display-value="() => { return displayValue }" />
				<ComboboxButton class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
					<ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
				</ComboboxButton>
	
				<ComboboxOptions v-if="filteredResult.length > 0" class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
					<ComboboxOption v-for="item in filteredResult" :key="item.value" :value="item.value" as="template" v-slot="{ active, selected }">
					<li :class="['relative cursor-default select-none py-2 pl-8 pr-4', active ? 'bg-primary-600 text-white' : 'text-gray-900']">
						<span :class="['block truncate', selected && 'font-semibold']">
						{{ item.label }} <span v-if="item.count !== undefined">({{item.count}})</span>
						</span>
	
						<span v-if="selected" :class="['absolute inset-y-0 left-0 flex items-center pl-1.5', active ? 'text-white' : 'text-primary-600']">
						<CheckIcon class="h-5 w-5" aria-hidden="true" />
						</span>
					</li>
					</ComboboxOption>
				</ComboboxOptions>
			</div>
		</Combobox>
      	<input v-if="filterByName" type="text" v-model="currentName" class="w-full block rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" placeholder="Nom du client" />
	</div>
</template>

<script>
	import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
	import { Combobox,ComboboxButton,ComboboxInput,ComboboxLabel,ComboboxOption,ComboboxOptions } from '@headlessui/vue'

	export default {
		name: 'EtabList',
		components: {
			CheckIcon,ChevronUpDownIcon,Combobox,ComboboxButton,ComboboxInput,ComboboxLabel,ComboboxOption,ComboboxOptions
		},
		props: {
			class : {
				type : String
			},
			modelValue : {},
			title : {},
			list : {
				type: Array,
				default : []
			},
			label : {},
			filterByName: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				search : null,
				currentName : null,
				currentVal : null
			}
		},
		mounted() {
			this.currentName = this.title;
			this.currentVal = this.modelValue;
		},
		watch : {
			modelValue: {
				handler (){
					if( this.currentVal !== this.modelValue ) this.currentVal = this.modelValue;
				}
			},
			title: {
				handler (){
					if( this.currentName !== this.title ) this.currentName = this.title;
				}
			},
			currentVal: {
				handler (val,old) {
					if( val !== undefined && val !== null && val !== old && val !== this.modelValue) this.$emit('update:modelValue',val);
				}
			},
			currentName: {
				handler (val,old) {
					if( val !== old && val !== this.title) this.$emit('update:title',val);
				}
			}
		},
		methods : {

		},
		computed: {
			displayValue() {
				if( this.currentVal !== undefined && this.currentVal !== null ){
					const item = this.list.find(({value}) => value === this.currentVal);
					if( item ) return `${item?.label} ${item.count !== undefined ? `(${item?.count})`:''}`
				}

				return 'Choisir';
			},
			filteredResult() {
				if( this.search )
					return this.cleanList.filter(({label}) => {
						return label.toLowerCase().includes(this.search.toLowerCase())
					})
				else
					return this.cleanList;
			},
			cleanList() {
				let names = [];

				return this.list.filter(({label}) => {
					if( !names.includes(label) ){
						names.push(label)
						return true;
					}
					return false;
				}).sort(function(a, b) {
					var textA = a.label.toUpperCase();
					var textB = b.label.toUpperCase();

					if( b.value === 0 ) return 1;

					return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
				});
			}
		}
	};
</script>