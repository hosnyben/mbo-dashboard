<template>
	<main class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-xl py-16 sm:py-24">
			<div class="text-center">
				<p class="text-base font-semibold text-indigo-600">Bienvenue cher au panneau d'administration</p>
				<h1 class="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Marrakech Best Of</h1>
				<p class="mt-2 text-lg text-gray-500">Votre partenaire.</p>
			</div>
			<div class="mt-12">
				<ul role="list" class="mt-4 divide-y divide-gray-200 border-t border-b border-gray-200">
					<li v-for="(link, linkIdx) in navigation" :key="linkIdx" class="relative flex items-start space-x-4 py-6">
						<div class="flex-shrink-0">
							<span class="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50">
								<component :is="link.icon" class="h-6 w-6 text-indigo-700" aria-hidden="true" />
							</span>
						</div>
						<div class="min-w-0 flex-1">
							<h3 class="text-base font-medium text-gray-900">
								<span class="rounded-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2">
									<RouterLink  class="focus:outline-none" :to="link.href">
										<span class="absolute inset-0" aria-hidden="true"></span>
              							{{ link.name }}
            						</RouterLink>
								</span>
							</h3>
							<p class="text-base text-gray-500">{{ link.description }}</p>
						</div>
						<div class="flex-shrink-0 self-center">
							<ChevronRightIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
						</div>
					</li>
				</ul>
			</div>
		</div>
	</main>
</template>

<script setup>
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
</script>
<script>
  export default {
    name: 'Dashboard',
    computed: {
      navigation() {
        return this.$store.state.other.navigation
      }
    }
  };
</script>