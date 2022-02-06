// TypeScript as JS does not support Enums
export enum StateEnum {
    unknown = "-",
    unsolved = "not solved",
    solved = "solved",
    found = "found"
};

export function getStateKeyByValue(value:String){
    return Object.keys(StateEnum)[Object.values(StateEnum).findIndex(x => x==value)];
};
