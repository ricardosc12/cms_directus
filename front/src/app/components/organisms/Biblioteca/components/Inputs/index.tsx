import { Button } from "@/app/components/atoms/Button"
import { Input } from "@/app/components/atoms/Input"
import { Select } from "@/app/components/atoms/Select"
import { categoriesProps } from "@/app/components/molecues/AdvancedSearch/options/categories"
import { genresProps } from "@/app/components/molecues/AdvancedSearch/options/genres"
import { languagesProps } from "@/app/components/molecues/AdvancedSearch/options/languages"
import { useForm } from "@/hooks/form"
import { BookIcon, CalendarIcon, DiceIcon, DollarIcon, GameboyIcon, GamesIcon, GhostIcon, HeartIcon, LanguageIcon, ReconIcon, UserIcon } from "@/icons"
import { useLibStore } from "../../store"
import { Match, Switch, createSignal, createMemo } from 'solid-js'
import { publiGame } from "@/api/game"
import { GameProps } from "@/app/components/interfaces/game"
import { getGames } from "../List"

export default function Inputs() {

    const { dados, dispatch } = useLibStore()
    const [gameImg, setGameImg] = createSignal<string | undefined>(undefined)
    const isActive = createMemo(() => dados.isInserting)

    const { form, set } = useForm()

    async function handlePub() {
        const game = form() as GameProps
        game.image = gameImg() as string
        console.log(await publiGame(game))
        getGames(dispatch)
    }

    return (
        <Switch>
            <Match when={isActive() === true}>
                <div class="mt-8 mx-auto w-[800px] space-y-3 relative">
                    <div class="flex items-center">
                        <h2 class="text-xl">Dados do game</h2>
                        <GamesIcon class="ml-3 text-lg" />
                    </div>
                    <Input onchange={set('name')} icon={GamesIcon} placeholder="Nome" />
                    <div class="flex space-x-3">
                        <Select multiple onChange={set('languages')} icon={LanguageIcon} class="w-[55%]" placeholder="Idiomas" {...languagesProps} />
                        <Select multiple onChange={set('genres')} icon={GhostIcon} class="w-[45%]" placeholder="Genero" {...genresProps} />
                    </div>
                    <div class="flex space-x-3">
                        <Select multiple onChange={set('categories')} icon={GameboyIcon} class="w-[70%]" placeholder="Categorias" {...categoriesProps} />
                        <Input onchange={set('release_date')} icon={CalendarIcon} class="w-[30%]" placeholder="Data de lançamento" />
                    </div>
                    <div class="flex space-x-3">
                        <Input onchange={set('recommendations')} icon={ReconIcon} class="w-[50%]" placeholder="Recomendações" />
                        <Input onchange={set('positive')} icon={HeartIcon} class="w-[50%]" placeholder="Nota" />
                    </div>
                    <div class="flex space-x-3">
                        <Input onchange={set('developers')} icon={UserIcon} class="w-[50%]" placeholder="Desenvolvedores" />
                        <Input onchange={set('publishers')} icon={UserIcon} class="w-[50%]" placeholder="Publicadores" />
                    </div>
                    <div class="flex flex-row justify-center items-center">
                        <img class="h-24" src={gameImg() || "steam.gif"} />
                        <div class="flex flex-row space-x-3 ml-5 justify-center items-center mt-2 cursor-pointer">
                            <div>
                                <img onclick={_ => setGameImg("action.png")} class="h-10" src="action.png" alt="" />
                                <img onclick={_ => setGameImg("farm.png")} class="h-10" src="farm.png" alt="" />
                            </div>
                            <div>
                                <img onclick={_ => setGameImg("fight.png")} class="h-10" src="fight.png" alt="" />
                                <img onclick={_ => setGameImg("roman.png")} class="h-10" src="roman.png" alt="" />
                            </div>
                        </div>
                    </div>
                    <div class="flex w-[500px] mx-auto">
                        <Input onchange={set('price')} icon={DollarIcon} placeholder="Preço" />
                        <div class="flex ml-auto space-x-3">
                            <Button class="w-[60px] pl-2 bg-[var(--steam-color-off)]" icon={DiceIcon} />
                            <Button onclick={handlePub} class="w-[170px]">Publicar</Button>
                        </div>
                    </div>
                </div>
            </Match>
        </Switch>
    )
}

// name
// image
// positive
// recommendations
// languages
// categories
// genres
// developers
// publishers
// release_date
// price