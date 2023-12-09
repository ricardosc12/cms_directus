import { SearchGameProps, searchGame } from "@/api/game";

export async function createPayloadSearchGame(props: SearchGameProps, size?: string) {
    const { ano, name, developers, publishers, ...filtersArray } = props

    let categoryFilters = {}

    Object.entries(filtersArray).forEach(([id, filter]) => {
        //@ts-ignore
        categoryFilters[id] = filter.join(',')
    })

    const resp = await searchGame({
        ano,
        name,
        developers,
        publishers,
        size: size || '1000',
        ...categoryFilters
    })

    return resp
}