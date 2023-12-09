import { createContext, useContext } from "solid-js";
import { produce } from "solid-js/store"
import { createStore } from "solid-js/store";

const StoreContext = createContext<GameContextValue>();

interface GameContextValue {
    dados: {
        route: string;
    };
    dispatch: {
        setRoute: (props: string) => void,
    };
}
//@ts-ignore
export const useStore = (): GameContextValue => useContext<GameContextValue>(StoreContext);

export function StorageProvider(props: any) {

    const [state, set] = createStore({
        dados: {
            route: "loja",
        }
    });

    const counter = {
        dados: state.dados,
        dispatch: {
            setRoute: (payload: string) => set(produce((state) => {
                state.dados.route = payload;
            })),
        }
    }


    return (
        <StoreContext.Provider value={counter}>
            {props.children}
        </StoreContext.Provider>
    );
}