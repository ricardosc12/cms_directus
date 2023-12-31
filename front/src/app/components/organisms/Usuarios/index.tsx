import { directusClient } from "@/app/layout/Header"
import { useStore } from "@/app/store"
import { createNotification, deleteUser, readUsers, updateUser } from "@directus/sdk"
import { For, createEffect, createMemo, createSignal, on } from "solid-js"
import { User } from "../../interfaces/user"
import { Button } from "../../atoms/Button"
import './style.css'
import { BanIcon, BlockIcon, CheckIcon, FlagIcon, TrashIcon } from "@/icons"

export function UsuariosPage() {

    const { dados } = useStore()
    const isLogging = createMemo(() => dados.isLogging)

    const [users, setUsers] = createSignal<Array<User>>([])

    createEffect(on(isLogging, (state) => {
        if (state === false) {
            getUsers()
        }
    }))

    function getUsers() {
        directusClient.request(readUsers({
            fields: [
                '*',
                'role.*'
            ],
            filter: {
                role: {
                    _nnull: true
                }
            }
        })).then((e) => setUsers(e as User[]))
    }


    function handleRequestTeam(e: any) {
        const userId = e.target.getAttribute('data-id')
        directusClient.request(createNotification({
            "colletion": "time",
            "subject": "invite",
            "recipient": userId
        }))
    }

    async function handleBan(e: any) {
        const userId = e.target.getAttribute('data-id')
        const user = users().filter(item => item.id == userId)[0]
        await directusClient.request(updateUser(userId, {
            status_tag: user.status_tag === 'ban' ? 'ativo' : 'ban'
        }))
        getUsers()
    }

    async function handleDel(e: any, id: any) {
        const userId = e?.target?.getAttribute('data-id') || id
        await directusClient.request(deleteUser(userId))
        getUsers()
    }

    return (
        <div class="flex flex-wrap mt-3">
            <For each={users()}>
                {(item) => {
                    return <div class="min-w-[280px] flex flex-col user-card justify-between w-[250px]rounded-md h-[120px] px-3 py-2 mr-3 mb-3">

                        <div class="flex items-center">
                            <div class="flex justify-center items-center w-10 h-10 rounded-full overflow-hidden">
                                <img src={item.image || "user.png"} class="object-contain w-full h-full" />
                            </div>
                            <div class="ml-3">
                                <p class="font-medium text-base text-slate-300">{item.first_name}</p>
                                <div class={`flex items-center bg-cyan-200 rounded-full px-2 pr-3 ${item.role.name}`}>
                                    <span class="flex h-1 w-1 bg-stone-500 mr-1 rounded-full"></span>
                                    <p class="font-medium text-xs text-black">{item.role.name}</p>
                                </div>
                            </div>
                            <div class={`flex-1 flex items-center justify-end font-medium text-xs ml-10 -translate-y-3 space-x-1`}>
                                {item.role.name === "Jogador" ? item.status_tag === "ativo" ? (
                                    <>
                                        <CheckIcon />
                                        <p class="text-green-500">Ativo</p>
                                    </>
                                ) : (
                                    <>
                                        <BanIcon />
                                        <p class="text-red-500">Banido</p>
                                    </>
                                ) : ''}
                            </div>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <TrashIcon onclick={() => handleDel(undefined, item.id)} class="cursor-pointer"
                                    style={"filter: invert(24%) sepia(83%) saturate(4792%) hue-rotate(351deg) brightness(73%) contrast(128%);"} />
                                <Button data-id={item.id} class="h-5 px-3 bg-red-950 text-red-400 border-red-100 text-sm hover:bg-red-900"
                                    icon={() => <BlockIcon style="filter: invert(24%) sepia(83%) saturate(4792%) hue-rotate(351deg) brightness(73%) contrast(128%);"
                                    />} onclick={handleBan}>Banir</Button>
                            </div>
                            <div>
                                <Button data-id={item.id} class="h-5 px-3 bg-gray-700 text-slate-300 border-red-100 text-sm hover:bg-gray-600"
                                    icon={FlagIcon} onclick={handleRequestTeam}>Convidar</Button>
                            </div>
                        </div>
                    </div>
                }}
            </For>
        </div>
    )
}
