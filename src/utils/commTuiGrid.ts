import Grid from 'tui-grid';
import axios from "axios";

export type gridIndexSig = {
    [key: string]: number | string[] | string | any | null;
}

export const gridInit = (gridElementId: string,
                         columns: {header: string, name: string, sortable?: boolean, resizeable?: boolean, width?: number}[],
                         _clickCallback ?: ((data: any, srk: any) => void) | null) =>
{
    const el: HTMLElement | null = document.getElementById(gridElementId);

    if(!el || !gridElementId) {
        return ;
    }

    for(const child of el.childNodes) {
        el.removeChild(child);
    }

    const grid: gridIndexSig = new Grid({
        el: el,
        columns: columns,
        scrollX: true,
        scrollY: true,
        rowHeight: 30,
    });

    grid["_srk"] = -1;
    grid["_crud"] = false;

    if (typeof _clickCallback === 'function') {
        grid.on('click', function (ev: gridIndexSig) {
            if (grid["_crud"]) {
                return;
            }

            if (typeof ev.rowKey == "undefined") {
                return;
            }

            if (grid["_srk"] === ev.rowKey) {
                grid.removeRowClassName(grid["_srk"], 'grid_row_active');
                grid["_srk"] = -1;
            } else {
                if (grid["_srk"] !== -1) {
                    grid.removeRowClassName(grid["_srk"], 'grid_row_active');
                }
                grid["_srk"] = ev.rowKey;
                grid.addRowClassName(grid["_srk"], 'grid_row_active');
            }

            const _rd = grid.getRow(ev.rowKey);

            for (const key in _rd) {
                const el: any = document.getElementById(`${key}`);
                if (el && grid["_srk"] !== -1) {
                    el.value = _rd[key];
                } else if (el && grid["_srk"] === -1) {
                    el.value = null;
                }
            }

            if (_clickCallback != null) _clickCallback(_rd, grid["_srk"]);
        });
    }

    return grid;
}

export async function reloadGrid(grid: gridIndexSig | undefined, requestType: string, url: string, data: any, _callbackFunction ?: ((data: any) => void) | null, _errorCallback?: ((data: any) => void) | null) {
    const options = {
        url: url,
        method: requestType,
        params: data,
        headers: {Authorization: localStorage.getItem("token")}
    }
    await axios(options).then(response => {
        if (response.data !== null && grid !== undefined && response.data !== '') {
            // grid.resetData([]);
            grid.resetData(response.data);
            grid["_srk"] = -1;
        }
        _callbackFunction && _callbackFunction(response.data);
    }).catch(error => {
        if (error.response.status === 401) {
            alert("로그인 토큰이 만료되어 로그인 페이지로 이동합니다.");
            window.location.href = "/";
        } else {
            if (_errorCallback != null) _errorCallback(error);
        }
    })
}

Grid.setLanguage("ko", {
    display: {
        noData: "정보없음"
    }
})