import { createContext, useContext } from "solid-js";
import { produce } from "solid-js/store"
import { createStore } from "solid-js/store";
import { GameProps } from "../../interfaces/game";

const LibStoreContext = createContext<LibContextValue>();

interface LibContextValue {
    dados: {
        isInserting: boolean;
        games: Array<GameProps> | [];
    };
    dispatch: {
        changeInputActive: () => void,
        setGames: (games: Array<GameProps>) => void
    };
}
//@ts-ignore
export const useLibStore = (): LibContextValue => useContext<LibContextValue>(LibStoreContext);

export function LibStorageProvider(props: any) {

    const [state, set] = createStore({
        dados: {
            isInserting: false,
            games: [],
        }
    });

    const counter = {
        dados: state.dados,
        dispatch: {
            changeInputActive: () => set(produce((state) => {
                state.dados.isInserting = !state.dados.isInserting;
            })),
            setGames: (games: Array<GameProps>) => set(produce((state) => {
                state.dados.games = games as any;
            })),
        }
    }


    return (
        <LibStoreContext.Provider value={counter}>
            {props.children}
        </LibStoreContext.Provider>
    );
}