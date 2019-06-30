# groupPromiseToList

## Describe

基于Promise.all()，用于列表数据聚合，将聚合过程扁平化，聚合速度取决于最慢接口的返回速度。

## Function

```javascript
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
```

## Demo

```javascript
let list = [{id: 1}, {id: 2}, {id: 3}]

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

groupPromiseToList([getNameById, [getContentFromA, getContentFromB]], list).then(res => {
    console.log(res)
})

```

# Result

```json
[
    {
        "id":1,
        "name":"Martin Luther King",
        "content":"I have a dream."
    }, {
        "id":2,
        "name":"Martin Luther King",
        "content":"I have a dream."
    }, {
        "id":3,
        "name":"Martin Luther King",
        "content":"Stride Toward Freedom"
    }
]
```