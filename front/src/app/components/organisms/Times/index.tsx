import { directusClient } from "@/app/layout/Header"
import { useStore } from "@/app/store"
import { createNotification, readItems } from "@directus/sdk"
import { For, createEffect, createMemo, createSignal, on, onMount } from "solid-js"
import { Time } from "../../interfaces/time"
import { Button } from "../../atoms/Button"

export function TeamsPage() {
    const { dados } = useStore()
    const isLogging = createMemo(() => dados.isLogging)

    const [times, setTimes] = createSignal<Array<Time>>([])

    createEffect(on(isLogging, (state) => {
        if (state === false) {
            directusClient.request(readItems('times')).then((e) => setTimes(e as Time[]))
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
        <div class="flex flex-wrap space-x-3 mt-3">
            <For each={times()}>
                {(item) => {
                    return <div class="flex w-[150px] bg-slate-700 rounded-md h-[100px] px-3 py-2 flex-col justify-between">
                        <p>{item.nome}</p>
                        <Button data-id={item.owner} onclick={handleRequestTeam} class="h-7 text-xs px-3 ml-auto mb-2">Entrar</Button>
                    </div>
                }}
            </For>
        </div>
    )
}