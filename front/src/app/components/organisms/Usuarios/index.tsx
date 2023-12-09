import { directusClient } from "@/app/layout/Header"
import { useStore } from "@/app/store"
import { readUsers } from "@directus/sdk"
import { For, createEffect, createMemo, createSignal, on } from "solid-js"
import { User } from "../../interfaces/user"

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

    return (
        <div class="flex flex-wrap space-x-3 mt-3">
            <For each={users()}>
                {(item) => {
                    return <div class="w-[150px] bg-slate-700 rounded-md h-[100px] px-3 py-2">{item.first_name}</div>
                }}
            </For>
        </div>
    )
}
