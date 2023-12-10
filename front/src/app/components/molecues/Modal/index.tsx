import { CloseIcon } from '@/icons';
import { JSX, Show, createEffect, on } from 'solid-js';

interface ModalPros {
    isOpen: boolean;
    onClose: any;
    children: any;
}

const Modal = (props: ModalPros) => {

    let ref!: HTMLDivElement;

    function handleCloseOnBlur(e: FocusEvent) {
        if (e.target == ref) props.onClose()
    }

    return (
        <Show when={props.isOpen}>
            <div onclick={handleCloseOnBlur} ref={ref} class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <section class="relative bg-primary border-2 border-[var(--steam-color-off)] px-6 py-3 rounded-lg">
                    {props.children}
                    <CloseIcon onClick={props.onClose} class="cursor-pointer absolute top-3 right-3 text-2xl" />
                </section>
            </div>
        </Show>
    );
};

export default Modal;
