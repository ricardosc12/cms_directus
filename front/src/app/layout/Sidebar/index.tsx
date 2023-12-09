import { For, createSignal } from 'solid-js'
import style from './style.module.css'
import { BookIcon, GamesIcon, NotifyIcon, TeamIcon, TeamsIcon, UserIcon } from '@/icons';
import { useStore } from '@/app/store';

interface RouteProps {
    id: string;
    title: string;
    icon: any;
}

export const routes = [
    { id: 'my_team', title: "Meu time", icon: TeamIcon },
    { id: 'team', title: "Times", icon: TeamsIcon },
    { id: 'players', title: "Usuários", icon: UserIcon },
    { id: 'notify', title: "Notificações", icon: NotifyIcon },
]

export function Sidebar() {

    const { dados, dispatch } = useStore()

    function handleConfig() {
        //modal de configurações
    }

    return (
        <div class={style.root}>
            <img class='ml-3' width="100px" src="steam-logo.png" alt="STEAM" />
            <nav>
                <ul>
                    <For each={routes}>
                        {(item: RouteProps) => (
                            <li
                                aria-checked={dados.route == item.id}
                                onclick={_ => dispatch.setRoute(item.id)}>
                                {item.id == 'notify' ? (
                                    <div class={style.icon_notify}>{item.icon()}</div>
                                ) : item.icon()}
                                <p>{item.title}</p>
                            </li>
                        )}
                    </For>
                </ul>
                <ul>
                    <li onclick={handleConfig}>Configuração</li>
                </ul>
            </nav>
        </div >
    )
}