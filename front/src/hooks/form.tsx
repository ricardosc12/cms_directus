import { SearchGameProps } from '@/api/game'
import { createSignal } from 'solid-js'

export function useForm() {

    const [form, setForm] = createSignal<SearchGameProps>({})

    function set(id: string) {
        return (e: any) => {
            if (Array.isArray(e)) {
                setForm(state => ({ ...state, [id]: e }))
            }
            else if (typeof e?.target?.value === "string") {
                setForm(state => ({ ...state, [id]: e.target.value }))
            }
        }
    }

    return { form, setForm, set }
}