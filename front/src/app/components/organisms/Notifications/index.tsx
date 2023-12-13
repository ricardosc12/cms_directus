import { directusClient } from "@/app/layout/Header"
import { useStore } from "@/app/store"
import { deleteNotification, readItems, updateNotification } from "@directus/sdk"
import { For, JSX, createEffect, createMemo, createSignal, on, onMount } from "solid-js"
import { Time } from "../../interfaces/time"
import { Button } from "../../atoms/Button"
import { ArrowRightIcon, LetterIcon } from "@/icons"

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
            status: status
        }))
    }

    return (
        <div class="flex flex-wrap mt-3 flex-col">
            <For each={dados.notifications} fallback={<div class="font-medium text-base">Nenhuma notificação</div>}>
                {item => (
                    <div class="user-card w-[300px] mb-3 flex flex-col px-4 py-2">
                        <div class="flex items-center space-x-3 mb-2">
                            <LetterIcon />
                            <p class="font-medium">{item.sender.first_name}</p>
                            <ArrowRightIcon />
                            <p class="font-medium">{item.recipient?.first_name}</p>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class={`flex items-center bg-cyan-200 rounded-full px-3 w-min`}>
                                <p class="font-medium text-sm text-black">{item.subject == 'request' ? "Pedido" : "Convite"}</p>
                            </div>
                            <div class={`flex items-center bg-gray-200 rounded-full px-4 w-min`}>
                                <p class="font-medium text-sm text-black ">{item.status}</p>
                            </div>
                        </div>
                        <div class="flex mt-5 justify-end space-x-1">
                            <Button data-id={item.id} data-event="approve"
                                onclick={handleEditNotify} class="font-medium text-xs px-3 h-6 bg-green-600 hover:bg-green-400">Approve</Button>
                            <Button data-id={item.id} data-event="rejected"
                                onclick={handleEditNotify} class="font-medium text-xs px-3 h-6 bg-red-600 hover:bg-red-400">Reject</Button>
                            <Button data-id={item.id}
                                onclick={handleRemoveNotify} class="font-medium text-xs px-3 h-6 bg-slate-600 hover:bg-slate-400">Excluir</Button>
                        </div>

                    </div>
                )}
            </For>
        </div>
    )
}