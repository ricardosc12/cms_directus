import { AddIcon } from '@/icons'
import style from './style.module.css'
import { useLibStore } from '../../store'

export default function InsertButton() {

    const { dispatch } = useLibStore()

    return (
        <div class={style.root} onclick={dispatch.changeInputActive}>
            <span>
                <AddIcon class="text-4xl" />
            </span>
        </div>
    )
}