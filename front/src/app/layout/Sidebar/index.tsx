import { For, createEffect, createMemo, createSignal, on, onMount } from 'solid-js'
import style from './style.module.css'
import { BookIcon, CheckIcon, ConfigIcon, GamesIcon, MailIcon, NotifyIcon, PassIcon, RoleIcon, TeamIcon, TeamsIcon, User2Icon, UserIcon } from '@/icons';
import { useStore } from '@/app/store';
import Modal from '@/app/components/molecues/Modal';
import { Input } from '@/app/components/atoms/Input';
import { Select } from '@/app/components/atoms/Select';
import { directusClient } from '../Header';
//@ts-ignore
import { createOptions } from "@thisbeyond/solid-select";
import { useForm } from '@/hooks/form';
import { Button } from '@/app/components/atoms/Button';
import { createUser } from '@directus/sdk';

interface RouteProps {
    id: string;
    title: string;
    icon: any;
}

export const routes = [
    { id: 'my_team', title: "Meu time", icon: TeamIcon },
    { id: 'team', title: "Times", icon: TeamsIcon },
    { id: 'players', title: "Usuários", icon: UserIcon },
    { id: 'notify', title: "Notificações", icon: NotifyIcon },
]

export function Sidebar() {

    const { dados, dispatch } = useStore()
    const [modalNewUser, setModalNewUser] = createSignal(false)

    const { form, set } = useForm()

    const roles = createMemo(() => dados.roles)
    const [rolesOptions, setRoleOptions] = createSignal([])

    const [sets, setSets] = createSignal('Jogador')

    const [perfilImg, setPerfilImg] = createSignal('user.png')

    createEffect(on(roles, (state) => {
        setRoleOptions(createOptions(state, { key: 'name' }))
    }))

    createEffect(on(sets, () => {
        setPerfilImg('user.png')
    }))

    function handleConfig() {
        //modal de configurações
    }

    async function handleNewUser() {

        const email = form().email?.includes("@") ? form().email : form().email + "@" + form().email + ".com"

        const request = {
            ...form(),
            //@ts-ignore
            role: form().role?.id || "d57e7a31-ac8d-40e7-a570-0b3f1e2d481b",
            email: email,
            image: perfilImg()
        }

        if (Object.values(request).length != 5) {
            throw new Error("Campos obrigatorios")
        }

        await directusClient.request(createUser(request))
        document.getElementById("get-users-bt")?.click()
    }

    const playerImage =
    {
        Jogador: [
            'alchemist', 'antimage', 'clinkz', 'drow_ranger',
            'invoker', 'phantom_assassin', 'pudge', 'riki', 'slark'
        ],
        Organizador: [
            'anna', 'dendi', 'miracle', 'seucreyson', 'topson'
        ]
    }


    return (
        <div class={style.root}>
            <img class='ml-10' width="60px" src="logo.png" alt="STEAM" />
            <nav>
                <ul>
                    <For each={routes}>
                        {(item: RouteProps) => (
                            <li
                                aria-checked={dados.route == item.id}
                                onclick={_ => dispatch.setRoute(item.id)}>
                                {item.id == 'notify' ? (
                                    <div class={style.icon_notify}>{item.icon()}</div>
                                ) : item.icon()}
                                <p>{item.title}</p>
                            </li>
                        )}
                    </For>
                </ul>
                <ul>
                    <li onclick={() => setModalNewUser(true)}>
                        <User2Icon />
                        <p>Criar Usuário</p>
                    </li>
                    <li onclick={handleConfig}>
                        <ConfigIcon />
                        <p>Configuração</p>
                    </li>
                </ul>
            </nav>
            <Modal isOpen={modalNewUser()} onClose={() => setModalNewUser(false)}>
                <div class='w-[500px]'>
                    <div class='flex items-center space-x-3 mb-3'>
                        <h3 class='font-medium text-lg'>Criar novo usuário</h3>
                        <UserIcon />
                    </div>
                    <div class='space-y-3'>
                        <div class='flex space-x-3'>
                            <Input onchange={set('first_name')} class='w-full' placeholder="Nome" icon={UserIcon} />
                            <Select initialValue={{ name: "Jogador", id: "d57e7a31-ac8d-40e7-a570-0b3f1e2d481b" }}
                                onChange={(e: any) => {
                                    setSets(e.name),
                                        set('role')(e);
                                }} class='w-[200px] max-w-[200px]' icon={RoleIcon}
                                placeholder='Papel' {...rolesOptions()}
                            />
                        </div>
                        <Input onchange={set('email')} placeholder="Email" icon={MailIcon} />
                        <Input onchange={set('password')} type="password" placeholder="Senha" icon={PassIcon} />
                    </div>
                    <div class='flex items-center justify-center mt-5 space-x-3'>
                        <div class='w-[100px] h-[100px] rounded-full overflow-hidden'>
                            <img width={100} src={perfilImg()} alt="" />
                        </div>
                        <div class={`grid ${sets() == 'Jogador' ? "grid-cols-3 grid-rows-3" : "grid-cols-3 grid-rows-2"} gap-1 w-max`}>
                            {/* @ts-ignore */}
                            <For each={playerImage[sets()]}>
                                {(image_name) => <img onclick={_ => setPerfilImg(image_name + '.png')} class='cursor-pointer' width={sets() == 'Jogador' ? 60 : 90} src={image_name + '.png'}></img>}
                            </For>
                        </div>
                    </div>
                    <div class='mt-5 flex justify-end'>
                        <Button class='px-3' icon={CheckIcon} onclick={handleNewUser}>Criar usuário</Button>
                    </div>
                </div>
            </Modal>
        </div >
    )
}