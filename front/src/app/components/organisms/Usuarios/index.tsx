import { directusClient } from "@/app/layout/Header"
import { useStore } from "@/app/store"
import { createNotification, readUsers } from "@directus/sdk"
import { For, createEffect, createMemo, createSignal, on } from "solid-js"
import { User } from "../../interfaces/user"
import { Button } from "../../atoms/Button"

export function UsuariosPage() {

    const { dados } = useStore()
    const isLogging = createMemo(() => dados.isLogging)

    const [users, setUsers] = createSignal<Array<User>>([])

    createEffect(on(isLogging, (state) => {
        if (state === false) {
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
    }))

    function handleRequestTeam(e: any) {
        const teamId = e.target.getAttribute('data-id')
        directusClient.request(createNotification({
            "colletion": "time",
            "subject": "invite",
            "recipient": teamId
        }))
    }

    return (
        <div class="flex flex-wrap space-x-3 mt-3">
            <For each={users()}>
                {(item) => {
                    return <div class="w-[150px] bg-slate-700 rounded-md h-[100px] px-3 py-2">
                        <p>{item.first_name}</p>
                        <Button data-id={item.id} class="px-3" onclick={handleRequestTeam}>invite</Button>
                    </div>
                }}
            </For>
        </div>
    )
}
