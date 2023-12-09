//@ts-ignore
import { SearchGameProps } from "@/api/game"
import { useGameStore } from "../../storage"
import { createEffect, createMemo, createSignal, on } from "solid-js"
import { createStore } from "solid-js/store";
import { createPayloadSearchGame } from "./hooks/payload"
import { GameProps } from "@/app/components/interfaces/game"

const ListItem = (props: any) => {
    const gameProps: GameProps = props.item
    return (
        <div
            style={props.style}
            class='w-full text-slate-50'
            tabIndex={props.tabIndex}
            role="listitem"
        >
            <div class="text-white">{gameProps.name}</div>
        </div>
    )
}

export function GamesList() {

    const { dados } = useGameStore()

    const filters = createMemo(() => dados.filters)

    const [games, setGames] = createStore<{ data: Array<GameProps> }>({
        data: []
    });

    let mount = false

    async function handleAdvancedSearch(dados: SearchGameProps) {
        if (!mount) {
            mount = true
            return
        }
        const resp = await createPayloadSearchGame(dados, '1000')

        if (resp.status === 200) {
            setGames({ data: resp.data })
        }
        else {
            setGames({ data: [] })
        }
    }
    createEffect(on(filters, (f) => {
        handleAdvancedSearch({ ...f, name: dados.name })
    }))

    let scrollTargetElement!: HTMLDivElement

    return <TableGrid games={games} />

    return (
        <div style={{ overflow: 'auto' }} ref={scrollTargetElement}>
            {/* <RowVirtualizerFixed games={games} /> */}
            <TableGrid data={Array.from(Array(5000))} />
        </div>
    )
}

import { createVirtualizer } from "@tanstack/solid-virtual";
import { LazyImage } from "@/app/components/molecues/Search";
import { TableGrid } from "@/app/components/molecues/Table";

function RowVirtualizerFixed(props: any) {

    const games = createMemo(() => props.games.data)

    let parentRef: any;

    const rowVirtualizer = createMemo(() => {
        return createVirtualizer({
            count: props.games.data.length,
            getScrollElement: () => parentRef,
            estimateSize: () => 120,
            overscan: 5,
        })
    })

    createEffect(on(games, () => {
        rowVirtualizer().scrollToIndex(0)
    }, { defer: true }))

    return (
        <>
            <div
                ref={parentRef}
                class="List"
                style={{
                    height: `500px`,
                    width: `100%`,
                    overflow: 'auto',
                }}
            >
                <div
                    style={{
                        height: `${rowVirtualizer().getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {rowVirtualizer().getVirtualItems().map((virtualRow: any) => (
                        <div
                            class={virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: `${virtualRow.size}px`,
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                        >
                            <div class="flex">
                                <img width="250" src={props.games.data[virtualRow.index]?.image} />
                                <p>{props.games.data[virtualRow.index]?.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}