export function useDebouce(func: (props: any) => {}, time = 100) {

    let timer: NodeJS.Timer;

    return (props: any) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func(props)
        }, time);
    }
}