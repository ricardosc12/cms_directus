import { directusClient } from "@/app/layout/Header"
import { useStore } from "@/app/store"
import { createNotification, readItems } from "@directus/sdk"
import { For, createEffect, createMemo, createSignal, on, onMount } from "solid-js"
import { Time } from "../../interfaces/time"
import { Button } from "../../atoms/Button"
import { HandShake } from "@/icons"

export function TeamsPage() {
    const { dados } = useStore()
    const isLogging = createMemo(() => dados.isLogging)

    const [times, setTimes] = createSignal<Array<Time>>([])

    createEffect(on(isLogging, (state) => {
        if (state === false) {
            directusClient.request(readItems('times', {
                fields: ['*', 'owner.*']
            })).then((e) => setTimes(e as Time[]))
        }
    }))

    function handleRequestTeam(e: any) {
        const teamId = e.target.getAttribute('data-id')
        directusClient.request(createNotification({
            "colletion": "time",
            "subject": "request",
            "recipient": teamId
        }))
    }

    return (
        <div class="flex flex-wrap mt-3">
            <For each={times()}>
                {(item) => {
                    return <div class="min-w-[280px] flex flex-col user-card justify-between w-[250px]rounded-md h-[120px] px-5 py-2 mr-3 mb-3">
                        <div class="flex items-center">
                            <div class="space-y-1">
                                <p class="font-medium text-base text-slate-300">{item.nome}</p>
                                <div class={`flex items-center bg-cyan-200 rounded-full px-2 pr-4 w-min`}>
                                    <span class="flex h-1 w-1 bg-stone-500 mr-1 rounded-full"></span>
                                    <p class="font-medium text-xs text-black">{item.owner.first_name}</p>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="font-medium text-sm text-slate-400">Membros: {item.membros.length}</span>
                            <Button icon={HandShake} data-id={item.owner.id} onclick={handleRequestTeam} class="bg-gray-600 h-7 text-xs px-3 ml-auto mb-2">Entrar</Button>
                        </div>
                    </div>
                }}
            </For>
        </div>
    )
}