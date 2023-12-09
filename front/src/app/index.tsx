import { Layout } from "./layout";
import { Sidebar } from "./layout/Sidebar";
import { StorageProvider } from "./store";

export default function App() {

    return (
        <StorageProvider>
            <div class="flex bg-[var(--background-color)]">
                <Sidebar />
                <Layout />
            </div>
        </StorageProvider>
    )
}