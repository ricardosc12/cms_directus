import { createContext, useContext } from "solid-js";
import { produce } from "solid-js/store"
import { createStore } from "solid-js/store";
import { Notify } from "./components/interfaces/notify";

const StoreContext = createContext<GameContextValue>();

interface GameContextValue {
    dados: {
        route: string;
        isLogging: boolean;
        user_email: string;
        notifications: Notify[];

    };
    dispatch: {
        setRoute: (props: string) => void;
        setIsLogging: (props: boolean) => void;
        setUserEmail: (props: string) => void;
        setNotifications: (props: Notify[]) => void;
    };
}
//@ts-ignore
export const useStore = (): GameContextValue => useContext<GameContextValue>(StoreContext);

export function StorageProvider(props: any) {

    const [state, set] = createStore({
        dados: {
            route: "players",
            isLogging: true,
            user_email: "root@root.com",
            notifications: [] as Notify[]
        }
    });

    const counter = {
        dados: state.dados,
        dispatch: {
            setRoute: (payload: string) => set(produce((state) => {
                state.dados.route = payload;
            })),
            setIsLogging: (payload: boolean) => set(produce((state) => {
                state.dados.isLogging = payload;
            })),
            setUserEmail: (payload: string) => set(produce((state) => {
                state.dados.user_email = payload;
            })),
            setNotifications: (payload: Notify[]) => set(produce((state) => {
                state.dados.notifications = payload;
            })),
        }
    }


    return (
        <StoreContext.Provider value={counter}>
            {props.children}
        </StoreContext.Provider>
    );
}
