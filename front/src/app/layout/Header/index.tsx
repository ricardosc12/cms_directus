// import { FeatureGames } from "./components/FeatureGames";
// import { GamesList } from "./components/GamesList";
// import { HeaderMain } from "./components/Header";
import { createEffect, createSignal, on, onMount } from "solid-js";
import { createDirectus, rest, authentication, readRoles } from '@directus/sdk';

//@ts-ignore
import { createOptions } from "@thisbeyond/solid-select";
import { Select } from "@/app/components/atoms/Select";
import { Button } from "@/app/components/atoms/Button";
import { useStore } from "@/app/store";
import { DoorIcon, LoadIcon } from "@/icons";
import { Notify } from "@/app/components/interfaces/notify";
import { Role } from "@/app/components/interfaces/role";
import { User } from "@/app/components/interfaces/user";

export const directusClient = createDirectus('http://localhost:8055').with(rest()).with(authentication('cookie'));

export function HeaderUsers() {

    const { dados, dispatch } = useStore()
    let connection: WebSocket;
    let pingPong: NodeJS.Timer;

    const [user, setUser] = createSignal({
        email: 'root@root.com',
        password: "root",
        image: 'user.png',
        first_name: "Root",
        label: "Root"
    })

    const [users, setUsers] = createSignal({ format: null })

    onMount(() => {
        getUsers()
    })

    function getUsers() {
        fetch("http://localhost:8055/users?email!=null", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        }).then(async e => {
            setUsers({ format: null })
            const { data }: { data: User[] } = await e.json()
            const users = data.filter(item => item.email)
            const usersOptions = users.map(user => {
                return {
                    email: user.email,
                    label: user.first_name,
                    password: user.email.split("@")[0],
                    image: user.image
                }
            })
            setUsers(createOptions(usersOptions, { key: 'label' }))
        })
    }

    createEffect(on(user, (u) => {
        (async () => {
            dispatch.setIsLogging(true)
            await directusClient.login(u.email, u.password)
            dispatch.setRoles(await directusClient.request(readRoles()) as Role[])
            dispatch.setUserEmail(user().email)
            dispatch.setIsLogging(false)
            clearInterval(pingPong)
            notifyListening()
        })();
    }))



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
            <div class="flex items-center mb-5 space-x-5 justify-between pr-10">
                <div class="flex items-center space-x-3 flex-1">
                    <div class="flex justify-center items-center w-10 h-10 rounded-full overflow-hidden">
                        <img src={user().image || "user.png"} class="object-contain w-full h-full" />
                    </div>
                    <div class="flex flex-col">
                        <p class="text-base font-medium text-slate-300">{user().label}</p>
                        <p class="text-sm font-medium text-slate-400">{user().email}</p>
                    </div>
                    <div>
                        {dados.isLogging ? <LoadIcon class="text-2xl" /> : ''}
                    </div>

                </div>
                <div class="flex items-center space-x-5">
                    {users().format ?
                        <Select class="min-w-[150px] max-w-[150px]"
                            initialValue={{ label: 'Root', email: 'root@root.com', password: "root" }} onChange={setUser} placeholder="User" {...users()} />
                        : <p>Loading...</p>
                    }
                    <Button icon={DoorIcon} onclick={() => directusClient.logout()} class="px-3 h-7 bg-gray-600 text-sm">Sair</Button>
                </div>
            </div>




            <Button id="get-users-bt" class="absolute invisible" onclick={getUsers}>GET</Button>
            {/* <HeaderMain />
                <FeatureGames />
                <GamesList /> */}
        </div>
    )
}