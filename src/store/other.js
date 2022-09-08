import router from "../router";
import {CalendarIcon,CheckCircleIcon,XCircleIcon,FireIcon,Bars3BottomRightIcon} from '@heroicons/vue/24/outline';

export default {
    state: {
        navigation : [],
        urgentResas : [],
        confirmResas : [],
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
            const adminMenu = JSON.parse(localStorage.user).user_role === 'administrator' ? [
                { current : router.path === '/partenaire/reservations-urgentes',name: 'Réservations Urgentes', href: '/partenaire/reservations-urgentes', icon: FireIcon, description: 'Agenda des réservations effectuées sur marrakechbestof.com', count: state.urgentResas.length },
                { current : router.path === '/partenaire/reservations-a-confirmer',name: 'Réservations à confirmer', href: '/partenaire/reservations-a-confirmer', icon: Bars3BottomRightIcon, description: 'Agenda des réservations effectuées sur marrakechbestof.com', count: state.confirmResas.length }
            ] : [];
            const userMenu =  [{ current : router.path === '/partenaire/occupations',name: 'Occupations', href: '/partenaire/occupations', icon: XCircleIcon, description: 'Ajouter les dates d\'occupation quand vous ne serez pas en mesure de traiter les réservations.' }]
    
            commit('setNavigation',[
                ...adminMenu,
                ...[
                    { current : router.path === '/partenaire/reservations',name: 'Réservations par jour', href: '/partenaire/reservations', icon: CalendarIcon, description: 'Agenda des réservations effectuées sur marrakechbestof.com' },
                    { current : router.path === '/partenaire/statistiques',name: 'Statistiques', href: '/partenaire/statistiques', icon: CheckCircleIcon, description: 'Liste des réservations traitées par mois.' }
                ],
                ...userMenu
            ]);
        }
    }
}