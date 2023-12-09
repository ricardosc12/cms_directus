import { Perfil } from "@/app/components/molecues/Perfil";

export default function Header() {
    return (
        <div class="flex w-full justify-between">
            <h2 class="text-lg font-medium">Biblioteca</h2>
            <Perfil />
        </div>
    )
}