import { directusClient } from "@/app/layout/Header"
import { useStore } from "@/app/store"
import { deleteNotification, readItems, updateNotification } from "@directus/sdk"
import { For, JSX, createEffect, createMemo, createSignal, on, onMount } from "solid-js"
import { Time } from "../../interfaces/time"
import { Button } from "../../atoms/Button"

export function NotificationPage() {

    const { dados } = useStore()

    function handleRemoveNotify(e: any) {
        const target: any = e.target
        directusClient.request(deleteNotification(target.getAttribute('data-id')))
    }

    function handleEditNotify(e: any) {
        const target = e.target
        const status: any = target.getAttribute('data-event')
        const id: any = target.getAttribute('data-id')
        directusClient.request(updateNotification(id, {
            status
        }))
    }

    return (
        <div class="flex flex-wrap mt-3 flex-col">
            <For each={dados.notifications}>
                {item => (
                    <div class="mb-3 flex items-center">
                        <div>
                            <div>tipo: {item.subject}</div>
                            <div>sender: {item.sender.email}</div>
                            <div>recipient: {item.recipient.email}</div>
                        </div>
                        <Button data-id={item.id} data-event="approve"
                            onclick={handleEditNotify} class="ml-3 text-xs px-3 h-6 bg-green-600 hover:bg-green-400">approve</Button>
                        <Button data-id={item.id} data-event="rejected"
                            onclick={handleEditNotify} class="ml-3 text-xs px-3 h-6 bg-red-600 hover:bg-red-400">reject</Button>
                        <Button data-id={item.id}
                            onclick={handleRemoveNotify} class="ml-3 text-xs px-3 h-6 bg-slate-600 hover:bg-slate-400">excluir</Button>
                    </div>
                )}
            </For>
        </div>
    )
}