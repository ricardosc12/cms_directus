//@ts-ignore
import { Select as SelectSolid, CreateSelectProps } from "@thisbeyond/solid-select";
import { splitProps } from "solid-js";
import './style.css'
import './custom.css'

interface SelectProps extends CreateSelectProps {
    icon?: any;
    placeholder?: string;
    class?: string;
    onChange?: any;
    multiple?: boolean;
}

export function Select(props: SelectProps) {
    const [local, others] = splitProps(props, ["icon", "class"]);
    return (
        <div class={`flex items-center w-full custom ${local.class ? ` ${local.class}` : ''}`}>
            {local.icon ? local.icon() : ''}
            <SelectSolid class="w-full" {...others} />
        </div>
    )
}