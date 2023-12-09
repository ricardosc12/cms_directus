import { JSX } from 'solid-js/jsx-runtime'
import { RootToggleButton } from './style';
import { splitProps } from "solid-js";

interface ToggleProps extends JSX.HTMLAttributes<HTMLDivElement> {
    icon?: any;
    color?: 'azulzinho' | 'azul';
    value?: boolean;
    class?: string;
    children?: string;
}

export function ToggleButton(props: ToggleProps) {
    const [local, others] = splitProps(props, ["icon", "color", "value", "class"]);
    return (
        <div class={RootToggleButton({
            color: local.color,
            class: local.class,
            active: local.value
        })} aria-checked={local.value} {...others}>
            {others.children ? <p>{others.children}</p> : ''}
            {local.icon ? local.icon() : ''}
        </div>
    )
}