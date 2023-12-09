import Header from './components/Header'
import Inputs from './components/Inputs'
import GamesList from './components/List'
import { LibStorageProvider } from './store'
import style from './style.module.css'

export function Biblioteca() {
    return (
        <LibStorageProvider>
            <div class={style.root}>
                <Header />
                <GamesList />
                <Inputs />
            </div>
        </LibStorageProvider>
    )
}