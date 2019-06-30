
// function

/**
 * 
 * @param {[Array, Array, [Array, Array, [Array, ...]]]} funcTree 
 * @param {Array} paramList 
 */

function groupPromiseToList(funcTree, paramList) {
    let list = funcTree.map(func => {
        let type = Object.prototype.toString.call(func)
        if (type === '[object Function]') {
            return func.call(this, paramList)
        } else if (type === '[object Array]') {
            return groupPromiseToList(func, paramList)
        }
    })
    return new Promise((resolve) => {
        Promise.all(list).then(() => {
            resolve(paramList)
        }).catch(() => {
            resolve(paramList)
        })
    })
}

// demo

let list = [{id: 1}, {id: 2}, {id: 3}]

groupPromiseToList([getNameById, [getContentFromA, getContentFromB]], list).then(res => {
    console.log(res)
})

function getNameById(paramList) {
    return new Promise((resolve) => {
        setTimeout(() => {
            paramList.forEach(item => {
                item.name = 'Martin Luther King'
            })
            resolve(paramList)
        }, 100)
    })
}

function getContentFromA(paramList) {
    return new Promise((resolve) => {
        setTimeout(() => {
            paramList.forEach(item => {
                if (item.id <= 2) {
                    item.content = 'I have a dream.'
                }
            })
            resolve(paramList)
        }, 200)
    })
}

function getContentFromB(paramList) {
    return new Promise((resolve) => {
        setTimeout(() => {
            paramList.forEach(item => {
                if (item.id > 2) {
                    item.content = 'Stride Toward Freedom'
                }
            })
            resolve(paramList)
        }, 300)
    })
}
