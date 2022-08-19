export default {
    auth: {
        login: 'auth/login',
    },
    books: {
        books: 'books',
        loan: function (bookId: number) {
            return `books/${bookId}/loans`;
        },
        loan_:'books/loans'
    },
    members: {
        members: 'members'
    }
}