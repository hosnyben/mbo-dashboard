import compareAsc from 'date-fns/compareAsc'
import isSameMonth from 'date-fns/isSameMonth'
import store from './store/index';
import userService from './services/user.service'

const isAdmin = localStorage.user && (JSON.parse(localStorage.user).user_role === 'administrator' || JSON.parse(localStorage.user).user_role === 'bookagent');

export const updateResaConfirmation = async function(reservation,list,statut) {
    return await userService.updateReservation(reservation.id,{'resa-confirmation' : isAdmin?statut:statut+'-owner'}).then(({data}) => {
        if( data ){
            list.forEach((resa) => {
                if( reservation.id === resa.id ){
                    resa['resa-confirmation'] = isAdmin?statut:statut+'-owner';
                    storeHandle(resa,statut);
                    return;
                }
            });

            return list;
        }
    });
}

const storeHandle = function(resa,statut) {
    store.dispatch('setUrgentResas', store.state.other.urgentResas.filter(({id}) => id !== resa.id));
    store.commit('setConfirmResas', store.state.other.confirmResas.filter(({id}) => id !== resa.id));
    
    let target = [];
    let keys = [];

    if( statut === 'confirmed' ){
        keys = ['refusedResas','confirmedResas'];
        target = ['setRefusedResas','setConfirmedResas'];
    }else{
        keys = ['confirmedResas','refusedResas'];
        target = ['setConfirmedResas','setRefusedResas'];
    }

    store.commit(target[0], store.state.other[keys[0]].filter(({id}) => id !== resa.id));
    
    if( isSameMonth(new Date(),new Date(resa.arrival)) ) {
        store.commit(target[1], [...store.state.other[keys[1]],...[resa]].sort((a, b) => {
            return compareAsc(new Date(a.arrival),new Date(b.arrival))
        }));
    }

    store.dispatch('updateNavigation');
}