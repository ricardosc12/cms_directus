import { Match, Switch, onMount } from "solid-js";
import { useStore } from "../store";
import { HeaderUsers, directusClient } from "./Header";
import style from './style.module.css'
import { MyTeamPage } from "../components/organisms/MeuTime";
import { TeamsPage } from "../components/organisms/Times";
import { UsuariosPage } from "../components/organisms/Usuarios";
import { NotificationPage } from "../components/organisms/Notifications";

export function Layout() {

    const { dados } = useStore()

    return (
        <div class={style.root}>
            <HeaderUsers />
            <Switch fallback={<div>Not Found</div>}>
                <Match when={dados.route === "my_team"}>
                    <MyTeamPage />
                </Match>
                <Match when={dados.route === "team"}>
                    <TeamsPage />
                </Match>
                <Match when={dados.route === "players"}>
                    <UsuariosPage />
                </Match>
                <Match when={dados.route === "notify"}>
                    <NotificationPage />
                </Match>
            </Switch>
        </div>

    )
}