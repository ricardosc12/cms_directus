import { styled } from "@/utils/styled";

export const RootToggleButton = styled('div', {
    display: 'flex',
    cursor: 'pointer',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px',
    background: 'var(--steam-color-off)',
    borderRadius: '1000px',
    userSelect: 'none',
    "& > svg": {
        filter: 'invert(43%) sepia(82%) saturate(562%) hue-rotate(166deg) brightness(106%) contrast(109%)'
    },
    "& > p": {
        fontWeight: '500',
        fontSize: '14px',
        marginLeft: '12px'
    },
    "& > p + svg": {
        marginLeft: '8px',
        marginRight: '8px'
    },
    variants: {
        color: {
            azul: {
                background: 'var(--steam-color)',
            },
            azulzinho: {
                background: 'var(--steam-color)',
            }
        },
        active: {
            true: {
                background: 'var(--steam-color)',
                boxShadow: '0px 0px 8px var(--steam-color)',
                "& > svg": {
                    filter: 'none',
                },
                '&:hover': {
                    background: 'var(--steam-color-hover)',
                    boxShadow: '0px 0px 9px var(--steam-color)',
                },
            }
        }
    }
})