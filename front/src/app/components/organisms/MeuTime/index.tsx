import { useStore } from "@/app/store"
import { For, createEffect, createMemo, createSignal, on } from "solid-js"
import { User } from "../../interfaces/user"
import { createItem, deleteItem, readItems, readUser, readUsers } from "@directus/sdk"
import { directusClient } from "@/app/layout/Header"
import { Button } from "../../atoms/Button"
import Modal from "../../molecues/Modal"
import { Input } from "../../atoms/Input"
import { CloseIcon } from "@/icons"

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
            fields: ['*', 'time.times_id.nome', 'time.times_id.owner', 'time.times_id.membros.directus_users_id.*', 'time.id']
        }))
        console.log(user[0])
        setUser(user[0] as User)
        if (user[0].time.length) {
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
                    <h3>{team()?.nome}</h3>
                    <h4 class="text-xs">{team()?.owner == user()?.id ? (
                        <div class="flex items-center space-x-3">
                            <div>Você é o dono</div>
                            <Button onclick={handleDeleteTeam} class="h-6 px-3">Fechar time</Button>
                        </div>
                    ) :
                        <>
                            <Button onclick={_ => handleKickPlayer([user()?.time[0].id])} class="px-5">SAIR</Button>
                        </>
                    }
                    </h4>
                </div>
                <h3 class="mt-3">Membros</h3>
                <div class="flex flex-wrap space-x-3">
                    <For each={team()?.membros}>
                        {(item) => {
                            return <div class="w-[150px] bg-slate-700 rounded-md h-[100px] px-3 py-2">
                                <p>{item.first_name}</p>
                                <Button onclick={() => handleKickPlayer(item.time)}>expulsar</Button>
                            </div>
                        }}
                    </For>
                </div>
            </div >) :
                <div>
                    <h3>Você não está em um time</h3>
                    <div class="flex items-center space-x-3">
                        <Button onclick={() => setIsModalOpen(true)} class="px-3">Criar um time</Button>
                        <Button onclick={() => dispatch.setRoute('team')} class="px-3">Entrar em um time</Button>
                    </div>
                    <Modal isOpen={isModalOpen()} onClose={() => setIsModalOpen(false)}>
                        <div>
                            <h3 class="text-lg font-medium mb-4">Criar time</h3>
                            <Input id="team-name" placeholder="Nome do Time" />
                            <div class="flex w-full justify-end mt-5">
                                <Button onclick={handleCreateTeam} class="px-3">Criar</Button>
                            </div>
                        </div>
                    </Modal>
                </div>
            }
        </>
    )
}