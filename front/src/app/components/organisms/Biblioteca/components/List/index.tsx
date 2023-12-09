import { For, onMount } from 'solid-js'
import InsertButton from '../Insert'
import { useLibStore } from '../../store'
import { deleteGame, getLibGames } from '@/api/game'
import { GameProps } from '@/app/components/interfaces/game'
import style from './style.module.css'
import { TrashIcon } from '@/icons'

export async function getGames(dispatch: any) {
    const result = await getLibGames()
    if (result.status !== 200) {
        alert("Erro ao buscar biblioteca!")
        return
    }
    const games: Array<GameProps> = result.data
    dispatch.setGames(games)
}

export default function GamesList() {

    const { dados, dispatch } = useLibStore()

    onMount(() => {
        getGames(dispatch)
    })

    async function handleDelete(id: string) {
        await deleteGame({ id: id })
        getGames(dispatch)
    }

    return (
        <div class='flex flex-wrap'>
            <For each={dados.games}>
                {(item) => (
                    <div class='w-[255px] mr-3'>
                        <div class={style.loading_image}>
                            <img alt="Game image" class="image" src={item.image}></img>
                            <div class={style.delete} onclick={_ => handleDelete(item.id)}>
                                <TrashIcon />
                            </div>
                        </div>
                        <div class={style.info}>
                            <div class="flex flex-row items-center pt-1">
                                <h3 class="truncate">{item.name}</h3>
                                <span class="price my-auto ml-auto">{item.price || "Free "}</span>
                            </div>
                            <p class="truncate">{item.genres}</p>
                        </div>
                    </div>
                )}
            </For>
            <InsertButton />
        </div>
    )
}