const isSortedAscBy = (array, key) => {

    for(let i = 0; i < array.length - 1; i++) {

        if (array[i][key] > array[i + 1][key]) {
            return false;
        }

    }

    return true;

}

const isSortedDescBy = (array, key) => {

    for(let i = 0; i < array.length - 1; i++) {

        if (array[i][key] < array[i + 1][key]) {
            return false;
        }

    }

    return true;

}

module.exports = {

    isSortedAscBy,
    isSortedDescBy

}