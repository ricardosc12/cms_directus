// import { FeatureGames } from "./components/FeatureGames";
// import { GamesList } from "./components/GamesList";
// import { HeaderMain } from "./components/Header";
import { createEffect, createSignal, on, onMount } from "solid-js";
import { createDirectus, rest, authentication } from '@directus/sdk';

//@ts-ignore
import { createOptions } from "@thisbeyond/solid-select";
import { Select } from "@/app/components/atoms/Select";
import { Button } from "@/app/components/atoms/Button";
import { useStore } from "@/app/store";
import { LoadIcon } from "@/icons";
import { Notify } from "@/app/components/interfaces/notify";

export const directusClient = createDirectus('http://localhost:8055').with(rest()).with(authentication('cookie'));

export function HeaderUsers() {

    const { dados, dispatch } = useStore()
    let connection: WebSocket;
    let pingPong: NodeJS.Timer;

    const [user, setUser] = createSignal({
        email: 'root@root.com',
        password: "root"
    })

    createEffect(on(user, (u) => {
        (async () => {
            dispatch.setIsLogging(true)
            await directusClient.login(u.email, u.password)
            dispatch.setUserEmail(user().email)
            dispatch.setIsLogging(false)
            clearInterval(pingPong)
            notifyListening()
        })();
    }))

    const users = createOptions([
        { label: 'Root', email: 'root@root.com', password: "root" },
        { label: 'Player1', email: 'player1@player1.com', password: "player1" },
        { label: 'Player2', email: 'player2@player2.com', password: "player2" },
        { label: 'Player3', email: 'player3@player3.com', password: "player3" },
    ], { key: 'label' })

    function notifyListening() {
        const url = 'ws://localhost:8055/websocket';
        connection?.close()
        connection = new WebSocket(url);

        connection.addEventListener('open', async function () {
            console.log("OPEN")
            connection.send(
                JSON.stringify({
                    type: 'auth',
                    access_token: await directusClient.getToken(),
                })
            );
            connection.send(
                JSON.stringify({
                    type: 'subscribe',
                    collection: 'directus_notifications',
                    query: {
                        fields: ['*', 'recipient.*', 'sender.*'],
                    },
                })
            );
            pingPong = setInterval(() => {
                connection.send(
                    JSON.stringify({
                        type: 'ping'
                    })
                );
            }, 30)
        });

        connection.addEventListener('message', function (message) {
            const data = JSON.parse(message.data);
            if (data.type === "subscription") {
                if (data.event === 'init') {
                    dispatch.setNotifications(data.data as Notify[])
                }
                else if (data.event === 'create') {
                    dispatch.setNotifications(dados.notifications.concat(data.data[0]))
                }
                else if (data.event === 'delete') {
                    dispatch.setNotifications(dados.notifications.filter(item => item.id != data.data[0]))
                }
                else if (data.event === "update") {
                    dispatch.setNotifications(dados.notifications.map(item => {
                        if (item.id == data.data[0].id) {
                            return data.data[0]
                        }
                        return item
                    }))
                }
            }
        });

        connection.addEventListener('close', function (message) {
            console.log("CLOSE")
            clearInterval(pingPong)
            console.log(message)
        })
    }


    return (
        <div>
            <div class="flex items-center mb-5 space-x-5">
                <div>
                    <h3 class="text-lg font-medium">User Atual</h3>
                    <p class="text-base font-medium">User: {user().email}</p>
                </div>
                <div>
                    {dados.isLogging ? <LoadIcon class="text-2xl" /> : ''}
                </div>
            </div>
            <Select onChange={setUser} placeholder="User" {...users} />
            {/* <Button class="px-3 m-3" onclick={handleUsers}>Users</Button> */}
            {/* <HeaderMain />
                <FeatureGames />
                <GamesList /> */}
        </div>
    )
}