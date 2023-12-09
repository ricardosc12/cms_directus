import { AdvancedSearch } from "@/app/components/molecues/AdvancedSearch";
import { Perfil } from "@/app/components/molecues/Perfil";
import { SearchGame } from "@/app/components/molecues/Search";


export function HeaderMain() {
    return (
        <div class="flex flex-col">
            <div class="flex justify-between">
                <SearchGame />
                <Perfil />
            </div>
            <AdvancedSearch />
        </div>
    )
}