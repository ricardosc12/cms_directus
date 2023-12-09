import { JSX } from 'solid-js/jsx-runtime'
import { SearchGameProps } from "@/api/game";
import { createContext, useContext } from "solid-js";
import { produce } from "solid-js/store"
import { createStore } from "solid-js/store";

const GamesContext = createContext<GameContextValue>();

type Event = MouseEvent & {
    currentTarget: HTMLDivElement;
    target: Element;
};

interface GameContextValue {
    dados: {
        filters: SearchGameProps,
        name: any;
        isMagic: boolean | undefined;
        isAdvanced: boolean | undefined;
    };
    dispatch: {
        setFilters: (props: SearchGameProps) => void,
        setNameFilter: (props: string) => void,
        setMagic: (props: Event) => void
        setAdvanced: (props: Event) => void
    };
}
//@ts-ignore
export const useGameStore = (): GameContextValue => useContext<GameContextValue>(GamesContext);

export function GameStorageProvider(props: any) {

    const [state, set] = createStore({
        dados: {
            filters: {},
            name: "",
            isMagic: true,
            isAdvanced: false
        }
    });

    const counter = {
        dados: state.dados,
        dispatch: {
            setFilters: (payload: SearchGameProps) => set(produce((state) => {
                state.dados.filters = { ...payload }
            })),
            setNameFilter: (name: any) => set(produce((state) => {
                state.dados.name = name?.target?.value || undefined
            })),
            setMagic: () => set(produce((state) => {
                state.dados.isMagic = !state.dados.isMagic
            })),
            setAdvanced: () => set(produce((state) => {
                state.dados.isAdvanced = !state.dados.isAdvanced;
            })),
        }
    }


    return (
        <GamesContext.Provider value={counter}>
            {props.children}
        </GamesContext.Provider>
    );
}