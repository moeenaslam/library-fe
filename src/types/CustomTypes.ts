export interface Auth {
    accessToken: string,
    username: string
}

export interface DefaultResponse {
    success:boolean,
    message: string,
}

export interface Book {
    title: string,
    isbn: string,
    genre: string,
    author: any,
    publishedOn: Date,
    publisher: any,
    id: number | undefined,
    availableToLoan: boolean

}

export interface Loan {
    loanedAt: Date,
    dueDate: Date,
    returnedOn: Date,
    fee: number,
    loanedToMemberName: string,
    id: number,
}

export interface Member {
    name: string,
    address: string,
    id: number
}