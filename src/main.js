import './main.css'
import Alpine from 'alpinejs'
import {createAppAlpineData} from './app.js'

Alpine.data('app', () => createAppAlpineData());

window.Alpine = Alpine;
Alpine.start()
