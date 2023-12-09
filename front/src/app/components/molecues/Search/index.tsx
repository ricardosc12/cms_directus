import { searchGame } from "@/api/game"
import { useDebouce } from "@/utils/debounce"
import { For, createSignal, onMount } from "solid-js"
import gitImage from '@/utils/steam.gif'
import { GameProps } from "../../interfaces/game"
import { Input } from "../../atoms/Input"
import { FilterIcon, MagicIcon, SearchIcon } from "@/icons"
import { ToggleButton } from "../../atoms/ToggleButton"
import style from './style.module.css'
import { useGameStore } from "../../organisms/Main/storage"

export function SearchGame() {

    const [games, setGames] = createSignal([])
    const { dados, dispatch } = useGameStore()

    const handleSearchDebounce = useDebouce(handleSearch, 350)

    async function handleSearch(e: any) {
        if (dados.isAdvanced) return

        const value = e.target.value

        const resp = await searchGame({ name: value })

        if (resp.status === 200) {
            setGames(resp.data)
        }

        else {
            setGames([])
        }
    }

    function handleFocus() {
        if (dados.isAdvanced) return
        const el = document.getElementById("gamelist")
        if (el) {
            el.ariaChecked = "true"
        }
    }

    function handleBlur() {
        setTimeout(() => {
            const el = document.getElementById("gamelist")
            if (el) {
                el.ariaChecked = "false"
            }
        }, 100)
    }

    function searchGameByName(e: KeyboardEvent) {
        if (e.key == "Enter") {
            setTimeout(() => {
                document.getElementById("button-search-game")?.click()
                handleBlur()
            }, 50)
        }
    }

    return (
        <div class="flex flex-row items-center justify-center relative">
            {/* @ts-ignore */}
            <Input class="w-[500px]" onchange={dispatch.setNameFilter} id="game-input"
                icon={SearchIcon} placeholder="Game"
                oninput={handleSearchDebounce} onblur={handleBlur}
                onfocus={handleFocus} onkeydown={searchGameByName} />
            <ToggleButton id="magic-search" onclick={dispatch.setMagic} value={dados.isMagic} class="ml-3" icon={MagicIcon} />
            <ToggleButton onclick={dispatch.setAdvanced} value={dados.isAdvanced} class="ml-3" icon={FilterIcon}>
                Filtros Avançados
            </ToggleButton>
            <GamesList list={games()} />
        </div>
    )
}


interface GameListPros {
    list: Array<GameProps>
}

function GamesList(props: GameListPros) {
    return (
        <div class={style.gamelist} id="gamelist" tabindex="1">
            <For each={props.list}>
                {(game: GameProps) => {
                    return (
                        <div onclick={(e) => console.log(game.name)} class="flex w-full">
                            <LazyImage src={game.image} />
                            <div class="flex flex-col ml-3">
                                <h3 class="font-medium text-lg">{game.name}</h3>
                                <h3 class="font-normal text-xs">{game.genres}</h3>
                            </div>
                            <span class="price my-auto ml-auto mr-10">{game.price || "Free"}</span>
                        </div>
                    )
                }}
            </For>
        </div>
    )
}

export function LazyImage({ src, width }: any) {

    const [image, setImage] = createSignal(gitImage)

    onMount(() => {
        let _image = new Image()
        _image.src = src
        _image.onload = () => [
            setImage(src)
        ]
    })

    return <img width={width || '160'} src={image()} alt="game image" />
}