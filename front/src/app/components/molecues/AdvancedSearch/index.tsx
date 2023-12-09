import { CalendarIcon, FilterIcon, GameboyIcon, GhostIcon, LanguageIcon, SearchIcon } from "@/icons";
import { Input } from "../../atoms/Input";
import style from './style.module.css'
import { Select } from "../../atoms/Select";
import { languagesProps } from "./options/languages";
import { categoriesProps } from "./options/categories";
import { genresProps } from "./options/genres";
import { Button } from "../../atoms/Button";
import { useGameStore } from "../../organisms/Main/storage";
import { useForm } from "@/hooks/form";
import { createMemo } from "solid-js";

export function AdvancedSearch() {

    const { dados, dispatch } = useGameStore()

    const isAdvanced = createMemo(() => dados.isAdvanced)

    const { form, set } = useForm()

    function handleFilter() {
        dispatch.setFilters(form())
    }

    return (
        <div class={style.root_advanced} style={{ display: isAdvanced() ? 'flex' : 'none' }}>
            <div class="flex items-center mb-3">
                <FilterIcon class="mr-3" />
                <h3>Filtros</h3>
            </div>
            <div class="flex flex-col">
                <div class="flex items-center w-[600px] space-x-3 mb-3">
                    {/* @ts-ignore */}
                    <Input onchange={set('ano')} placeholder="Ano de lançamento" class="min-w-[190px]" icon={CalendarIcon} />
                    <Select onChange={set('languages')} multiple {...languagesProps} placeholder="Idiomas" icon={LanguageIcon} />
                </div>
                <div class="flex w-[600px] space-x-2">
                    <Select onChange={set('genres')} multiple {...genresProps} placeholder="Gêneros" icon={GhostIcon} />
                    <Select onChange={set('categories')} multiple {...categoriesProps} placeholder="Categorias" icon={GameboyIcon} />
                </div>
            </div>
            <Button id="button-search-game" onclick={handleFilter} icon={SearchIcon} class="w-[500px] mt-3">Pesquisar</Button>
        </div>
    )
}