// import { FeatureGames } from "./components/FeatureGames";
// import { GamesList } from "./components/GamesList";
// import { HeaderMain } from "./components/Header";
import { createEffect, createSignal, on, onMount } from "solid-js";
import { GameStorageProvider } from "./storage";
import style from './style.module.css'
import { createDirectus, rest, authentication, readUsers } from '@directus/sdk';
import { Select } from "../../atoms/Select";
//@ts-ignore
import { createOptions } from "@thisbeyond/solid-select";
import { Button } from "../../atoms/Button";

export const directusClient = createDirectus('http://localhost:8055').with(rest()).with(authentication('cookie'));

export function MainGames() {

    const [user, setUser] = createSignal({
        email: 'root@root.com',
        password: "root"
    })

    createEffect(on(user, (u) => {
        directusClient.login(u.email, u.password)
    }))

    const users = createOptions([
        { label: 'Root', email: 'root@root.com', password: "root" },
        { label: 'Rick', email: 'rick@rick.com', password: "rick" }
    ], { key: 'label' })



    onMount(() => {
        (async () => {

            console.log(await directusClient.login(user().email, user().password))

            console.log(await directusClient.request(readUsers({ 'fields': ['first_name'] })))
        })();
    })

    async function handleUsers() {
        // console.log(await directusClient.login("root@root.com", 'root'))
        console.log(await directusClient.request(readUsers({ 'fields': ['first_name'] })))
    }

    return (
        <GameStorageProvider>
            <div class={style.root}>
                <h3 class="text-lg font-medium">User Atual</h3>
                <p class="text-base font-medium mb-5">User: {user().email}</p>
                <Select onChange={setUser} placeholder="User" {...users} />
                <Button class="px-3 m-3" onclick={handleUsers}>Users</Button>
                {/* <HeaderMain />
                <FeatureGames />
                <GamesList /> */}
            </div>
        </GameStorageProvider>
    )
}