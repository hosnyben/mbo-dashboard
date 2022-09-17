import router from "../router";
import {CalendarIcon,CheckCircleIcon,XCircleIcon,FireIcon,Bars3BottomRightIcon} from '@heroicons/vue/24/outline';

export default {
    state: {
        navigation : [],
        urgentResas : [],
        confirmResas : [],
        confirmedResas : [],
        refusedResas : [],
        offers : []
    },
    mutations: {
        setNavigation(state,navigation) {
            state.navigation = navigation
        },
        setUrgentResas(state,resas) {
            state.urgentResas = resas
        },
        setConfirmResas(state,resas) {
            state.confirmResas = resas
        },
        setConfirmedResas(state,resas) {
            state.confirmedResas = resas
        },
        setRefusedResas(state,resas) {
            state.refusedResas = resas
        },
        setOffers(state,offers) {
            state.offers = offers
        }
    },
    actions: {
        setUrgentResas({commit},resas) {
            commit('setUrgentResas',resas);
            if( resas.length ) {
                var audio = document.getElementById('notification');
                audio.play();
            }
        },
        updateNavigation({commit,state}) {
            const isAdmin = JSON.parse(localStorage.user).user_role === 'administrator';
            const isAgent = JSON.parse(localStorage.user).user_role === 'bookagent';
            const isPartner = JSON.parse(localStorage.user).user_role === 'partner';
            const isTransporter = JSON.parse(localStorage.user).user_role === 'transporter';

            let navigation = [];
            
            if( isAdmin || isAgent ) 
                navigation = [...navigation,...[
                    { current : router.path === '/partenaire/reservations-urgentes',name: 'Réservations Urgentes', href: '/partenaire/reservations-urgentes', icon: FireIcon, description: 'Réservations urgentes à traiter le pus tôt possible.', count: state.urgentResas.length },
                    { current : router.path === '/partenaire/reservations-a-confirmer',name: 'Réservations à confirmer', href: '/partenaire/reservations-a-confirmer', icon: Bars3BottomRightIcon, description: 'Réservations en attente de confirmation.', count: state.confirmResas.length },
                    { current : router.path === '/partenaire/reservations-confirme',name: 'Réservations confirmées', href: '/partenaire/reservations-confirme', icon: Bars3BottomRightIcon, description: 'List des réservations confirmées', count: state.confirmedResas.length },
                    { current : router.path === '/partenaire/reservations-refusee',name: 'Réservations Refusées', href: '/partenaire/reservations-refusee', icon: Bars3BottomRightIcon, description: 'Réservations refusées.', count: state.refusedResas.length },
                    { current : router.path === '/partenaire/reservations-liste',name: 'Toutes les Réservations', href: '/partenaire/reservations-liste', icon: Bars3BottomRightIcon, description: 'Liste de toutes les Réservations classées par date de création' }
                ]]; 
                
            navigation = [...navigation,...[
                { current : router.path === '/partenaire/reservations',name: isTransporter?'Transports par jour':'Réservations par jour', href: '/partenaire/reservations', icon: CalendarIcon, description: isTransporter?'Agenda des transports par jour.':'Agenda des réservations effectuées sur marrakechbestof.com' }
            ]];

            if( isAdmin || isAgent || isPartner )
                navigation = [...navigation,...[
                    { current : router.path === '/partenaire/occupations',name: 'Occupations', href: '/partenaire/occupations', icon: XCircleIcon, description: 'Ajouter les dates d\'occupation quand vous ne serez pas en mesure de traiter les réservations.' },
                ]];
                
            if( isAdmin || isPartner || isTransporter )
                navigation = [...navigation,...[{ current : router.path === '/partenaire/statistiques',name: 'Statistiques', href: '/partenaire/statistiques', icon: CheckCircleIcon, description: 'Liste des réservations traitées par mois.' }]];

            commit('setNavigation',navigation);
        }
    }
}