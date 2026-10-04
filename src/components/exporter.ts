import { saveAs } from "file-saver";

interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface Zone {
    visible: boolean;
    hitRect: Rect;
    targetRect: Rect;

}

export default function (rowGap: number[], colGap: number[], border: number) {
    let x: number = 0;
    let y: number = 0;
    let zoneList: Zone[] = [];
    let borderList: Zone[] = [];
    let pointList: Zone[] = [];

    rowGap.forEach((h, ih) => {
        colGap.forEach((w, iw) => {

            // 本体判定框
            zoneList.push({
                visible: true,
                hitRect: { x, y, w, h },
                targetRect: { x, y, w, h }
            });
            if (ih < rowGap.length - 1) {
                borderList.push({
                    visible: false,
                    // 下方的横边
                    hitRect: { x: x, y: y + h - border, w: w, h: border * 2 },
                    // 扩展为竖方向上两格的大小
                    targetRect: { x: x, y: y, w: w, h: h + rowGap[ih + 1] }
                });
            }
            if (iw < colGap.length - 1) {
                borderList.push({
                    visible: false,
                    // 右方的竖边
                    hitRect: { x: x + w - border, y: y, w: border, h: h },
                    // 扩展为横方向上两格的大小
                    targetRect: { x: x, y: y, w: w + colGap[iw + 1], h: h }
                });
            }
            // 右下方的点
            if (ih < rowGap.length - 1 && iw < colGap.length - 1) {
                pointList.push({
                    visible: false,
                    // 右下的角点
                    hitRect: { x: x + w - border, y: y + h - border, w: border * 2, h: border * 2 },
                    // 扩展为以该点为中心2x2的大小
                    targetRect: { x: x, y: y, w: w + colGap[iw + 1], h: h + rowGap[ih + 1] }
                })
            }

            x += w;
        });
        x = 0;
        y += h;
    });

    // 优先级高的排前面
    const result: Zone[] = pointList.concat(borderList).concat(zoneList);
    const opt: string = JSON.stringify(result);
    saveAs(new Blob([opt], { type: 'text/plain' }), "setting.json");
}