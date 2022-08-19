import axios from "./axios";
import {Auth, Book, DefaultResponse, Loan, Member} from "../types/CustomTypes";
import endpoints from "./endpoints";
import {AxiosResponse} from "axios";

export default {

    signIn(username: string, password: string): Promise<Auth> {
        return axios.post<Auth>(endpoints.auth.login, {'username': username, 'password': password})
            .then((response: AxiosResponse<Auth>) => {
                return Promise.resolve(response.data);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },

    getPaginatedBooks(page:number, limit:number,searchQuery:string=''): Promise<Book[]> {
        const params = {
            'page':page,
            'limit':limit,
            'searchQuery':searchQuery
        };
        return axios.get<Book[]>(endpoints.books.books, {params: params})
            .then((response: AxiosResponse<any>) => {
                return Promise.resolve(response.data.content as Book[]);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },

    getBookById(id: number): Promise<Book> {
        return axios.get<Book>(endpoints.books.books+`/${id}`)
            .then((response: AxiosResponse<any>) => {
                return Promise.resolve(response.data as Book);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },


    getLoanHistoryByBookId(id: number): Promise<Loan[]> {
        return axios.get<Loan[]>(endpoints.books.loan(id))
            .then((response: AxiosResponse<any>) => {
                return Promise.resolve(response.data as Loan[]);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },

    getMembers(): Promise<Member[]> {
        return axios.get<Member[]>(endpoints.members.members)
            .then((response: AxiosResponse<any>) => {
                return Promise.resolve(response.data as Member[]);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },


    returnBookByLoanId(id: number): Promise<Loan> {
        const data = {
            'returnedOn':new Date().toISOString(),
        }
        return axios.patch<Loan>(endpoints.books.loan_+`/${id}`, data)
            .then((response: AxiosResponse<any>) => {
                return Promise.resolve(response.data as Loan);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },


    loanBookToMember(body: any, bookId: any): Promise<Loan> {
        return axios.post<Loan>(endpoints.books.loan(bookId), body)
            .then((response: AxiosResponse<any>) => {
                return Promise.resolve(response.data as Loan);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },


    createBook(body: any): Promise<DefaultResponse> {
        return axios.post<DefaultResponse>(endpoints.books.books, body)
            .then((response: AxiosResponse<DefaultResponse>) => {
                return Promise.resolve(response.data);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },


    editBook(body: any): Promise<Book> {
        return axios.put<Book>(endpoints.books.books+`/${body.id}`, body)
            .then((response: AxiosResponse<Book>) => {
                return Promise.resolve(response.data);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },


    deleteBook(bookId: number): Promise<DefaultResponse> {
        return axios.delete<DefaultResponse>(endpoints.books.books+`/${bookId}`)
            .then((response: AxiosResponse<DefaultResponse>) => {
                return Promise.resolve(response.data);
            }).catch((error) => {
                return Promise.reject(error);
            });
    },

}