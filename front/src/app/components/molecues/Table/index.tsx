//@ts-nocheck
import { createEffect, createMemo, on, onCleanup, onMount } from 'solid-js';
import './style.css'
import { GameProps } from '../../interfaces/game';

export function TableGrid(props) {

    const data = createMemo(() => props.games.data)

    let gridElement;
    let updateVisibleRows;
    let resizeFunction;
    let renderRows;
    const rowHeight = 200;
    const rowWidth = 310;
    let colCount = Number(Math.floor(window.innerWidth / rowWidth));
    const bufferRowCount = 3;
    let mount = false;


    createEffect(on(data, (games) => {

        gridElement.scrollTop = 0

        const rowCount = games.length / colCount;
        let visibleRowCount = Math.ceil(gridElement.clientHeight / rowHeight);

        if (document.getElementById('gridContent')) {
            const gridContent = document.getElementById('gridContent')
            gridContent.style.height = `${rowCount * rowHeight}px`;
        }

        else {
            const gridContent = document.createElement('div');
            gridContent.id = 'gridContent';
            gridContent.style.height = `${rowCount * rowHeight}px`;
            gridElement.appendChild(gridContent);
        }

        let startIndex = 0;
        let endIndex = Math.min(startIndex + visibleRowCount, rowCount);

        updateVisibleRows = () => {
            const scrollTop = gridElement.scrollTop;
            let newStartIndex = Math.floor(scrollTop / rowHeight) - bufferRowCount;
            let newEndIndex = newStartIndex + visibleRowCount + 2 * bufferRowCount;

            newStartIndex = Math.max(newStartIndex, 0);
            newEndIndex = Math.min(newEndIndex, rowCount);

            if (newStartIndex !== startIndex || newEndIndex !== endIndex) {
                startIndex = newStartIndex;
                endIndex = newEndIndex;
                renderRows();
            }
        }

        renderRows = () => {
            gridContent.innerHTML = '';

            for (let i = startIndex; i < endIndex; i++) {
                const rowDiv = document.createElement('div');
                rowDiv.className = 'row';
                rowDiv.style.top = `${i * rowHeight}px`;

                for (let j = 0; j < colCount; j++) { // Número de colunas
                    let game: GameProps = games[i * colCount + j]
                    if (!game) continue
                    const cellDiv = document.createElement('div');
                    cellDiv.className = 'cell';
                    cellDiv.innerHTML =
                        `
                        <div class="loading_image">
                            <img alt="steam-logo.png" class="image" src="${game.image}"></img>
                        </div>
                        <div class="info flex-col w-full">
                            <div class="flex flex-row items-center pt-1">
                            <h3 class="truncate">${game.name}</h3>
                            <span class="price my-auto ml-auto">${game.price || "Free "}</span>
                            </div>
                            <p class="truncate">${game.genres}</p>
                        </div>
                    `;
                    rowDiv.appendChild(cellDiv);
                }

                gridContent.appendChild(rowDiv);
            }
        }

        resizeFunction = (e) => {
            try {
                const { innerHeight, innerWidth } = e.target
                colCount = Number(Math.floor(innerWidth / rowWidth))
                updateVisibleRows()
                renderRows()
            } catch { }
        }


        if (!mount) {
            window.addEventListener("resize", resizeFunction)
            gridElement.addEventListener('scroll', () => {
                setTimeout(updateVisibleRows)
            });
            mount = true
        }

        renderRows();
    }))

    onCleanup(() => {
        window.removeEventListener("resize", resizeFunction)
    })

    return (
        <div ref={gridElement} id="grid"></div>
    )
}