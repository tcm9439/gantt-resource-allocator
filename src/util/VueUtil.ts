export class VueUtil{
    // https://github.com/twickstrom/vue-force-next-tick/blob/master/src/index.js
    public static onRenderComplete(callback: any){
        const doubleRequestAnimationFrame = (callback: any) => {
            requestAnimationFrame(() => {
                console.log('doubleRequestAnimationFrame 1  ')
                requestAnimationFrame(callback)
            })
            }
            
        const forceNextTick = (callback: any) => {
            if (callback && typeof callback === 'function') {
                doubleRequestAnimationFrame(callback)
            } else {
                return new Promise(resolve => {
                doubleRequestAnimationFrame(resolve)
                })
            }
        }

        forceNextTick(callback)
    }



}