import { createStore } from "vuex";
import { auth } from "./auth.module";
import other from "./other";
const store = createStore({
  modules: {
    auth,
    other
  },
});
export default store;