export interface Room{
    id:number,
    name: string,
    createdAt:Date,
    users: User[],
}

export interface User{
    id: number,
    username: string,
    socketId: string,   
    room_id:string,
}
