import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import es from 'vuetify/lib/locale/es';


Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    primary: '#3f51b5',
    secondary: '#b0bec5',
    accent: '#8c9eff',
    error: '#ff00ff'
  },
    lang: {
      locales: { es },
      current: 'es',
    },
    
});
