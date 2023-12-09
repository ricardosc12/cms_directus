import { Match, Switch } from "solid-js";
import { MainGames } from "../components/organisms/Main";
import { useStore } from "../store";
import { Biblioteca } from "../components/organisms/Biblioteca";

export function Layout() {

    const { dados } = useStore()

    return (
        <Switch fallback={<div>Not Found</div>}>
            <Match when={dados.route === "loja"}>
                <MainGames />
            </Match>
            <Match when={dados.route === "biblioteca"}>
                <Biblioteca />
            </Match>
        </Switch>
    )
}