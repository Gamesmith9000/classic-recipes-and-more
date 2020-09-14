export function arraysHaveMatchingValues (array1, array2) {
    if(array1.length !== array2.length) {
        return false;
    }
    return array1.every((element, index) => element === array2[index]);
}

export function bumpArrayElement (array, index, direction) {
    if(direction !== -1 && direction !== 1) {
        return array;
    }
    
    let start = array.slice(0, index);
    let end = array.slice(index, array.length);
    const item = end.shift();

    if(direction === -1) {
        const poppedItem = start.pop();
        return start.concat(item).concat(poppedItem).concat(end);
    }
    else {
        const shiftedItem = end.shift();
        return start.concat(shiftedItem).concat(item).concat(end);
    }
}
