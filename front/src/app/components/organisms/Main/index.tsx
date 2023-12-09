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

// export const directusClient = createDirectus('http://localhost:8055').with(rest()).with(authentication('cookie'));

export function MainGames() {

    return (
        <GameStorageProvider>
            <div>
                main
                {/* <HeaderMain />
                <FeatureGames />
                <GamesList /> */}
            </div>
        </GameStorageProvider>
    )
}