import { css } from '@stitches/core'


export function styled(el: string, props: any) {
    return (args: any) => {
        const _css = css(el, props)(args)
        if (args.class) {
            _css.className += ` ${args.class}`
        }
        return _css.className
    }
}
