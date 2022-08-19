import React, {Component} from "react";
import {Button, Card, Table,Nav} from "react-bootstrap";
import {Book} from "../../types/CustomTypes";
import Api from "../../http/Api";
import {NavLink} from "react-router-dom";
import {AddBook} from "../../component/AddBook";

type Props = {

};

type State = {
    books: Book[],
    selectedBook:Book | undefined
    page:number,
    limit:number,
    searchQuery:string,
    hasNext:boolean,
    showBookModal: boolean
};

export class Books extends Component<Props,State>{

    state = {
        books: [],
        page:0,
        limit:50,
        searchQuery:'',
        hasNext:false,
        showBookModal:false,
        selectedBook: undefined,
    }

    constructor(props: Props) {
        super(props);
    }
    
    componentDidMount() {
        this.getPaginatedBooks();
    }

    getPaginatedBooks = () =>{
        Api.getPaginatedBooks(this.state.page,this.state.limit,this.state.searchQuery)
            .then((response) => {
                this.setState({
                    books: response,
                })
        }).catch((error)=>{
            console.log(error);
        });
    }

    addNewBook = () =>{
        this.setState({
            showBookModal:true
        });
    }

    onBookModalClose = (refresh=false) =>{
        this.setState({
            showBookModal:false,
            selectedBook: undefined,
        });
        if(refresh){
            this.getPaginatedBooks();
        }
    }

    editBook = (book: Book) => {
        this.setState({
            selectedBook: book,
            showBookModal: true,
        });
    }

    renderBookModal = () => {
        return (
            <AddBook book={this.state.selectedBook} showModal={this.state.showBookModal} closeModal={this.onBookModalClose}/>
        );
    }

    deleteBook = (book: Book)=> {
        Api.deleteBook(book.id as number).then((response)=>{
            console.log(response);
            if(response){
                this.getPaginatedBooks();
            }
        }).catch((error)=>{
            alert(error);
        });
    }

    render() {
        return (
            <Card>
                <Card.Body>
                    <Card.Title>Books</Card.Title>
                    <Button variant="info" onClick={this.addNewBook}>Add new Book</Button>
                    <div className="mt-2">
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>ISBN</th>
                                <th>Author</th>
                                <th>Publisher</th>
                                <th>Published On</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.books?.map((item: Book, index) => {
                                    return <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.title}</td>
                                        <td>{item.isbn}</td>
                                        <td>{item.author?.name}</td>
                                        <td>{item.publisher?.name}</td>
                                        <td>{item.publishedOn?.toString()}</td>
                                        <td>
                                            <Nav variant={'pills'}>
                                                <Nav.Link  as={NavLink} to={`/books/${item.id}`}>VIEW</Nav.Link>
                                            </Nav>
                                            <Button variant="info" size="sm" onClick={()=>this.editBook(item)}>Edit</Button>
                                            <Button variant="danger" size="sm" onClick={()=>this.deleteBook(item)}>Delete</Button>
                                        </td>
                                    </tr>
                                })
                            }
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
                {this.renderBookModal()}
            </Card>
        );
    }

}