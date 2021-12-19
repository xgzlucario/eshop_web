export let chooseRandomPic = function (i) {
    let picArr = [
        'https://img2.baidu.com/it/u=3401354323,2243296256&fm=26&fmt=auto',
        'https://img2.baidu.com/it/u=3472738174,3678135164&fm=26&fmt=auto',
        'https://img0.baidu.com/it/u=3005128094,257408493&fm=26&fmt=auto',
        'https://img2.baidu.com/it/u=876171292,2977400590&fm=26&fmt=auto',
        'https://img0.baidu.com/it/u=890295679,382199073&fm=26&fmt=auto',
        'https://img0.baidu.com/it/u=2283383338,94790160&fm=26&fmt=auto',
    ]
    if (i === 123) return picArr[5]

    let index = (i + new Date().getSeconds()) % picArr.length
    return picArr[index]
}