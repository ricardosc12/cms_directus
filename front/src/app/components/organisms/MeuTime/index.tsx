import { useStore } from "@/app/store"
import { For, createEffect, createMemo, createSignal, on } from "solid-js"
import { User } from "../../interfaces/user"
import { createItem, deleteItem, readItems, readUser, readUsers } from "@directus/sdk"
import { directusClient } from "@/app/layout/Header"
import { Button } from "../../atoms/Button"
import Modal from "../../molecues/Modal"
import { Input } from "../../atoms/Input"
import { CheckIcon, CloseIcon, FlagIcon, TeamIcon, TeamsIcon } from "@/icons"

interface Team {
    owner: string;
    nome: string;
    membros: User[]
}

export function MyTeamPage() {
    const { dados, dispatch } = useStore()
    const isLogging = createMemo(() => dados.isLogging)

    const [team, setTeam] = createSignal<Team>()
    const [user, setUser] = createSignal<User>()

    const [isModalOpen, setIsModalOpen] = createSignal(false)

    async function getTeam() {
        const user = await directusClient.request(readUsers({
            filter: {
                email: {
                    _eq: dados.user_email
                }
            },
            fields: ['*', 'time.times_id.nome', 'time.times_id.owner',
                'time.times_id.membros.directus_users_id.*', 'time.times_id.membros.directus_users_id.role.*', 'time.id']
        }))
        console.log(user[0])
        setUser(user[0] as User)
        if (user[0]?.time?.length) {
            const time = user[0].time[0].times_id
            const membros: User[] = time.membros.map((item: any) => Object.values(item)[0])
            setTeam({
                ...time,
                membros: membros
            })
        }
        else {
            setTeam()
        }
    }

    createEffect(on(isLogging, (state) => {
        if (state === false) {
            getTeam()
        }
    }))

    async function handleKickPlayer(item: any) {
        const id = item[0]
        await directusClient.request(deleteItem('times_directus_users', id))
        getTeam()
    }

    async function handleCreateTeam() {
        const nome = (document.getElementById("team-name") as HTMLInputElement).value
        directusClient.request(createItem('times', {
            nome: nome
        }))
            .then(_ => getTeam())

        setIsModalOpen(false)
    }

    function handleDeleteTeam() {
        //@ts-ignore
        const teamId = user()?.time_owner[0]
        if (teamId) {
            directusClient.request(deleteItem('times', teamId))
                //@ts-ignore
                .then((e: Response) => e.status === 204 && getTeam())

        }
    }


    return (
        <>
            {team() ? (< div class="flex mt-3 flex-col" >
                <div class="flex space-x-3 items-center">
                    <div class="flex flex-col space-y-2">
                        <h3 class="font-medium text-xl">{team()?.nome}</h3>
                        {team()?.owner == user()?.id ? (
                            <div class="flex items-center space-x-3">
                                <div class={`flex items-center bg-zinc-200 rounded-full px-2 pr-3`}>
                                    <span class="flex h-1 w-1 bg-stone-500 mr-1 rounded-full"></span>
                                    <p class="font-medium text-xs text-black">Você é o dono</p>
                                </div>
                            </div>) : ""}
                    </div>
                    {team()?.owner == user()?.id ?
                        <Button onclick={handleDeleteTeam} class="text-xs h-6 px-3 bg-gray-500 ml-10">Fechar time</Button>
                        : <Button onclick={_ => handleKickPlayer([user()?.time[0].id])} class="text-xs h-6 px-3 bg-gray-500 ml-10">SAIR</Button>}
                </div>
                <h3 class="mt-3 font-medium text-lg">Membros</h3>
                <div class="flex flex-wrap">
                    <For each={team()?.membros}>
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
                                </div>
                                <div class="flex items-center justify-end">
                                    <Button data-id={item.id} class="h-5 px-3 bg-gray-700 text-slate-300 border-red-100 text-sm hover:bg-gray-600"
                                        icon={FlagIcon} onclick={() => handleKickPlayer(item.time)}>Expulsar</Button>
                                </div>
                            </div>
                        }}
                    </For>
                </div>
            </div >) :
                <div>
                    <h3 class="font-medium text-lg mb-5">Você não está em um time</h3>
                    <div class="flex items-center space-x-3">
                        <Button icon={TeamIcon} onclick={() => setIsModalOpen(true)} class="bg-sky-600 px-3">Criar um time</Button>
                        <Button icon={TeamsIcon} onclick={() => dispatch.setRoute('team')} class="bg-gray-700 text-sm px-3">Entrar em um time</Button>
                    </div>
                    <Modal isOpen={isModalOpen()} onClose={() => setIsModalOpen(false)}>
                        <div class="w-[300px]">
                            <h3 class="text-lg font-medium mb-4">Criar time</h3>
                            <Input id="team-name" placeholder="Nome do Time" />
                            <div class="flex w-full justify-end mt-7">
                                <Button icon={CheckIcon} onclick={handleCreateTeam} class="px-5 text-sm">Criar</Button>
                            </div>
                        </div>
                    </Modal>
                </div>
            }
        </>
    )
}