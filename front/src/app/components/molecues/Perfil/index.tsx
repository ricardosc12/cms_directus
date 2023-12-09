import style from './style.module.css'

export function Perfil() {
    return (
        <div class={style.root}>
            <span class='mr-3 text-right'>
                <h4 class='text-sm font-medium text-slate-300'>Invoker</h4>
                <h5 class='text-xs font-medium text-slate-400'>Admin</h5>
            </span>
            <div class="w-10 rounded-full overflow-auto">
                <img src="/invo.jfif" alt="" />
            </div>
        </div>
    )
}