import { JSX } from 'solid-js/jsx-runtime'
import style from './style.module.css'
import { splitProps } from "solid-js";

interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
    icon?: any;
}

export function Button(props: ButtonProps) {
    const [local, others] = splitProps(props, ["class", "icon"]);

    return (
        <div class={`${style.root_button}${local.class ? (" " + local.class) : ''}`}>
            <button {...others}>
                {local.icon ? local.icon() : ''}
                {props.children}
            </button>
        </div>
    )
}