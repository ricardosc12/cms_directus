/* @refresh reload */
import { render } from 'solid-js/web'
import App from './app'
import './app/tailwind.css'


const root = document.getElementById('root')

render(() => <App />, root!)
